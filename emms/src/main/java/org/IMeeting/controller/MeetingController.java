package org.IMeeting.controller;

import org.IMeeting.entity.*;
import org.IMeeting.repository.*;
import org.IMeeting.service.*;
import org.IMeeting.util.DateUtil;
import org.IMeeting.util.MeetUtil;
import org.IMeeting.util.TimeUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/meeting")
public class MeetingController {
    @Autowired
    private MeetingService meetingService;
    @Autowired
    private GroupService groupService;
    @Autowired
    private EquipService equipService;
    @Autowired
    private MeetingRoomService meetingRoomService;
    @Autowired
    private MeetingRepository meetingRepository;
    @Autowired
    private LeaveInformationRepository leaveInformationRepository;
    @Autowired
    private MeetingRoomRepository meetingRoomRepository;
    @Autowired
    private MeetingRoomParameterRepository meetingRoomParameterRepository;
    @Autowired
    private DepartmentRepository departmentRepository;
    @Autowired
    private JoinPersonRepository joinPersonRepository;
    @Autowired
    private PushMessageRepository pushMessageRepository;
    @Autowired
    private MeetingRoomEquipRepository meetingRoomEquipRepository;
    @Autowired
    private OutsideJoinPersonRepository outsideJoinPersonRepository;
    @Autowired
    private UserInfoService userInfoService;
    private transient Logger logger = LoggerFactory.getLogger(this.getClass());


    // 预定会议首页
    @RequestMapping("/reserveIndex")
    public ServerResult reserveIndex(HttpServletRequest request) {
        return meetingService.toReserveIndex(request);
    }

    //查找一个会议室某一天的预定情况
    @RequestMapping("/oneRoomReserve")
    public ServerResult oneRoomReserve(@RequestParam(value = "reserveDate", required = false) String reserveDate, @RequestParam(value = "roomId", required = false) Integer roomId) {
        return meetingService.getRoomReserver(roomId, reserveDate);
    }

    //查询某天会议室集合的预定情况，进度条显示
    @RequestMapping("/oneDayReserve")
    public ServerResult oneDayReserve(@RequestBody OneDayReservation oneDayReservation) {
        return meetingService.getOneDayReserve(oneDayReservation);
    }

    //在预定的时候获取该用户拥有的群组列表
    @RequestMapping("/getGroupList")
    public ServerResult getGroupList(HttpServletRequest request) {
        Integer userId = (Integer) request.getSession().getAttribute("userId");
        return groupService.getGroupList(userId);
    }

    // 在预定的时候获取特定群组的用户列表
    @RequestMapping("/showOneGroup")
    public ServerResult showOneGroup(@RequestParam Integer groupId) {
        return groupService.showGroupById(groupId);
    }

    // 除了群组人员以外选择其他人员
    @RequestMapping("/selectPeople")
    public ServerResult selectPeople(HttpServletRequest request) {
        return groupService.showUser(request);
    }

    // 预定会议
    @RequestMapping("/reserveMeeting")
    public ServerResult reserveMeeting(@RequestBody ReserveParam reserveParameter, HttpServletRequest request) throws Exception {
        return meetingService.reserveMeeting(reserveParameter, request);
    }

    // 抢会议
    @RequestMapping("/robMeeting")
    public ServerResult robMeeting(@RequestBody ReserveParam reserveParameter, HttpServletRequest request) {
        return meetingService.robMeeting(reserveParameter, request);
    }

    // 调用会议
    @RequestMapping("/coordinateMeeting")
    public ServerResult coordinateMeeting(@RequestBody CoordinateParameter coordinateParameter, HttpServletRequest request) {
        return meetingService.coordinateMeeting(coordinateParameter, request);
    }

    // 取消会议
    @RequestMapping("/cancelMeeting")
    public ServerResult cancelMeeting(@RequestParam("meetingId") Integer meetingId) {
        return meetingService.cancelMeeting(meetingId);
    }

    // 显示用户当月预定情况
    @RequestMapping("/showMyReserve")
    public ServerResult showMyReserve(HttpServletRequest request) {
        return meetingService.showMyReserve(request);
    }

    // 查找某个月用户会议预定情况
    @RequestMapping("/specifiedMyReserve")
    public ServerResult specifiedMyReserve(HttpServletRequest request, @RequestParam("yearMonth") String yearMonth) {
        return meetingService.specifiedMyReserve(request, yearMonth);
    }

    // 显示用户某一天所有预定情况
    @RequestMapping("/showOneDayReserve")
    public ServerResult showOneDayReserve(@RequestParam("reserveDate") String reserveDate, HttpServletRequest request) {
        return meetingService.oneDayMyReserve(reserveDate, request);
    }

    // 显示某个预定会议的细节
    @RequestMapping("/showOneReserveDetail")
    public ServerResult showOneReserveDetail(@RequestParam("meetingId") Integer meetingId) {
        return meetingService.oneReserveDetail(meetingId);
    }

    // 拒绝调用会议
    @RequestMapping("/disagreeCoordinate")
    public ServerResult disagreeCoordinate(@RequestParam("coordinateId") Integer coordinateId) {
        return meetingService.disagreeCoordinate(coordinateId);
    }

    // 同意调用会议
    @RequestMapping("/agreeCoordinate")
    public ServerResult agreeCoordinate(@RequestParam("coordinateId") Integer coordinateId) {
        return meetingService.agreeCoordinate(coordinateId);
    }

    // 第一种修改方式，修改了时间或者地点或者都修改，相当于取消原会议重新预定
    // 第二种修改方式，修改除时间和地点外的其他内容
    @RequestMapping("/editOneServer")
    public ServerResult OneEditMyServer(@RequestBody ReserveParam reserveParameter, HttpServletRequest request) throws Exception {
        Meeting meeting = meetingService.findByMeetingId(reserveParameter.getMeetingId());
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        String reserveBegin = reserveParameter.getReserveDate() + " " + reserveParameter.getBeginTime();
        String reserveOver = TimeUtil.addMinute(reserveBegin, reserveParameter.getLastTime());
        Integer reserveMeetingRoomId = reserveParameter.getMeetingRoomId();
        ServerResult serverResult = null;
        if (meeting.getBegin().equals(reserveBegin) && meeting.getOver().equals(reserveOver) && meeting.getMeetroomId().equals(reserveMeetingRoomId)) {
            serverResult = meetingService.editMeetingDetail(reserveParameter, request);
        } else {
            serverResult = meetingService.rescheduleMeeting(reserveParameter, request);
        }
        return serverResult;
    }

    // 提前结束会议
    @RequestMapping("/advanceOver")
    public ServerResult advanceOver(@RequestParam("meetingId") Integer meetingId) throws Exception {
        return meetingService.advanceOver(meetingId);
    }

    // 计算显示我参加的会议(本月)已结束和未开始会议的次数
    @RequestMapping("/toSelectMyJoinMeeting")
    public ServerResult toSelectMyJoinMeeting(HttpServletRequest request) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String yearMonth = sdf.format(new java.util.Date()).substring(0, 7);
        return meetingService.selectMyJoinMeeting(request, yearMonth);
    }

    // 根据月份计算显示我参加的会议的已结束和未开始会议的次数参数如2019-01-20
    @RequestMapping("/specifiedMyJoinMeeting")
    public ServerResult specifiedMyJoinMeeting(HttpServletRequest request, @RequestParam("yearMonth") String yearMonth) {
        return meetingService.selectMyJoinMeeting(request, yearMonth);
    }

    // 显示某一天我参加的会议情况
    @RequestMapping("/selectMyJoinMeetingByDate")
    public ServerResult selectMyJoinMeetingByDate(HttpServletRequest request, @RequestParam("meetDate") String meetDate) {
        return meetingService.selectMyJoinMeetingByDate(meetDate, request);
    }

    // 提交请假
    @RequestMapping("/sendLeaveInformation")
    public ServerResult sendLeaveInformation(HttpServletRequest request, @RequestBody LeaveInformation leaveInformation) {
        return meetingService.sendLeaveInformation(leaveInformation, request);
    }

    //根据日期显示未开始和进行中会议的请假请求总数和未处理请假数量
    @RequestMapping("/CountLeaveInformation")
    public ServerResult CountLeaveInformation(HttpServletRequest request) {
        return meetingService.countLeaveInformation(request);
    }

    //显示某场会议的请假情况
    @RequestMapping("/showOneMeetingLeaveInfo")
    public ServerResult showOneMeetingLeaveInfo(@RequestParam("meetingId") Integer meetingId) {
        return meetingService.showOneMeetingLeaveInfo(meetingId);
    }

    // 同意请假
    @RequestMapping("/agreeLeave")
    public ServerResult agreeLeave(@RequestParam("leaveInfoId") Integer leaveInfoId) {
        leaveInformationRepository.approveLeave(leaveInfoId);
        LeaveInformation leaveInformation = meetingService.findById(leaveInfoId);
        joinPersonRepository.updateStatus(3, leaveInformation.getMeetingId(), leaveInformation.getUserId());
        PushMessage pushMessage = new PushMessage();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String nowTime = sdf.format(new Date());
        pushMessage.setTime(nowTime);
        pushMessage.setStatus(0);
        pushMessage.setMessage("请假审批通过");
        pushMessage.setReceiveId(leaveInformation.getUserId());
        pushMessage.setMeetingId(leaveInformation.getMeetingId());
        pushMessageRepository.saveAndFlush(pushMessage);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    //拒绝请假
    @RequestMapping("/disagreeLeave")
    public ServerResult disagreeLeave(@RequestParam("leaveInfoId") Integer leaveInfoId) {
        leaveInformationRepository.rejectLeave(leaveInfoId);
        LeaveInformation leaveInformation = meetingService.findById(leaveInfoId);
        joinPersonRepository.updateStatus(4, leaveInformation.getMeetingId(), leaveInformation.getUserId());
        PushMessage pushMessage = new PushMessage();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String nowTime = sdf.format(new Date());
        pushMessage.setTime(nowTime);
        pushMessage.setStatus(0);
        pushMessage.setMessage("请假审批未通过");
        pushMessage.setReceiveId(leaveInformation.getUserId());
        pushMessage.setMeetingId(leaveInformation.getMeetingId());
        pushMessageRepository.saveAndFlush(pushMessage);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    //消息推送
    @RequestMapping("/pushMessage")
    public ServerResult pushMessage(HttpServletRequest request) {
        return meetingService.findPushMessage(request);
    }

    //智能推荐会议室
    @RequestMapping("/recommendMeetingRoom")
    public ServerResult recommendMeetingRoom(HttpServletRequest request, @RequestBody RecommendParam recommendParam) {
        int[] equips = recommendParam.getEquip();
        double[] weight = recommendParam.getWeights();
        List<MeetingRoom> meetingRoomList = meetingService.getEffectiveMeetingRoom(request);
        int equipLength = equips.length;
        double[] target = new double[equipLength + 1]; //需求
        for (int j = 0; j < equipLength; j++) {
            target[j] = 1;
        }

        List<RecommendResult> recommendResults = new ArrayList<>();
        NumberFormat nf = NumberFormat.getPercentInstance();
        for (MeetingRoom meetingRoom : meetingRoomList) {
            double[] source = new double[equipLength + 1];
            target[equipLength] = recommendParam.getContain();
            int meetingRoomId = meetingRoom.getId();
            for (int i = 0; i < equipLength; i++) {
                MeetingRoomEquip meetingRoomEquip = meetingRoomEquipRepository.findByEquipIdAndMeetroomId(equips[i], meetingRoomId);
                source[i] = meetingRoomEquip == null ? 0 : 1;
            }
            source[equipLength] = meetingRoom.getContain();
            double similar = meetingService.countSimilar(source, target, weight);
            if (!nf.format(similar).equals("\ufffd")) {
                RecommendResult recommendResult = new RecommendResult();
                recommendResult.setMeetingRoomId(meetingRoomId);
                MeetingRoom meetingRoom1 = meetingRoomService.getMeetingRoom(meetingRoomId);
                recommendResult.setMeetingRoomName(meetingRoom1.getName());
                recommendResult.setContain(meetingRoom1.getContain());
                recommendResult.setNum(meetingRoom1.getNum());
                List<MeetingRoomEquip> meetingRoomEquips = meetingRoomEquipRepository.findByMeetroomId(meetingRoomId);
                recommendResult.setMeetingRoomEquipList(meetingRoomEquips);
                recommendResult.setSimilarityScore(similar);
                recommendResult.setSimilar(nf.format(similar));
                recommendResults.add(recommendResult);
            }
        }
        Collections.sort(recommendResults, new Comparator<RecommendResult>() {
            /*
             * int compare(Person p1, Person p2) 返回一个基本类型的整型，
             * 返回负数表示：p1 大于p2，
             * 返回0 表示：p1和p2相等，
             * 返回正数表示：p1小于p2
             */
            public int compare(RecommendResult p1, RecommendResult p2) {
                //按照相似度进行升序排列
                if (p1.getSimilarityScore() > p2.getSimilarityScore()) {
                    return -1;
                }
                if (p1.getSimilarityScore() == p2.getSimilarityScore()) {
                    return 0;
                }
                return 1;
            }
        });
        ServerResult serverResult = new ServerResult();
        serverResult.setData(recommendResults);
        serverResult.setStatus(true);
        return serverResult;
    }

    //查找智能推荐会议室空闲时间段
    @RequestMapping("/findFreeTime")
    public ServerResult findFreeTime(@RequestParam("meetDate") String meetDate, @RequestParam("meetRoomId") Integer meetRoomId, HttpServletRequest request) {
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        MeetingRoomParameter meetingRoomParameter = meetingRoomParameterRepository.findByTenantId(tenantId);
        String beginTime = meetingRoomParameter.getBegin();
        String overTime = meetingRoomParameter.getOver();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String yearMonth = sdf.format(new java.util.Date()).substring(0, 10);
        List<String> result;
        if (yearMonth.equals(meetDate)) {
            String nowTime = sdf.format(new java.util.Date()).substring(11, 16);
            List<Meeting> meetings = meetingRepository.selectByMeetDateWhereStatusIsOneOrThree(meetDate, meetRoomId);
            result = MeetUtil.returnFreeTime(nowTime, overTime, meetings);
        } else {
            List<Meeting> meetings = meetingRepository.selectByMeetingDateAndStatusAndMeetingRoomId(meetDate, 1, meetRoomId);
            result = MeetUtil.returnFreeTime(beginTime, overTime, meetings);
        }
        ServerResult serverResult = new ServerResult();
        serverResult.setData(result);
        return serverResult;
    }

    /*-------------华丽分割线-------------*/
    // 跳转条件查找预定记录页面,返回显示会议室id和名字，部门id和名字
    @RequestMapping("/toFindMeetingBySpecification")
    public ServerResult toFindMeetingBySpecification(HttpServletRequest request) {
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        List<MeetingRoom> meetingRooms = meetingRoomRepository.findByTenantId(tenantId);
        List<Department> departments = departmentRepository.findByTenantId(tenantId);
        List<List> lists = new ArrayList<>();
        lists.add(meetingRooms);
        lists.add(departments);
        ServerResult serverResult = new ServerResult();
        serverResult.setData(lists);
        serverResult.setStatus(true);
        return serverResult;
    }

    //条件查找预定记录,参数备注见实体类，查询开始时间、结束时间必须同时有才可以
    @RequestMapping("/findMeetingBySpecification")
    public ServerResult findMeetingBySpecification(@RequestBody SelectMeetingParameter selectMeetingParameter, HttpServletRequest request) {
        ServerResult serverResult = new ServerResult();
        List<Meeting> meetings = meetingService.findBySpecification(selectMeetingParameter, request);
        List<ReserverRecord> list = new ArrayList<>();
        for (Meeting meeting : meetings) {
            ReserverRecord reserverRecord = new ReserverRecord();
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
            reserverRecord.setId(meeting.getId());
            reserverRecord.setTopic(meeting.getTopic());
            reserverRecord.setBegin(meeting.getBegin());
            reserverRecord.setOver(meeting.getOver());
            MeetingRoom meetingRoom = meetingService.findByMeetRoomId(meeting.getMeetroomId());
            reserverRecord.setMeetingRoom(meetingRoom.getName());
            reserverRecord.setCreateTime(meeting.getCreateTime());
            reserverRecord.setPeopleName(meeting.getUserinfo().getName());
            if (meeting.getDepart() != null) {
                reserverRecord.setMeetingDate(meeting.getDepart().getName());
            }
            list.add(reserverRecord);
        }
        serverResult.setData(list);
        serverResult.setStatus(true);
        return serverResult;
    }

    // 导出会议预定情况，需要和findMeetingBySpecification一样的条件传入
    @RequestMapping("/exportMeetingRecord")
    public void exportMeetingRecord(@RequestBody SelectMeetingParameter selectMeetingParameter, HttpServletRequest request, HttpServletResponse response) throws IOException, IOException {
        ServerResult serverResult = new ServerResult();
        List<Meeting> meetings = meetingService.findBySpecification(selectMeetingParameter, request);
        meetingService.exportMeetingRecord(meetings, response);
    }

    //传入参数begin查询开始时间 over结束时间 way方面 1会议室 2部门 3预定人 type方式 1时间 2次数
    @RequestMapping("/selectDataCount")
    public ServerResult selectDataCount(HttpServletRequest request, @RequestParam("begin") String begin, @RequestParam("over") String over, @RequestParam("way") int way, @RequestParam("type") int type) {
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        ServerResult serverResult = new ServerResult();
        if (way == 1 && type == 1) {
            List<Object> result = meetingService.countHourByMeetingRoom(tenantId, begin, over);
            List<MeetingRoomHour> meetRoomHours = (List<MeetingRoomHour>) result.get(0);
            if (!meetRoomHours.isEmpty()) {
                serverResult.setMessage(meetRoomHours.get((int) result.get(1)).getMeetRoomName() + "会议室在查询时间内使用会议室时间长，建议增加开设该类型会议室，" +
                        "对该会议室资源进行合理分配管理");
                serverResult.setData(meetRoomHours);
                serverResult.setStatus(true);
            } else {
                serverResult.setMessage("该时间段内会议室未被使用");
            }
        } else if (way == 1 && type == 2) {
            List<Object> result = meetingService.countTimeByMeetingRoom(tenantId, begin, over);
            List<MeetingRoomHour> meetRoomTimes = (List<MeetingRoomHour>) result.get(0);
            if (!meetRoomTimes.isEmpty()) {
                serverResult.setMessage(meetRoomTimes.get((int) result.get(1)).getMeetRoomName() + "在查询时间内使用频率高，建议增加开设该类型会议室，" +
                        "对该会议室资源进行合理分配管理");
                serverResult.setData(meetRoomTimes);
                serverResult.setStatus(true);
            } else {
                serverResult.setMessage("该时间段内会议室未被使用");
                serverResult.setStatus(true);
            }
        } else if (way == 2 && type == 1) {
            List<Object> result = meetingService.countHourByDepart(tenantId, begin, over);
            List<DepartmentHour> departHours = (List<DepartmentHour>) result.get(0);
            if (!departHours.isEmpty()) {
                serverResult.setMessage(departHours.get((int) result.get(1)).getDepartmentName() + "在查询时间内使用会议室时间长，建立对会议室资源进行合理调控");
                serverResult.setData(departHours);
                serverResult.setStatus(true);
            } else {
                serverResult.setMessage("该时间段内会议室未被使用");
                serverResult.setStatus(true);
            }
        } else if (way == 2 && type == 2) {
            List<Object> result = meetingService.countTimeByDepart(tenantId, begin, over);
            List<DepartmentTime> departTimes = (List<DepartmentTime>) result.get(0);
            if (departTimes.size() != 0) {
                serverResult.setMessage(departTimes.get((int) result.get(1)).getDepartmentName() + "在查询时间内使用会议室频率高，建立对会议室资源进行合理调控");
                serverResult.setData(departTimes);
                serverResult.setStatus(true);
            } else {
                serverResult.setMessage("该时间段内会议室未被使用");
                serverResult.setStatus(true);
            }
        } else if (way == 3 && type == 1) {
            List<Object> result = meetingService.countHourByPeople(tenantId, begin, over);
            List<UserHour> userHours = (List<UserHour>) result.get(0);
            if (!userHours.isEmpty()) {
                serverResult.setMessage(userHours.get((int) result.get(1)).getUserName() + "在查询时间内使用会议室时间长，建立对会议室资源进行合理调控");
                serverResult.setData(userHours);
                serverResult.setStatus(true);
            } else {
                serverResult.setMessage("该时间段内会议室未被使用");
                serverResult.setStatus(true);
            }
        } else if (way == 3 && type == 2) {
            List<Object> result = meetingService.countTimeByPeople(tenantId, begin, over);
            List<UserTime> userTimes = (List<UserTime>) result.get(0);
            if (!userTimes.isEmpty()) {
                serverResult.setMessage(userTimes.get((int) result.get(1)).getUserName() + "在查询时间内使用会议室频率高，建立对会议室资源进行合理调控");
                serverResult.setData(userTimes);
                serverResult.setStatus(true);
            } else {
                serverResult.setMessage("该时间段内会议室未被使用");
                serverResult.setStatus(true);
            }
        }
        return serverResult;
    }

    @RequestMapping("/indexData")
    public ServerResult indexData(HttpServletRequest request) {
        Integer userId = (Integer) request.getSession().getAttribute("userId");
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        // validate params in request
        if (userId == null || tenantId == null) {
            return ServerResult.failWithMessage("Invalid request parameters");
        }
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String today = simpleDateFormat.format(new Date());
        Date addDay = DateUtil.addDay(new Date(), 14);
        Date reduceDay = DateUtil.addDay(new Date(), -14);
        List<Meeting> meetings = meetingRepository.findMeetingByUserIdAndDate(userId, simpleDateFormat.format(reduceDay), simpleDateFormat.format(addDay));
        DecimalFormat df = new DecimalFormat("0.00");
        logger.info("userId: {} tenantId: {}", userId, tenantId);
        double free = Double.parseDouble(df.format((float) meetingRoomRepository.countFreeRoomByTenantId(tenantId) / meetingRoomRepository.countByTenantId(tenantId))) * 100;
        List<Meeting> meetingList = meetingRepository.findOverMeetingByUserIdAndDate(userId, simpleDateFormat.format(reduceDay), today);
        List<Integer> meetingCount = new ArrayList<>();
        int countSum;
        for (int i = 1; i <= 14; i++) {
            String date = simpleDateFormat.format(DateUtil.addDay(reduceDay, i));
            countSum = 0;
            for (Meeting meeting : meetingList) {
                if (meeting.getMeetDate().equals(date))
                    countSum++;
            }
            meetingCount.add(countSum);
        }
        List<Object> meetRoomCount = new ArrayList<>();
        List<Meeting> groupMeeting = meetingRepository.findOverMeetingByUserIdAndDateGroupByRoom(userId, simpleDateFormat.format(reduceDay), today);
        for (Meeting meeting : groupMeeting) {
            List<Object> list = new ArrayList<>();
            int count = meetingRepository.countOverMeetingByUserIdAndDateAndRoom(userId, simpleDateFormat.format(reduceDay), today, meeting.getMeetroomId());
            list.add(meeting.getMeetroom().getName());
            list.add(count);
            meetRoomCount.add(list);
        }
        List<Meeting> m = meetingRepository.findOverMeetingByTenantIdAndDateGroupByRoom(tenantId, simpleDateFormat.format(reduceDay), today);
        List<Object> tenantMeetRoomCount = new ArrayList<>();
        for (Meeting meeting : m) {
            List<Object> list = new ArrayList<>();
            int count = meetingRepository.countOverMeetingByDateAndRoom(simpleDateFormat.format(reduceDay), today, meeting.getMeetroomId());
            list.add(meeting.getMeetroom().getName());
            list.add(count);
            tenantMeetRoomCount.add(list);
        }
        ServerResult serverResult = new ServerResult();
        List<Object> result = new ArrayList<>();
        result.add(meetings);//用户近两周和过去两周将要参加的会议
        result.add(free);//当前时间段空余会议室
        result.add(meetingList.size());//用户前两周召开的会议次数
        result.add(meetingCount);//用户前两周每天召开的会议次数
        result.add(meetingList);//用户近两周参加的会议信息
        result.add(meetRoomCount);//用户前两周每个会议室的使用次数统计
        result.add(tenantMeetRoomCount);//租户的每个会议室前两周使用次数统计
        serverResult.setData(result);
        serverResult.setStatus(true);
        return serverResult;
    }

    // 管理端进行预定会议
    @RequestMapping("/reserveByManage")
    public ServerResult reserveByManage(@RequestBody ReserveParam reserveParameter, HttpServletRequest request) throws Exception {
        ServerResult serverResult = new ServerResult();
        Integer userId = reserveParameter.getUserId();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        MeetingRoomParameter meetingRoomParameter = meetingRoomParameterRepository.findByTenantId(tenantId);
        String beginTime = meetingRoomParameter.getBegin();
        String overTime = meetingRoomParameter.getOver();
        int lastTime = reserveParameter.getLastTime();
        int prepareTime = reserveParameter.getPrepareTime();
        String reserveBeginTime = reserveParameter.getBeginTime();
        String reserveDate = reserveParameter.getReserveDate();
        String afterBeginTime = reserveDate + " " + reserveParameter.getBeginTime();
        String afterOverTime = TimeUtil.addMinute(afterBeginTime, lastTime);
        String nowTime = sdf.format(new java.util.Date());
        int bol1 = 2, bol2 = 2, bol3 = 2, bol4 = 2;
        bol1 = TimeUtil.DateCompare(reserveBeginTime, beginTime, "HH:mm");
        bol2 = TimeUtil.DateCompare(afterOverTime.substring(11, 16), overTime, "HH:mm");
        bol3 = TimeUtil.DateCompare(reserveBeginTime, afterOverTime.substring(11, 16), "HH:mm");
        bol4 = TimeUtil.DateCompare(afterBeginTime, nowTime, "yyyy-MM-dd HH:mm");
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
            Integer meetingRoomId = reserveParameter.getMeetingRoomId();
            List<Meeting> meetings = meetingRepository.findIntersectMeeting(afterBeginTime, afterOverTime, meetingRoomId);
            if (!meetings.isEmpty()) {
                return ServerResult.failWithMessage("预定时间段有冲突");
            }
            Meeting meeting = new Meeting();
            meeting.setMeetDate(reserveParameter.getReserveDate());
            meeting.setBegin(afterBeginTime);
            meeting.setContent(reserveParameter.getContent());
            meeting.setMeetroomId(meetingRoomId);
            meeting.setOver(afterOverTime);
            meeting.setStatus(1);
            meeting.setLastTime(lastTime);
            meeting.setTopic(reserveParameter.getTopic());
            meeting.setTenantId(tenantId);
            meeting.setUserId(userId);
            meeting.setMeetDate(reserveDate);
            meeting.setPrepareTime(prepareTime);
            UserInfo userInfo = userInfoService.getUserInfo(userId);
            meeting.setDepartId(userInfo.getDepartId());
            meeting.setCreateTime(nowTime);
            Meeting meeting1 = meetingRepository.saveAndFlush(meeting);
            Integer meetingId = meeting1.getId();
            String message = "您有一个新的会议，点击查看详情";
            int b = 0;
            List<Integer> joinPersonIds = reserveParameter.getJoinPersonIds();
            for (Integer joinPersonId : joinPersonIds) {
                if (joinPersonId.equals(userId))
                    b = 1;
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
            if (b == 0) {
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
            List<OutsideJoinPerson> outsideJoinPersons = reserveParameter.getOutsideJoinPersonList();
            for (OutsideJoinPerson outsideJoinPerson : outsideJoinPersons) {
                OutsideJoinPerson newOutsideJoinPerson = new OutsideJoinPerson();
                newOutsideJoinPerson.setName(outsideJoinPerson.getName());
                newOutsideJoinPerson.setPhone(outsideJoinPerson.getPhone());
                newOutsideJoinPerson.setMeetingId(meetingId);
                outsideJoinPersonRepository.saveAndFlush(newOutsideJoinPerson);
            }
            serverResult.setMessage("会议预定成功");
            serverResult.setStatus(true);
        }
        return serverResult;
    }
}
