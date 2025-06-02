package org.IMeeting.controller;

import org.IMeeting.dao.WeeklyMeetingDao;
import org.IMeeting.entity.Meeting;
import org.IMeeting.entity.ServerResult;
import org.IMeeting.entity.WeeklyMeeting;
import org.IMeeting.repository.MeetingRepository;
import org.IMeeting.util.TimeUtil;
import org.IMeeting.util.WebUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@CrossOrigin(
        origins = "http://localhost:3000",
        methods = {RequestMethod.GET, RequestMethod.POST},
        allowedHeaders = "*",
        allowCredentials = "true"
)
@RestController
@Transactional
@RequestMapping("/weeklyMeeting")
public class WeeklyMeetingController {
    @Autowired
    private WeeklyMeetingDao weeklyMeetingDao;
    @Autowired
    private MeetingRepository meetingRepository;

    //用户端申请每周例会
    @RequestMapping("/setupWeeklyMeeting")
    public ServerResult setupWeeklyMeeting(@RequestBody WeeklyMeeting weekMeeting, HttpServletRequest request) {
        List<String> days = WebUtils.getDayOfWeekWithinDateInterval(weekMeeting.getBeginTime(), weekMeeting.getOverTime(), weekMeeting.getWeek());
        String beginTime = weekMeeting.getBeginTime();
        String overTime = weekMeeting.getOverTime();
        Integer meetingRoomId = weekMeeting.getMeetingRoomId();
        boolean conflict = false;
        for (String date : days) {
            List<Meeting> meetings = meetingRepository.findIntersectMeeting(date + " " + beginTime, date + " " + overTime, meetingRoomId);
            if (!meetings.isEmpty()) {
                conflict = true;
                break;
            }
        }
        ServerResult serverResult = new ServerResult();
        if (conflict) {
            serverResult.setMessage("对不起！您选择时间段有会议冲突，无法申请！");
            serverResult.setCode(0);
        } else {
            Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
            Integer userId = (Integer) request.getSession().getAttribute("userId");
            Integer departId = (Integer) request.getSession().getAttribute("departId");
            weekMeeting.setTenantId(tenantId);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String nowTime = sdf.format(new Date());
            weekMeeting.setUserId(userId);
            weekMeeting.setStatus(0);
            weekMeeting.setDepartmentId(departId);
            weekMeeting.setCreateTime(nowTime);
            weeklyMeetingDao.save(weekMeeting);
            serverResult.setMessage("申请每周例会成功，等待审核");
            serverResult.setCode(1);
        }
        serverResult.setStatus(true);
        return serverResult;
    }

    //管理端拒绝每周例会申请
    @RequestMapping("/rejectWeeklyMeeting")
    public ServerResult rejectWeeklyMeeting(@RequestParam("id") Integer id) {
        int bol = weeklyMeetingDao.executeSql("update m_week_meeting m set m.status=2 where m.id=?", id);
        ServerResult serverResult = new ServerResult();
        if (bol != 0) {
            serverResult.setStatus(true);
            serverResult.setMessage("审批成功");
            serverResult.setCode(1);
        }
        return serverResult;
    }

    //管理端同意每周例会申请
    @RequestMapping("/approveWeeklyMeeting")
    public ServerResult approveWeeklyMeeting(@RequestParam("id") Integer id) throws ParseException {
        WeeklyMeeting weekMeeting = weeklyMeetingDao.findOne(id);
        List<String> days = WebUtils.getDayOfWeekWithinDateInterval(weekMeeting.getBeginTime(), weekMeeting.getOverTime(), weekMeeting.getWeek());
        String beginTime = weekMeeting.getBeginTime();
        String overTime = weekMeeting.getOverTime();
        Integer meetingRoomId = weekMeeting.getMeetingRoomId();
        boolean conflict = false;
        for (String date : days) {
            List<Meeting> meetings = meetingRepository.findIntersectMeeting(date + " " + beginTime, date + " " + overTime, meetingRoomId);
            if (!meetings.isEmpty()) {
                conflict = true;
                break;
            }
        }
        ServerResult serverResult = new ServerResult();
        if (conflict) {
            serverResult.setMessage("您审批的每周会议与已被预定会议有冲突，审批无法通过");
            serverResult.setCode(-1);
        } else {
            int bol = weeklyMeetingDao.executeSql("update m_week_meeting m set m.status=1 where m.id=?", id);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            String nowTime = sdf.format(new Date());
            Integer departId = weekMeeting.getDepartmentId();
            for (String day : days) {
                Meeting meeting = new Meeting();
                meeting.setCreateTime(nowTime);
                meeting.setStatus(1);
                meeting.setDepartId(departId);
                meeting.setMeetroomId(weekMeeting.getMeetingRoomId());
                meeting.setUserId(weekMeeting.getUserId());
                meeting.setBegin(weekMeeting.getBeginTime());
                meeting.setOver(weekMeeting.getOverTime());
                meeting.setLastTime((int) TimeUtil.minuteDifference(weekMeeting.getBeginTime(), weekMeeting.getOverTime()));
                meeting.setMeetDate(day);
                meetingRepository.saveAndFlush(meeting);
            }
            if (bol != 0) {
                serverResult.setCode(1);
                serverResult.setMessage("审批成功");
            } else {
                serverResult.setCode(2);
            }
        }
        serverResult.setStatus(true);
        return serverResult;
    }

    //管理端查看每周例会申请
    @RequestMapping("/manageWeeklyMeetings")
    public ServerResult manageWeeklyMeetings(HttpServletRequest request) {
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        List<WeeklyMeeting> weeklyMeetings = weeklyMeetingDao.findEqualField("tenantId", tenantId);
        ServerResult serverResult = new ServerResult();
        serverResult.setData(weeklyMeetings);
        return serverResult;
    }

    //用户端查看每周例会申请
    @RequestMapping("/userFindAllWeeklyMeetings")
    public ServerResult userFindAllWeeklyMeetings(HttpServletRequest request) {
        Integer userId = (Integer) request.getSession().getAttribute("userId");
        List<WeeklyMeeting> weeklyMeetings = weeklyMeetingDao.findEqualField("userId", userId);
        ServerResult serverResult = new ServerResult();
        serverResult.setData(weeklyMeetings);
        return serverResult;
    }

    //用户端取消每周例会申请
    @RequestMapping("/cancelWeeklyMeeting")
    public ServerResult cancelWeeklyMeeting(@RequestParam("id") Integer id) {
        int bol = weeklyMeetingDao.executeSql("update m_week_meeting m set m.status=3 where m.id=?", id);
        ServerResult serverResul = new ServerResult();
        if (bol != 0) {
            serverResul.setCode(1);
        } else {
            serverResul.setCode(0);
        }
        serverResul.setStatus(true);
        return serverResul;

    }
}
