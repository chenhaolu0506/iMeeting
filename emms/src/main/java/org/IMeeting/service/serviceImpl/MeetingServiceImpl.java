package org.IMeeting.service.serviceImpl;

import org.IMeeting.entity.*;
import org.IMeeting.repository.*;
import org.IMeeting.service.DepartmentService;
import org.IMeeting.service.MeetingService;
import org.IMeeting.service.UserInfoService;
import org.IMeeting.util.MeetUtil;
import org.IMeeting.util.NumUtil;
import org.IMeeting.util.TimeUtil;
import org.apache.poi.hssf.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import javax.persistence.criteria.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.ParseException;
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

    @Override
    public MeetingRoom findByMeetRoomId(Integer meetingRoomId) {
        Optional<MeetingRoom> meetingRoom = meetingRoomRepository.findById(meetingRoomId);
        return meetingRoom.orElse(null);
    }

    // 拒绝会议调用
    @Override
    public ServerResult disagreeCoordinate(Integer coordinateId) {
        CoordinateInfo coordinateInfo = findByCoordinateId(coordinateId);
        int updateCoordinate = 0;
        int updateMeeting = 0;
        if (coordinateInfo != null) {
            updateCoordinate = coordinateInfoRepository.updateCoordinateStatus(coordinateId, 2);
            updateMeeting = meetingRepository.updateMeetingStatus(coordinateInfo.getMeetingId(), 7);
        }
        ServerResult serverResult = new ServerResult();
        if (updateCoordinate != 0 && updateMeeting != 0) {
            serverResult.setStatus(true);
        }
        return serverResult;
    }

    // 同意会议调用
    @Override
    public ServerResult agreeCoordinate(Integer coordinateId) {
        CoordinateInfo coordinateInfo = findByCoordinateId(coordinateId);
        if (coordinateInfo != null) {
            Integer meetingId = coordinateInfo.getMeetingId();
            Meeting meeting = findByMeetingId(meetingId);
            String beginTime = meeting.getBegin();
            String endTime = meeting.getOver();
            meetingRepository.updateMeetingStatus(meetingId, 1);
            List<JoinPerson> joinPersonList = joinPersonRepository.findByMeetingId(meetingId);
            String message = "您有一个新的会议，点击查看详情";
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String nowTime = sdf.format(new Date());
            for (JoinPerson joinPerson : joinPersonList) {
                PushMessage pushMessage = new PushMessage();
                pushMessage.setReceiveId(joinPerson.getUserId());
                pushMessage.setStatus(0);
                pushMessage.setMessage(message);
                pushMessage.setMeetingId(meetingId);
                pushMessage.setTime(nowTime);
                pushMessageRepository.saveAndFlush(pushMessage);
            }
            Meeting beforeMeeting = findByMeetingId(coordinateInfo.getBeforeMeetingId());
            String beforeBegin = beforeMeeting.getBegin();
            String beforeOver = beforeMeeting.getOver();
            if (beforeBegin.equals(beginTime)) {
                meetingRepository.updateBeginTime(coordinateInfo.getBeforeMeetingId(), endTime);
            } else if (beforeOver.equals(endTime)) {
                meetingRepository.updateEndTime(coordinateInfo.getBeforeMeetingId(), beginTime);
            }
            coordinateInfoRepository.updateCoordinateStatus(coordinateId, 1);
            List<CoordinateInfo> coordinateInfos = coordinateInfoRepository.findByBeforeMeetingIdAndStatus(coordinateInfo.getBeforeMeetingId(), 0);
            for (CoordinateInfo coordinateInfo1 : coordinateInfos) {
                coordinateInfoRepository.updateCoordinateStatus(coordinateInfo1.getId(), 2);
                meetingRepository.updateMeetingStatus(coordinateInfo1.getMeetingId(), 0);
            }
        }
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    @Override
    public CoordinateInfo findByCoordinateId(Integer coordinateId) {
        Optional<CoordinateInfo> coordinateInfo = coordinateInfoRepository.findById(coordinateId);
        return coordinateInfo.orElse(null);
    }

    // 修改会议室，会议时间
    @Override
    public ServerResult rescheduleMeeting(ReserveParam reserveParam, HttpServletRequest request) throws Exception {
        cancelMeeting(reserveParam.getMeetingId());
        return reserveMeeting(reserveParam, request);
    }

    // 修改会议室以及会议时间以外的内容
    @Override
    public ServerResult editMeetingDetail(ReserveParam reserveParam, HttpServletRequest request) {
        Integer userId = (Integer) request.getSession().getAttribute("userId");
        Integer meetingId = reserveParam.getMeetingId();
        meetingRepository.updateMetaData(meetingId, reserveParam.getTopic(), reserveParam.getContent(), reserveParam.getPrepareTime());
        List<OutsideJoinPerson> outsideJoinPersonList = outsideJoinPersonRepository.findByMeetingId(meetingId);
        outsideJoinPersonRepository.deleteByMeetingId(meetingId);
        for (OutsideJoinPerson outsideJoinPerson : outsideJoinPersonList) {
            OutsideJoinPerson outsideJoinPerson1 = new OutsideJoinPerson();
            outsideJoinPerson1.setMeetingId(meetingId);
            outsideJoinPerson1.setName(outsideJoinPerson.getName());
            outsideJoinPerson1.setPhone(outsideJoinPerson.getPhone());
            outsideJoinPersonRepository.saveAndFlush(outsideJoinPerson1);
        }
        joinPersonRepository.deleteByMeetingId(meetingId);
        boolean isCreatorInJoinList = false;
        List<Integer> joinPersonIds = reserveParam.getJoinPersonIds();
        Meeting meeting = findByMeetingId(meetingId);
        String message = "您有一个会议信息修改，点击查看详情";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String nowTime = sdf.format(new Date());
        for (Integer joinPersonId : joinPersonIds) {
            if (joinPersonId.equals(userId)) {
                isCreatorInJoinList = true;
            }
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
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        serverResult.setMessage("预订信息修改成功");
        return serverResult;
    }

    // 提前结束会议
    @Override
    public ServerResult advanceOver(Integer meetingId) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String nowTime = sdf.format(new Date());
        Meeting meeting = findByMeetingId(meetingId);
        int lastTime = 0;
        try{
            lastTime = (int) TimeUtil.minuteDifference(meeting.getBegin(), nowTime);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        int bol = meetingRepository.updateOver(meetingId, nowTime, 4, lastTime);
        ServerResult serverResult = new ServerResult();
        if (bol > 0) {
            serverResult.setStatus(true);
            serverResult.setMessage("会议提前结束成功");
        } else {
            serverResult.setStatus(false);
            serverResult.setMessage("操作失败");
        }
        return serverResult;
    }

    // 显示自己参加的会议
    @Override
    public ServerResult selectMyJoinMeeting(HttpServletRequest request, String yearMonth) {
        Integer userId = (Integer) request.getSession().getAttribute("userId");
        List<Meeting> meetings = meetingRepository.groupByMeetingDate(userId, yearMonth + "%");
        List<MyJoinCount> myJoinCounts = new ArrayList<>();
        for (Meeting meeting : meetings) {
            MyJoinCount myJoinCount = new MyJoinCount();
            myJoinCount.setMeetDate(meeting.getMeetDate());
            myJoinCount.setNotStartCount(meetingRepository.countNotStartMeeting(userId, meeting.getMeetDate(), 1));
            myJoinCount.setEndedCount(meetingRepository.countOverMeeting(userId, meeting.getMeetDate(), 4));
            myJoinCounts.add(myJoinCount);
        }
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        serverResult.setData(myJoinCounts);
        return serverResult;
    }

    // 到会议预约开始时间将预约成功状态变为进行中，预约中变为预约失败，调用中变为调用失败
    @Override
    public void updateMeetingStatus(String nowTime, Integer beforeStatus, Integer afterStatus) {
        meetingRepository.updateMeetingStatus(nowTime, beforeStatus, afterStatus);
    }

    // 到会议结束时间将进行中状态变为会议结束
    @Override
    public void updateMeetingOverStatus(String nowTime, Integer beforeStatus, Integer afterStatus) {
        meetingRepository.updateMeetingStatus(nowTime, beforeStatus, afterStatus);
    }

    // 根据日期查询自己参加的会议
    @Override
    public ServerResult selectMyJoinMeetingByDate(String meetDate, HttpServletRequest request) {
        Integer userId = (Integer) request.getSession().getAttribute("userId");
        List<Meeting> meetings = meetingRepository.findMeetingsByUserAndDate(userId, meetDate);
        List<ReserverRecord> reserverRecords = new ArrayList<>();
        for (Meeting meeting : meetings) {
            ReserverRecord reserverRecord = new ReserverRecord();
            reserverRecord.setBegin(meeting.getBegin());
            reserverRecord.setCreateTime(meeting.getCreateTime());
            reserverRecord.setOver(meeting.getOver());
            reserverRecord.setTopic(meeting.getTopic());
            reserverRecord.setLastTime(meeting.getLastTime());
            UserInfo userInfo = userInfoService.getUserInfo(meeting.getUserId());
            reserverRecord.setPeopleName(userInfo.getName());
            reserverRecord.setPhone(userInfo.getPhone());
            Department department = userInfoService.getDepartment(userInfo.getDepartId());
            reserverRecord.setDepartmentName(department.getName());
            reserverRecord.setId(meeting.getId());
            String status = "";
            switch (meeting.getStatus()) {
                case 1:
                    status = "未开始";
                    break;
                case 3:
                    status = "进行中";
                    break;
                case 4:
                    status = "已结束";
                    break;
            }
            reserverRecord.setStatus(status);
            reserverRecords.add(reserverRecord);
        }
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        serverResult.setData(reserverRecords);
        return serverResult;
    }

    // 请假，请假原因可略,参数为请假原因，会议id
    @Override
    public ServerResult sendLeaveInformation(LeaveInformation leaveInformation, HttpServletRequest request) {
        Integer userId = (Integer) request.getSession().getAttribute("userId");
        leaveInformation.setStatus(0);
        leaveInformation.setUserId(userId);
        leaveInformationRepository.saveAndFlush(leaveInformation);
        joinPersonRepository.updateStatus(2, leaveInformation.getMeetingId(), leaveInformation.getUserId());
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        serverResult.setMessage("请假已申请");
        return serverResult;
    }

    // 根据日期显示未开始和进行中会议的请假请求总数和未处理请假数量
    @Override
    public ServerResult countLeaveInformation(HttpServletRequest request) {
        Integer userId = (Integer) request.getSession().getAttribute("userId");
        List<Meeting> meetings = meetingRepository.selectByUserIdAndStatus(userId);
        List<LeaveInformationCount> leaveInformationCounts = new ArrayList<>();
        for (Meeting meeting : meetings) {
            LeaveInformationCount leaveInformationCount = new LeaveInformationCount();
            leaveInformationCount.setMeetingTime(meeting.getBegin() + "-" + meeting.getOver());
            leaveInformationCount.setMeetingId(meeting.getId());
            leaveInformationCount.setTopic(meeting.getTopic());
            leaveInformationCount.setTotalCount(leaveInformationRepository.countByMeetingId(meeting.getId()));
            leaveInformationCount.setUnprocessedCount(leaveInformationRepository.countUnprocessedByMeetingId(meeting.getId()));
            leaveInformationCounts.add(leaveInformationCount);
        }
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        serverResult.setData(leaveInformationCounts);
        return serverResult;
    }

    // 显示某一场会议的所有请假信息
    @Override
    public ServerResult showOneMeetingLeaveInfo(Integer meetingId) {
        List<LeaveInformation> leaveInformations = leaveInformationRepository.findByMeetingIdOrderByStatus(meetingId);
        List<LeaveInfoResult> leaveInfoResults = new ArrayList<>();
        for (LeaveInformation leaveInformation : leaveInformations) {
            LeaveInfoResult leaveInfoResult = new LeaveInfoResult();
            leaveInfoResult.setLeaveInfoId(leaveInformation.getId());
            UserInfo userInfo = userInfoService.getUserInfo(leaveInformation.getUserId());
            leaveInfoResult.setName(userInfo.getName());
            leaveInfoResult.setPhoneNumber(userInfo.getPhone());
            leaveInfoResult.setNote(leaveInformation.getNote());
            leaveInfoResult.setStatus(leaveInformation.getStatus());
            leaveInfoResults.add(leaveInfoResult);
        }
        ServerResult serverResult = new ServerResult();
        serverResult.setData(leaveInfoResults);
        serverResult.setStatus(true);
        return serverResult;
    }

    @Override
    public ServerResult findPushMessage(HttpServletRequest request) {
        ServerResult serverResult = new ServerResult();
        Integer userId = (Integer) request.getSession().getAttribute("userId");
        if (userId == null) {
            return serverResult;
        }
        List<PushMessage> pushMessages = pushMessageRepository.findByReceiveIdAndStatus(userId, 0);
        for (PushMessage pushMessage : pushMessages) {
            pushMessageRepository.updateStatus(pushMessage.getId(), userId);
        }
        serverResult.setData(pushMessages);
        serverResult.setStatus(true);
        return serverResult;
    }

    @Override
    public LeaveInformation findById(Integer id) {
        Optional<LeaveInformation> leaveInformation = leaveInformationRepository.findById(id);
        return leaveInformation.orElse(null);
    }

    // 计算相似度
    @Override
    public double countSimilar(double[] source, double[] target, double[] weight) {
        int numberOfRoomProperties = source.length;
        double dotProduct = 0; //点积
        double magnitudeSource = 0; //源向量的模
        double magnitudeTarget = 0; //目标向量的模
        for (int i = 0; i < numberOfRoomProperties; i++) {
            source[i] *= weight[i];
            target[i] *= weight[i];
        }

        double mid = source[numberOfRoomProperties - 1] + target[numberOfRoomProperties - 1];
        source[numberOfRoomProperties-1] = (target[numberOfRoomProperties-1]+mid)/(source[numberOfRoomProperties-1]+mid);
        if (source[numberOfRoomProperties - 1] > 1) {
            target[numberOfRoomProperties - 1] = 0;
        } else {
            target[numberOfRoomProperties - 1] = 1;
        }
        for (int i = 0; i < numberOfRoomProperties; i++) {
            dotProduct += source[i] * target[i];
            magnitudeSource += source[i] * source[i];
            magnitudeTarget += target[i] * target[i];
        }
        return dotProduct / (Math.sqrt(magnitudeSource) * Math.sqrt(magnitudeTarget));
    }

    @Override
    public List<String> findFreeTime(Integer meetRoomId, HttpServletRequest request) {
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        MeetingRoomParameter meetingRoomParameter = meetingRoomParameterRepository.findByTenantId(tenantId);
        String beginTime = meetingRoomParameter.getBegin();
        String overTime = meetingRoomParameter.getOver();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String today = sdf.format(new Date()).substring(0, 10);
        String nowTime = sdf.format(new Date()).substring(11);
        List<Meeting> meetings = meetingRepository.selectByMeetDateWhereStatusIsOneOrThree(today, meetRoomId);
        return MeetUtil.returnFreeTime(nowTime, overTime, meetings);
    }

    // 查询
    @Override
    public List findBySpecification(SelectMeetingParameter selectMeetingParameter, HttpServletRequest request) {
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        Specification<Meeting> specification = new Specification<Meeting>() {
            @Override
            public Predicate toPredicate(Root<Meeting> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList<>();
                Predicate tenantPredicate = criteriaBuilder.equal(root.get("tenantId"), tenantId);
                predicates.add(tenantPredicate);
                if (!StringUtils.isEmpty(selectMeetingParameter.getTopic())){
                    Predicate topicPredicate = criteriaBuilder.like(root.get("topic"), "%" + selectMeetingParameter.getTopic() + "%");
                    predicates.add(topicPredicate);
                }
                if (!StringUtils.isEmpty(selectMeetingParameter.getReserveName())){
                    Join<Meeting, UserInfo> userInfoJoin = root.join("userInfo", JoinType.LEFT);
                    Predicate reserveNamePredicate = criteriaBuilder.like(userInfoJoin.get("name"), "%" + selectMeetingParameter.getReserveName() + "%");
                    predicates.add(reserveNamePredicate);
                }
                if (!StringUtils.isEmpty(selectMeetingParameter.getDepartmentId())){
                    Predicate departmentIdPredicate = criteriaBuilder.equal(root.get("departmentId"), selectMeetingParameter.getDepartmentId());
                    predicates.add(departmentIdPredicate);
                }
                if (!StringUtils.isEmpty(selectMeetingParameter.getMeetingRoomId())){
                    Predicate meetingRoomIdPredicate = criteriaBuilder.equal(root.get("meetroomId"), selectMeetingParameter.getMeetingRoomId());
                    predicates.add(meetingRoomIdPredicate);
                }
                if (!StringUtils.isEmpty(selectMeetingParameter.getSelectBeginTime()) && !StringUtils.isEmpty(selectMeetingParameter.getSelectOverTime())) {
                    Predicate meetDatePredicate = criteriaBuilder.between(root.get("meetDate"), selectMeetingParameter.getSelectBeginTime(), selectMeetingParameter.getSelectOverTime());
                    predicates.add(meetDatePredicate);
                }
                if (!StringUtils.isEmpty(selectMeetingParameter.getStatus())) {
                    Integer status = null;
                    switch (selectMeetingParameter.getStatus()) {
                        case "预约失败":
                            status = 6;
                            break;
                        case "预约成功":
                            status = 1;
                            break;
                        case "预约中":
                            status = 2;
                            break;
                        case "会议进行中":
                            status = 3;
                            break;
                        case "会议结束":
                            status = 4;
                            break;
                        case "取消会议":
                            status = 5;
                            break;
                        case "调用失败":
                            status = 7;
                            break;
                        case "调用中":
                            status = 8;
                            break;
                    }
                    Predicate statusPredicate = criteriaBuilder.equal(root.get("status"), status);
                    predicates.add(statusPredicate);
                }
                query.orderBy(criteriaBuilder.asc(root.get("begin")), criteriaBuilder.asc(root.get("status")));
                Predicate[] predicatesArray = new Predicate[predicates.size()];
                return criteriaBuilder.and(predicates.toArray(predicatesArray));
            }
        };
        return meetingRepository.findAll(specification);
    }

    @Override
    public void exportMeetingRecord(List<Meeting> meetings, HttpServletResponse response) throws IOException {
        HSSFWorkbook workbook = new HSSFWorkbook();
        HSSFSheet sheet = workbook.createSheet("会议记录");

        String fileName = "meetingRecord" + ".xls";//设置要导出的文件的名字
        //新增数据行，并且设置单元格数据

        int rowNum = 1;

        String[] headers = {"主题", "预定人", "会议室", "开始时间", "结束时间", "准备时间", "部门"};
        //headers表示excel表中第一行的表头

        HSSFRow row = sheet.createRow(0);
        //在excel表中添加表头

        for (int i = 0; i < headers.length; i++) {
            HSSFCell cell = row.createCell(i);
            HSSFRichTextString text = new HSSFRichTextString(headers[i]);
            cell.setCellValue(text);
        }
        Integer meetRoomId;
        Integer departId;
        Department depart;
        //在表中存放查询到的数据放入对应的列
        for (Meeting meeting : meetings) {
            HSSFRow row1 = sheet.createRow(rowNum);
            row1.createCell(0).setCellValue(meeting.getTopic());
            row1.createCell(1).setCellValue(meeting.getUserinfo().getName());
            meetRoomId = meeting.getMeetroomId();
            MeetingRoom meetroom = findByMeetRoomId(meetRoomId);
            row1.createCell(2).setCellValue(meetroom.getName());
            row1.createCell(3).setCellValue(meeting.getBegin());
            row1.createCell(4).setCellValue(meeting.getOver());
            row1.createCell(5).setCellValue(meeting.getPrepareTime());
            departId = meeting.getDepartId();
            if (departId != null) {
                depart = departmentService.findByDepartmentId(departId);
                row1.createCell(6).setCellValue(depart.getName());
            } else {
                row1.createCell(6).setCellValue("");
            }
            rowNum++;
        }
        response.setContentType("application/octet-stream");
        response.setHeader("Content-disposition", "attachment;filename=" + fileName);
        response.flushBuffer();
        workbook.write(response.getOutputStream());
    }

    @Override
    public List countTimeByDepart(Integer tenantId, String begin, String over) {
        List<DepartmentTime> departmentTimes = new ArrayList<>();
        int place = 0;
        int num = 0;
        List<Object> result = new ArrayList<>();
        List<Meeting> meetings = meetingRepository.selectGroupByDepart(tenantId, begin, over);
        for (int i = 0; i < meetings.size(); i++) {
            Meeting meeting = meetings.get(i);
            Integer departId = meeting.getDepartId();
            Department department = departmentService.findByDepartmentId(departId);
            DepartmentTime departmentTime = new DepartmentTime();
            departmentTime.setDepartmentName(department.getName());
            int time = meetingRepository.countNumberOfMeetingsByDepartmentAndDate(departId, begin, over);
            departmentTime.setId(i + 1);
            departmentTime.setTime(time);
            if (time > num) {
                num = time;
                place = i;
            }
            departmentTimes.add(departmentTime);
        }
        result.add(departmentTimes);
        result.add(place);
        return result;
    }

    @Override
    public List countTimeByPeople(Integer tenantId, String begin, String over) {
        List<UserTime> userTimes = new ArrayList<>();
        int place = 0;
        int num = 0;
        List<Object> result = new ArrayList<>();
        List<Meeting> meetings = meetingRepository.selectGroupByUser(tenantId, begin, over);
        for (int i = 0; i < meetings.size(); i++) {
            Meeting meeting = meetings.get(i);
            Integer userId = meeting.getUserId();
            UserInfo userInfo = userInfoService.getUserInfo(userId);
            UserTime userTime = new UserTime();
            userTime.setUserName(userInfo.getName());
            int time = meetingRepository.countNumberOfMeetingsByUserAndDate(userId, begin, over);
            userTime.setTime(time);
            userTime.setId(i + 1);
            if (time > num) {
                num = time;
                place = i;
            }
            userTimes.add(userTime);
        }
        result.add(userTimes);
        result.add(place);
        return result;
    }

    @Override
    public List countTimeByMeetingRoom(Integer tenantId, String begin, String over) {
        List<MeetingRoomTime> meetingRoomTimes = new ArrayList<>();
        int place = 0;
        int num = 0;
        List<Object> result = new ArrayList<>();
        List<Meeting> meetings = meetingRepository.selectGroupByMeetRoom(tenantId, begin, over);
        for (int i = 0; i < meetings.size(); i++) {
            Meeting meeting = meetings.get(i);
            Integer meetingRoomId = meeting.getMeetroomId();
            MeetingRoom meetingRoom = findByMeetRoomId(meeting.getMeetroomId());
            MeetingRoomTime meetRoomTime = new MeetingRoomTime();
            meetRoomTime.setMeetingRoomName(meetingRoom.getName());
            int time = meetingRepository.countNumberOfMeetingsByMeetingRoomAndDate(meetingRoomId, begin, over);
            meetRoomTime.setId(i + 1);
            meetRoomTime.setTime(time);
            if (time > num) {
                num = time;
                place = i;
            }
            meetingRoomTimes.add(meetRoomTime);
        }
        result.add(meetingRoomTimes);
        result.add(place);
        return result;
    }

    @Override
    public List countHourByDepart(Integer tenantId, String begin, String over) {
        List<DepartmentHour> departmentHours = new ArrayList<>();
        int place = 0;
        double num = 0;
        List<Object> result = new ArrayList<>();
        List<Meeting> meetings = meetingRepository.selectGroupByDepart(tenantId, begin, over);
        for (int i = 0; i < meetings.size(); i++) {
            Meeting meeting = meetings.get(i);
            Integer departmentId = meeting.getDepartId();
            Department depart = departmentService.findByDepartmentId(departmentId);
            DepartmentHour departmentHour = new DepartmentHour();
            departmentHour.setDepartmentName(depart.getName());
            double hour = NumUtil.hold2((meetingRepository.countHoursByDepartmentAndDate(departmentId, begin, over)) * 0.0166667);
            departmentHour.setHour(hour);
            departmentHour.setId(i + 1);
            if (hour > num) {
                num = hour;
                place = i;
            }
            departmentHours.add(departmentHour);
        }
        result.add(departmentHours);
        result.add(place);
        return result;
    }

    @Override
    public List countHourByPeople(Integer tenantId, String begin, String over) {
        List<UserHour> userHours = new ArrayList<>();
        int place = 0;
        double num = 0;
        List<Object> result = new ArrayList<>();
        List<Meeting> meetings = meetingRepository.selectGroupByUser(tenantId, begin, over);
        for (int i = 0; i < meetings.size(); i++) {
            Meeting meeting = meetings.get(i);
            Integer userId = meeting.getUserId();
            UserInfo userInfo = userInfoService.getUserInfo(userId);
            UserHour userHour = new UserHour();
            userHour.setUserName(userInfo.getName());
            double hour = NumUtil.hold2((meetingRepository.countHoursByUserAndDate(userId, begin, over)) * 0.0166667);
            userHour.setHour(hour);
            userHour.setId(i + 1);
            if (hour > num) {
                num = hour;
                place = i;
            }
            userHours.add(userHour);
        }
        result.add(userHours);
        result.add(place);
        return result;
    }

    @Override
    public List countHourByMeetingRoom(Integer tenantId, String begin, String over) {
        List<MeetingRoomHour> meetingRoomHours = new ArrayList<>();
        List<Meeting> meetings = meetingRepository.selectGroupByMeetRoom(tenantId, begin, over);
        int place = 0;
        double num = 0;
        for (int i = 0; i < meetings.size(); i++) {
            Meeting meeting = meetings.get(i);
            Integer meetingRoomId = meeting.getMeetroomId();
            MeetingRoom meetingRoom = findByMeetRoomId(meeting.getMeetroomId());
            MeetingRoomHour meetingRoomHour = new MeetingRoomHour();
            meetingRoomHour.setMeetRoomName(meetingRoom.getName());
            double hour = NumUtil.hold2((meetingRepository.countHoursByMeetingRoomAndDate(meetingRoomId, begin, over)) * 0.0166667);
            if (hour > num) {
                num = hour;
                place = i;
            }
            meetingRoomHour.setHour(hour);
            meetingRoomHour.setId(i + 1);
            meetingRoomHours.add(meetingRoomHour);
        }
        List<Object> list = new ArrayList<>();
        list.add(meetingRoomHours);
        list.add(place);
        return list;
    }
}
