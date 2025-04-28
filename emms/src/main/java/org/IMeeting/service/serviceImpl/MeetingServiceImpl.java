package org.IMeeting.service.serviceImpl;

import org.IMeeting.entity.*;
import org.IMeeting.repository.*;
import org.IMeeting.service.DepartmentService;
import org.IMeeting.service.MeetingService;
import org.IMeeting.service.UserInfoService;
import org.IMeeting.util.TimeUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;


@Service
public class MeetingServiceImpl implements MeetingService {
    @Autowired
    private MeetingRoomParameterRepository meetingRoomParameterRepository;
    @Resource
    private MeetingRoomRepository meetingRoomRepository;
    @Autowired
    private MeetingRoomDepartmentRepository meetingRoomDepartmentRepository;
    @Autowired
    private EquipRepository equipRepository;
    @Autowired
    private OutsideJoinPersonRepository outsideJoinPersonRepository;
    @Autowired
    private GroupRepository groupRepository;
    @Autowired
    private MeetingRoomEquipRepository meetingRoomEquipRepository;
    @Autowired
    private MeetingRepository meetingRepository;
    @Autowired
    private UserInfoService userInfoService;
    @Autowired
    private JoinPersonRepository joinPersonRepository;
    @Autowired
    private CoordinateInfoRepository coordinateInfoRepository;
    @Autowired
    private LeaveInformationRepository leaveInformationRepository;
    @Autowired
    private DepartmentService departmentService;
    @Autowired
    private PushMessageRepository pushMessageRepository;

    @Override
    public MeetingRoomParameter selectParameter(Integer tenantId){
        return meetingRoomParameterRepository.findByTenantId(tenantId);
    }

    @Override
    public List<MeetingRoom> getEffectiveMeetingRoom(HttpServletRequest request){
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        Integer departId = (Integer) request.getSession().getAttribute("departId");
        List<MeetingRoom> meetingRooms = new ArrayList<>();
        List<MeetingRoom> allMeetingRooms = meetingRoomRepository.findByTenantId(tenantId);
        for (MeetingRoom meetingRoom : allMeetingRooms) {
            int bol = 0;
            Integer meetingRoomId = meetingRoom.getId();
            List<MeetingRoomDepartment> meetingRoomDepartments = meetingRoomDepartmentRepository.findByMeetingRoomId(meetingRoomId);
            if (meetingRoomDepartments.isEmpty()){
                bol = 1;
            } else {
                for (MeetingRoomDepartment meetingRoomDepartment : meetingRoomDepartments) {
                    if (meetingRoomDepartment.getDepartId().equals(departId)){
                        if (meetingRoomDepartment.getStatus().equals(1)){
                            bol = 1;
                        }
                        break;
                    }
                }
            }
            if (bol == 1){
                meetingRooms.add(meetingRoom);
            }
        }
        return meetingRooms;
    }

    @Override
    public List<Equip> selectEquip(Integer tenantId){
        return equipRepository.findByTenantId(tenantId);
    }

    @Override
    public List<MeetingRoomEquip> selectMeetingRoomEquip(Integer meetingRoomId){
        return meetingRoomEquipRepository.findByMeetroomId(meetingRoomId);
    }

    @Override
    public ServerResult toReserveIndex(HttpServletRequest request){
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        // 前端cookie 丢失、后端session丢失、session过期等导致参数为空
        if (tenantId == null){
            return ServerResult.failWithMessage("No session found.");
        }
        MeetingRoomParameter meetingRoomParameter = selectParameter(tenantId);
        // 可预定的会议室
        List<MeetingRoom> meetingRooms = getEffectiveMeetingRoom(request);
        //获取每个会议室对应的设备功能集合，需要前端存储
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String time = sdf.format(new java.util.Date());
        List<Object> meetingRoomEquipResult = new ArrayList<>();
        List<List> todayMeetings = new ArrayList<>();
        for (MeetingRoom meetingRoom : meetingRooms) {
            List<MeetingRoomEquip> meetingRoomEquips = selectMeetingRoomEquip(meetingRoom.getId());
            List<Meeting> meetings = meetingRepository.findByMeetingRoomIdAndMeetingDateAndStatusOrderByBeginTime(meetingRoom.getId(), time, 1);
            List<Meeting> meetings3 = meetingRepository.findByMeetingRoomIdAndMeetingDateAndStatusOrderByBeginTime(meetingRoom.getId(), time, 3);
            List<Meeting> meetings4 = meetingRepository.findByMeetingRoomIdAndMeetingDateAndStatusOrderByBeginTime(meetingRoom.getId(), time, 4);
            meetings.addAll(meetings3);
            meetings.addAll(meetings4);
            todayMeetings.add(meetings);
            meetingRoomEquipResult.add(meetingRoomEquips);
        }
        List<Equip> equips = selectEquip(tenantId); // 获取该租户的设备功能集合,需要前端存储
        List<Object> data = new ArrayList<>();
        data.add(meetingRoomParameter); // 会议室预定参数，需要前端存储
        data.add(equips); // 该租户的设备功能，需要前端存储
        data.add(meetingRooms); // 该用户可预定的会议室
        data.add(todayMeetings); // 显示今天该用户能够预定的所有会议室预定情况
        data.add(meetingRoomEquipResult); // 会议室设备集合
        ServerResult serverResult = new ServerResult();
        serverResult.setData(data);
        serverResult.setStatus(true);
        return serverResult;
    }

    //输入参数为某一天，格式如2019-01-13，会议室编号，前端需提前判断该天是否是限定天数之内
    //输出结果为会议开始、结束时间、主题、预定人电话、预定人名字、预定人部门、会议创建时间、id用于抢会议、协调会议参数、实际按1、2、3显示
    @Override
    public ServerResult getRoomReserver(Integer meetingRoomId, String reserveDate){
        ServerResult serverResult = new ServerResult();
        List<ReserverRecord> reserverRecords = new ArrayList<>();
        List<Meeting> meetings3 = meetingRepository.findByMeetingRoomIdAndMeetingDateAndStatusOrderByBeginTime(meetingRoomId, reserveDate, 3);
        for (Meeting meeting : meetings3) {
            ReserverRecord reserverRecord = new ReserverRecord();
            reserverRecord.setBegin(meeting.getBegin());
            reserverRecord.setCreateTime(meeting.getCreateTime());
            reserverRecord.setOver(meeting.getOver());
            reserverRecord.setMeetingDate(meeting.getMeetDate());
            reserverRecord.setTopic(meeting.getTopic());
            reserverRecord.setLastTime(meeting.getLastTime());
            UserInfo userInfo = userInfoService.getUserInfo(meeting.getUserId());
            reserverRecord.setPeopleName(userInfo.getName());
            reserverRecord.setPhone(userInfo.getPhone());
            reserverRecord.setPrepareTime(meeting.getPrepareTime());
            reserverRecord.setContent(meeting.getContent());
            reserverRecord.setStatus("进行中");
            Department department = departmentService.findByDepartmentId(userInfo.getDepartId());
            reserverRecord.setDepartmentName(department.getName());
            reserverRecord.setId(meeting.getId());
            reserverRecords.add(reserverRecord);
        }
        List<Meeting> meetings1 = meetingRepository.findByMeetingRoomIdAndMeetingDateAndStatusOrderByBeginTime(meetingRoomId, reserveDate, 1);
        for (Meeting meeting : meetings1) {
            ReserverRecord reserverRecord = new ReserverRecord();
            reserverRecord.setBegin(meeting.getBegin());
            reserverRecord.setCreateTime(meeting.getCreateTime());
            reserverRecord.setOver(meeting.getOver());
            reserverRecord.setMeetingDate(meeting.getMeetDate());
            reserverRecord.setTopic(meeting.getTopic());
            reserverRecord.setLastTime(meeting.getLastTime());
            UserInfo userInfo = userInfoService.getUserInfo(meeting.getUserId());
            reserverRecord.setPeopleName(userInfo.getName());
            reserverRecord.setPhone(userInfo.getPhone());
            reserverRecord.setPrepareTime(meeting.getPrepareTime());
            reserverRecord.setContent(meeting.getContent());
            reserverRecord.setStatus("未开始");
            Department department = departmentService.findByDepartmentId(userInfo.getDepartId());
            reserverRecord.setDepartmentName(department.getName());
            reserverRecord.setId(meeting.getId());
            reserverRecords.add(reserverRecord);
        }
        List<Meeting> meetings4 = meetingRepository.findByMeetingRoomIdAndMeetingDateAndStatusOrderByBeginTime(meetingRoomId, reserveDate, 4);
        for (Meeting meeting : meetings4) {
            ReserverRecord reserverRecord = new ReserverRecord();
            reserverRecord.setBegin(meeting.getBegin());
            reserverRecord.setCreateTime(meeting.getCreateTime());
            reserverRecord.setOver(meeting.getOver());
            reserverRecord.setMeetingDate(meeting.getMeetDate());
            reserverRecord.setTopic(meeting.getTopic());
            reserverRecord.setLastTime(meeting.getLastTime());
            UserInfo userInfo = userInfoService.getUserInfo(meeting.getUserId());
            reserverRecord.setPeopleName(userInfo.getName());
            reserverRecord.setPhone(userInfo.getPhone());
            reserverRecord.setPrepareTime(meeting.getPrepareTime());
            reserverRecord.setContent(meeting.getContent());
            reserverRecord.setStatus("已结束");
            Department department = departmentService.findByDepartmentId(userInfo.getDepartId());
            reserverRecord.setDepartmentName(department.getName());
            reserverRecord.setId(meeting.getId());
            reserverRecords.add(reserverRecord);
        }
        serverResult.setStatus(true);
        serverResult.setData(reserverRecords);
        return serverResult;
    }

    //传入参数为具体的日期,格式如2019-01-13以及要查询的会议室id集合，输出结果为相应会议室某天的预定安排
    @Override
    public ServerResult getOneDayReserve(OneDayReservation oneDayReservation){
        ServerResult serverResult = new ServerResult();
        List<List> meetings = new ArrayList<>();
        for (Integer meetingRoomId : oneDayReservation.getMeetingRooms()) {
            List<Meeting> meetings1 = meetingRepository.findByMeetingRoomIdAndMeetingDateAndStatusOrderByBeginTime(meetingRoomId, oneDayReservation.getReserveDate(), 1);
            List<Meeting> meetings2 = meetingRepository.findByMeetingRoomIdAndMeetingDateAndStatusOrderByBeginTime(meetingRoomId, oneDayReservation.getReserveDate(), 3);
            List<Meeting> meetings3 = meetingRepository.findByMeetingRoomIdAndMeetingDateAndStatusOrderByBeginTime(meetingRoomId, oneDayReservation.getReserveDate(), 4);
            meetings1.addAll(meetings2);
            meetings1.addAll(meetings3);
            meetings.add(meetings1);
        }
        serverResult.setStatus(true);
        serverResult.setData(meetings);
        return serverResult;
    }

    //传入参数为会议主题、会议内容、会议室id、会议室日期、开始时间、持续时间、准备时间、参会人员(不包括发起人自己)、外来人员（集合形式）名字、电话（可省略)
    @Override
    public ServerResult reserveMeeting(ReserveParam reserveParam, HttpServletRequest request) throws Exception{
        ServerResult serverResult = new ServerResult();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        Integer userId = (Integer) request.getSession().getAttribute("userId");
        MeetingRoomParameter meetingRoomParameter = meetingRoomParameterRepository.findByTenantId(tenantId);
        String beginTime = meetingRoomParameter.getBegin();
        String overTime = meetingRoomParameter.getOver();
        int lastTime = reserveParam.getLastTime();
        int prepareTime = reserveParam.getPrepareTime();
        String reserveBeginTime = reserveParam.getBeginTime();
        String reserveDate = reserveParam.getReserveDate();
        String afterBeginTime = reserveDate + " " + reserveBeginTime;
        String afterOverTime = TimeUtil.addMinute(afterBeginTime, lastTime);
        String nowTime = sdf.format(new Date());
        TimeUtil timeUtil = new TimeUtil();
        int bol1 = 1, bol2 = 2, bol3 = 2, bol4 = 2;
        bol1 = timeUtil.DateCompare(reserveBeginTime, beginTime, "HH:MM");
        bol2 = timeUtil.DateCompare(afterOverTime.substring(11, 16), overTime, "HH:MM");
        bol3 = timeUtil.DateCompare(reserveBeginTime, afterOverTime.substring(11, 16), "HH:MM");
        bol4 = timeUtil.DateCompare(afterBeginTime, nowTime, "yyyy-MM-dd HH:ms");
        if (prepareTime > lastTime) {
            serverResult.setMessage("准备时间不能大于持续时间");
        } else if (bol3 == 0) {
            serverResult.setMessage("预定时间不能为0分钟");
        } else if (bol1 == -1) {
            serverResult.setMessage("预定时间不能早于" + beginTime);
        } else if (bol2 == 1) {
            serverResult.setMessage("结束时间不能晚于" + overTime);
        } else if (bol4 == -1) {
            serverResult.setMessage("预定会议时间不能在当前时间之前");
        } else {
            Integer meetingRoomId = reserveParam.getMeetingRoomId();
            List<Meeting> meetings = meetingRepository.findIntersectMeeting(afterBeginTime, afterOverTime, meetingRoomId);
            if (meetings.isEmpty()) {
                Meeting meeting = new Meeting();
                meeting.setMeetDate(reserveParam.getReserveDate());
                meeting.setBegin(afterBeginTime);
                meeting.setContent(reserveParam.getContent());
                meeting.setMeetroomId(meetingRoomId);
                meeting.setOver(afterOverTime);
                meeting.setStatus(1);
                meeting.setLastTime(lastTime);
                meeting.setTopic(reserveParam.getTopic());
                meeting.setTenantId(tenantId);
                meeting.setUserId(userId);
                meeting.setMeetDate(reserveParam.getReserveDate());
                meeting.setPrepareTime(prepareTime);
                UserInfo userInfo = userInfoService.getUserInfo(userId);
                meeting.setDepartId(userInfo.getDepartId());
                meeting.setCreateTime(nowTime);
                Meeting meetingSave = meetingRepository.saveAndFlush(meeting);
                Integer meetingId = meetingSave.getId();
                String message = "您有一个新的会议，点击查看详情";
                boolean isCreatorInJoinList = false;
                List<Integer> joinPersonIds = reserveParam.getJoinPersonIds();
                for (Integer joinPersonId : joinPersonIds) {
                    if (joinPersonId.equals(userId))
                        isCreatorInJoinList = true;
                    JoinPerson joinPerson = new JoinPerson();
                    joinPerson.setMeetingId(meetingId);
                    joinPerson.setUserId(joinPersonId);
                    joinPerson.setStatus(0);
                    joinPersonRepository.saveAndFlush(joinPerson);
                    PushMessage pushMessage = new PushMessage();
                    pushMessage.setReceiveId(joinPersonId);
                    pushMessage.setStatus(0);
                    pushMessage.setMessage(message);
                    pushMessage.setMeetingId(meetingId);
                    pushMessage.setTime(nowTime);
                    pushMessageRepository.saveAndFlush(pushMessage);
                }
                // 如果会议创建者不在参会人列表中，手动添加
                if (!isCreatorInJoinList) {
                    JoinPerson joinPerson = new JoinPerson();
                    joinPerson.setMeetingId(meetingId);
                    joinPerson.setUserId(userId);
                    joinPerson.setStatus(0);
                    joinPersonRepository.saveAndFlush(joinPerson);
                    PushMessage pushMessage = new PushMessage();
                    pushMessage.setReceiveId(userId);
                    pushMessage.setStatus(0);
                    pushMessage.setMessage(message);
                    pushMessageRepository.saveAndFlush(pushMessage);
                }
                List<OutsideJoinPerson> outsideJoinPersonList = reserveParam.getOutsideJoinPersonList();
                for (OutsideJoinPerson outsideJoinPerson : outsideJoinPersonList) {
                    OutsideJoinPerson person = new OutsideJoinPerson();
                    person.setName(outsideJoinPerson.getName());
                    person.setPhone(outsideJoinPerson.getPhone());
                    person.setMeetingId(meetingId);
                    outsideJoinPersonRepository.saveAndFlush(person);
                }
                serverResult.setStatus(true);
                serverResult.setMessage("预定会议成功");
            } else {
                serverResult.setMessage("预定时间与其他会议时段冲突");
            }
        }
        return serverResult;
    }

    //传入参数和预定会议一样,时间、会议室无法选择，只能是那一段
    @Override
    public ServerResult robMeeting(ReserveParam reserveParam, HttpServletRequest request){
        ServerResult serverResult = new ServerResult();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        Integer userId = (Integer) request.getSession().getAttribute("userId");
        String reserveDate = reserveParam.getReserveDate();
        String reserveBeginTime = reserveParam.getBeginTime();
        int lastTime = reserveParam.getLastTime();
        String afterBeginTime = reserveDate + " " + reserveBeginTime;
        String afterOverTime = TimeUtil.addMinute(afterBeginTime, lastTime);
        String nowTime = sdf.format(new Date());
        Meeting meeting = new Meeting();
        meeting.setMeetDate(reserveParam.getReserveDate());
        meeting.setBegin(afterBeginTime);
        meeting.setContent(reserveParam.getContent());
        meeting.setMeetroomId(reserveParam.getMeetingRoomId());
        meeting.setOver(afterOverTime);
        meeting.setStatus(2);
        meeting.setTopic(reserveParam.getTopic());
        meeting.setTenantId(tenantId);
        meeting.setUserId(userId);
        UserInfo userInfo = userInfoService.getUserInfo(userId);
        meeting.setUserId(userInfo.getId());
        meeting.setLastTime(lastTime);
        meeting.setMeetDate(reserveDate);
        meeting.setPrepareTime(reserveParam.getPrepareTime());
        meeting.setCreateTime(nowTime);
        meetingRepository.saveAndFlush(meeting);
        Integer meetingId = meeting.getId();
        boolean isCreatorInJoinList = false;
        List<Integer> joinPersonIds = reserveParam.getJoinPersonIds();
        for (Integer joinPersonId : joinPersonIds) {
            if (joinPersonId.equals(userId))
                isCreatorInJoinList = true;
            JoinPerson joinPerson = new JoinPerson();
            joinPerson.setMeetingId(meetingId);
            joinPerson.setUserId(joinPersonId);
            joinPerson.setStatus(0);
            joinPersonRepository.saveAndFlush(joinPerson);
        }
        // 如果会议创建者不在参会人列表中，手动添加
        if (!isCreatorInJoinList) {
            JoinPerson joinPerson = new JoinPerson();
            joinPerson.setMeetingId(meetingId);
            joinPerson.setUserId(userId);
            joinPerson.setStatus(0);
            joinPersonRepository.saveAndFlush(joinPerson);
        }

        List<OutsideJoinPerson> outsideJoinPersonList = reserveParam.getOutsideJoinPersonList();
        for (OutsideJoinPerson outsideJoinPerson : outsideJoinPersonList) {
            OutsideJoinPerson person = new OutsideJoinPerson();
            person.setName(outsideJoinPerson.getName());
            person.setPhone(outsideJoinPerson.getPhone());
            person.setMeetingId(meetingId);
            outsideJoinPersonRepository.saveAndFlush(person);
        }
        serverResult.setStatus(true);
        serverResult.setMessage("抢会议成功");
        return serverResult;
    }

    //传入参数除和预定会议一样，还包括调用原因(可无)，原来会议的id
    @Override
    public ServerResult coordinateMeeting(CoordinateParameter coordinateParameter, HttpServletRequest request){
        Meeting meeting = new Meeting();
        meeting.setMeetDate(coordinateParameter.getReserveDate());
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Integer userId = (Integer) request.getSession().getAttribute("userId");
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        int lastTime = coordinateParameter.getLastTime();
        Integer beforeMeetingId = coordinateParameter.getBeforeMeetingId();
        Meeting meeting1 = findByMeetingId(beforeMeetingId);
        int bol = coordinateParameter.getBeforeOrLast();
        if (bol == 1){
            String begin = meeting1.getBegin();
            meeting.setBegin(begin);
            meeting.setOver(TimeUtil.addMinute(begin, lastTime));
        } else if (bol == 2){
            String over = meeting1.getOver();
            meeting.setOver(over);
            meeting.setBegin(TimeUtil.addMinute(over, -lastTime));
        }
        meeting.setTenantId(tenantId);
        meeting.setTopic(coordinateParameter.getTopic());
        meeting.setContent(coordinateParameter.getContent());
        meeting.setMeetroomId(meeting1.getMeetroomId());
        meeting.setLastTime(lastTime);
        meeting.setStatus(8);
        meeting.setUserId(userId);
        UserInfo userInfo = userInfoService.getUserInfo(userId);
        meeting.setDepartId(userInfo.getDepartId());
        meeting.setMeetDate(meeting1.getMeetDate());
        meeting.setPrepareTime(coordinateParameter.getPrepareTime());
        meeting.setCreateTime(sdf.format(new java.util.Date()));
        Meeting m = meetingRepository.saveAndFlush(meeting);
        Integer meetingId = m.getId();
        boolean isCreatorInJoinList = false;
        List<Integer> joinPersonIds = coordinateParameter.getJoinPeopleId();
        for (Integer joinPersonId : joinPersonIds) {
            if (joinPersonId.equals(userId))
                isCreatorInJoinList = true;
            JoinPerson joinPerson = new JoinPerson();
            joinPerson.setMeetingId(meetingId);
            joinPerson.setUserId(joinPersonId);
            joinPerson.setStatus(0);
            joinPersonRepository.saveAndFlush(joinPerson);
        }
        // 如果会议创建者不在参会人列表中，手动添加
        if (!isCreatorInJoinList) {
            JoinPerson joinPerson = new JoinPerson();
            joinPerson.setMeetingId(meetingId);
            joinPerson.setUserId(userId);
            joinPerson.setStatus(0);
            joinPersonRepository.saveAndFlush(joinPerson);
        }
        CoordinateInfo coordinateInfo = new CoordinateInfo();
        coordinateInfo.setNote(coordinateParameter.getNote());
        coordinateInfo.setMeetingId(meetingId);
        coordinateInfo.setBeforeMeetingId(beforeMeetingId);
        coordinateInfo.setStatus(0);
        coordinateInfoRepository.saveAndFlush(coordinateInfo);
        List<OutsideJoinPerson> outsideJoinPersonList = coordinateParameter.getOutsideJoinPersons();
        for (OutsideJoinPerson outsideJoinPerson : outsideJoinPersonList) {
            OutsideJoinPerson person = new OutsideJoinPerson();
            person.setName(outsideJoinPerson.getName());
            person.setPhone(outsideJoinPerson.getPhone());
            person.setMeetingId(meetingId);
            outsideJoinPersonRepository.saveAndFlush(person);
        }
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    // 取消会议
    @Override
    public ServerResult cancelMeeting(Integer meetingId){
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String nowTime = sdf.format(new Date());
        ServerResult serverResult = new ServerResult();
        Meeting meetingToCancel = findByMeetingId(meetingId);
        Integer status = meetingToCancel.getStatus();
        if (status == 1){
            meetingRepository.updateMeetingStatus(meetingId, 5);
            List<CoordinateInfo> coordinateInfos = coordinateInfoRepository.findByBeforeMeetingIdAndStatus(meetingId, 1);
            if (coordinateInfos.isEmpty()){
                List<Meeting> meetings = meetingRepository.findByBeginAndOverAndMeetroomIdAndStatusOrderByCreateTimeAsc(meetingToCancel.getBegin(), meetingToCancel.getOver(), meetingToCancel.getMeetroomId(), 2);
                if (!meetings.isEmpty()){
                    Meeting backupMeeting = meetings.get(0);
                    meetingRepository.updateMeetingStatus(backupMeeting.getId(), 1);
                    List<JoinPerson> joinPersonList = joinPersonRepository.findByMeetingId(backupMeeting.getId());
                    for (JoinPerson joinPerson : joinPersonList) {
                        PushMessage pushMessage = new PushMessage();
                        pushMessage.setReceiveId(joinPerson.getUserId());
                        pushMessage.setStatus(0);
                        pushMessage.setMessage("您有一个新的会议，点击查看详情");
                        pushMessage.setMeetingId(backupMeeting.getId());
                        pushMessage.setTime(nowTime);
                        pushMessageRepository.saveAndFlush(pushMessage);
                    }
                }
            }
            String message = "您有一个会议已被取消，点击查看详情";
            List<JoinPerson> joinPersonList = joinPersonRepository.findByMeetingId(meetingId);
            for (JoinPerson joinPerson : joinPersonList) {
                PushMessage pushMessage = new PushMessage();
                pushMessage.setReceiveId(joinPerson.getUserId());
                pushMessage.setStatus(0);
                pushMessage.setMessage(message);
                pushMessage.setMeetingId(meetingId);
                pushMessage.setTime(nowTime);
                pushMessageRepository.saveAndFlush(pushMessage);
            }
            serverResult.setMessage("取消成功");
        } else if (status == 8) {
            meetingRepository.updateMeetingStatus(meetingId, 5);
            coordinateInfoRepository.updateStatusByMeetingId(meetingId, 3);
            serverResult.setMessage("调用成功");
        } else {
            meetingRepository.updateMeetingStatus(meetingId, 5);
            serverResult.setMessage("预约取消成功");
        }
        serverResult.setStatus(true);
        return serverResult;
    }

    @Override
    public Meeting findByMeetingId(Integer meetingId){
        Optional<Meeting> meeting = meetingRepository.findById(meetingId);
        return meeting.orElse(null);
    }

    //输出结果为本月预定的会议，默认在日历下方显示今天预定的会议，未处理的请求调用记录，显示有未处理的请求调用记录，要保存起来，点击查看详情的时候要显示
    @Override
    public ServerResult showMyReserve(HttpServletRequest request) {
        Integer userId = (Integer) request.getSession().getAttribute("userId");
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String yearMonth = sdf.format(new Date()).substring(0, 7);
        List<Meeting> groupMeetings = meetingRepository.groupByMeetingDate(userId, yearMonth + "%");
        List<MyReserveCount> myReserveCounts = new ArrayList<>();
        for (Meeting groupMeeting : groupMeetings) {
            MyReserveCount myReserveCount = new MyReserveCount();
            myReserveCount.setMeetDate(groupMeeting.getMeetDate());
            myReserveCount.setCount(meetingRepository.countReservation(userId, groupMeeting.getMeetDate()));
            myReserveCounts.add(myReserveCount);
        }
        String today = sdf.format(new Date()).substring(0, 10);
        List<Meeting> todayMeetings = meetingRepository.findReservation(userId, today);
        List<ReserverRecord> reserverRecords = new ArrayList<>();
        for (Meeting meeting : todayMeetings) {
            ReserverRecord reserverRecord = new ReserverRecord();
            reserverRecord = new ReserverRecord();
            reserverRecord.setId(meeting.getId());
            reserverRecord.setBegin(meeting.getBegin());
            reserverRecord.setOver(meeting.getOver());
            reserverRecord.setContent(meeting.getContent());
            reserverRecord.setTopic(meeting.getTopic());
            reserverRecord.setMeetingDate(meeting.getMeetDate());
            UserInfo userInfo = userInfoService.getUserInfo(meeting.getUserId());
            reserverRecord.setPeopleName(userInfo.getName());
            reserverRecord.setPhone(userInfo.getPhone());
            reserverRecord.setPrepareTime(meeting.getPrepareTime());
            String status = "";
            switch (meeting.getStatus()) {
                case 6:
                    status = "预约失败";
                    break;
                case 1:
                    status = "预约成功";
                    break;
                case 2:
                    status = "预约中";
                    break;
                case 3:
                    status = "会议进行中";
                    break;
                case 4:
                    status = "会议结束";
                    break;
                case 5:
                    status = "取消会议";
                    break;
                case 7:
                    status = "调用失败";
                    break;
                case 8:
                    status = "调用中";
                    break;
            }
            reserverRecord.setStatus(status);
            reserverRecords.add(reserverRecord);
        }
        ServerResult serverResult = new ServerResult();
        List<Object> result = new ArrayList<>();
        result.add(myReserveCounts);
        result.add(reserverRecords);
        serverResult.setData(result);
        serverResult.setStatus(true);
        return serverResult;
    }

    //传入参数为显示的月份,格式如2019-01，格式必须保持一致
    @Override
    public ServerResult specifiedMyReserve(HttpServletRequest request, String yearMonth) {
        Integer userId = (Integer) request.getSession().getAttribute("userId");
        List<Meeting> groupMeetings = meetingRepository.groupByMeetingDate(userId, yearMonth + "%");
        List<MyReserveCount> myReserveCounts = new ArrayList<>();
        for (Meeting groupMeeting : groupMeetings) {
            MyReserveCount myReserveCount = new MyReserveCount();
            myReserveCount.setMeetDate(groupMeeting.getMeetDate());
            myReserveCount.setCount(meetingRepository.countReservation(userId, groupMeeting.getMeetDate()));
            myReserveCounts.add(myReserveCount);
        }
        ServerResult serverResult = new ServerResult();
        serverResult.setData(myReserveCounts);
        serverResult.setStatus(true);
        return serverResult;
    }

    //显示一个我预定的会议的细节
    @Override
    public ServerResult oneReserveDetail(Integer meetingId) {
        Meeting meeting = findByMeetingId(meetingId);
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
        ReserveParam reserveParam = new ReserveParam();
        reserveParam.setTopic(meeting.getTopic());
        reserveParam.setContent(meeting.getContent());
        reserveParam.setMeetingRoomId(meeting.getMeetroomId());
        MeetingRoom meetingRoom = findByMeetRoomId(meeting.getMeetroomId());
        if (meetingRoom != null) {
            reserveParam.setMeetingRoom(meetingRoom.getName());
            reserveParam.setMeetingRoomPlace(meetingRoom.getPlace());
        }
        reserveParam.setReserveDate(meeting.getMeetDate());
        reserveParam.setBeginTime(sdf.format(meeting.getBegin()));
        reserveParam.setLastTime(meeting.getLastTime());
        reserveParam.setOverTime(sdf.format(meeting.getOver()));
        reserveParam.setPrepareTime(meeting.getPrepareTime());
        String status = "";
        switch (meeting.getStatus()) {
            case 6:
                status = "预约失败";
                break;
            case 1:
                status = "预约成功";
                break;
            case 2:
                status = "预约中";
                break;
            case 3:
                status = "会议进行中";
                break;
            case 4:
                status = "会议结束";
                break;
            case 5:
                status = "取消会议";
                break;
            case 7:
                status = "调用失败";
                break;
            case 8:
                status = "调用中";
                break;
        }
        reserveParam.setStatus(status);
        List<OutsideJoinPerson> outsideJoinPersonList = outsideJoinPersonRepository.findByMeetingId(meetingId);
        reserveParam.setOutsideJoinPersonList(outsideJoinPersonList);
        List<JoinPerson> joinPersonList = joinPersonRepository.findByMeetingId(meetingId);
        List<Integer> userIds = new ArrayList<>();
        for (JoinPerson joinPerson : joinPersonList) {
            userIds.add(joinPerson.getUserId());
        }
        reserveParam.setJoinPersonIds(userIds);
        List<CoordinateInfo> coordinateInfos = coordinateInfoRepository.findByBeforeMeetingIdAndStatus(meetingId, 0);
        List<CoordinateResult> coordinateResults = new ArrayList<>();
        for (CoordinateInfo coordinateInfo : coordinateInfos) {
            CoordinateResult coordinateResult = new CoordinateResult();
            Meeting coordinateMeeting = findByMeetingId(coordinateInfo.getMeetingId());
            coordinateResult.setStartTime(coordinateMeeting.getBegin());
            coordinateResult.setEndTime(coordinateMeeting.getOver());
            coordinateResult.setNote(coordinateInfo.getNote());
            UserInfo userInfo = userInfoService.getUserInfo(coordinateMeeting.getUserId());
            coordinateResult.setContactName(userInfo.getName());
            coordinateResult.setContactNumber(userInfo.getPhone());
            coordinateResult.setCoordinateId(coordinateInfo.getId());
            coordinateResults.add(coordinateResult);
        }
        ServerResult serverResult = new ServerResult();
        List<Object> result = new ArrayList<>();
        result.add(reserveParam);
        result.add(coordinateResults);
        serverResult.setData(result);
        serverResult.setStatus(true);
        return serverResult;
    }

    //显示某一天我的预定记录,格式如2019-01-20
    @Override
    public ServerResult oneDayMyReserve(String reserveDate, HttpServletRequest request) {
        Integer userId = (Integer) request.getSession().getAttribute("userId");
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
        List<Meeting> oneDayMeetings = meetingRepository.findReservation(userId, reserveDate);
        List<ReserverRecord> oneDayReserverRecords = new ArrayList<>();
        for (Meeting meeting : oneDayMeetings) {
            ReserverRecord reserverRecord = new ReserverRecord();
            reserverRecord.setId(meeting.getId());
            reserverRecord.setBegin(meeting.getBegin());
            reserverRecord.setOver(meeting.getOver());
            reserverRecord.setContent(meeting.getContent());
            reserverRecord.setTopic(meeting.getTopic());
            reserverRecord.setMeetingDate(meeting.getMeetDate());
            UserInfo userInfo = userInfoService.getUserInfo(meeting.getUserId());
            reserverRecord.setPeopleName(userInfo.getName());
            reserverRecord.setPhone(userInfo.getPhone());
            reserverRecord.setPrepareTime(meeting.getPrepareTime());
            String status = "";
            switch (meeting.getStatus()) {
                case 6:
                    status = "预约失败";
                    break;
                case 1:
                    status = "预约成功";
                    break;
                case 2:
                    status = "预约中";
                    break;
                case 3:
                    status = "会议进行中";
                    break;
                case 4:
                    status = "会议结束";
                    break;
                case 5:
                    status = "取消会议";
                    break;
                case 7:
                    status = "调用失败";
                    break;
                case 8:
                    status = "调用中";
                    break;
            }
            reserverRecord.setStatus(status);
            oneDayReserverRecords.add(reserverRecord);
        }
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        serverResult.setData(oneDayReserverRecords);
        return serverResult;
    }


}
