package org.IMeeting.controller;

import org.IMeeting.entity.Meeting;
import org.IMeeting.entity.ServerResult;
import org.IMeeting.repository.MeetingRepository;
import org.IMeeting.service.JoinPersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@CrossOrigin(
        origins = "http://localhost:3000",
        methods = {RequestMethod.GET, RequestMethod.POST},
        allowedHeaders = "*",
        allowCredentials = "true"
)
@RestController
@RequestMapping("/joinPerson")
public class JoinPersonController {
    @Autowired
    private MeetingRepository meetingRepository;
    @Autowired
    private JoinPersonService joinPersonService;

    //前往签到记录，显示序号、topic(主题)、begin（开始时间）、over（结束时间）三个参数、后面一个查看按钮，查看某场会议具体签到情况
    @RequestMapping("/toJoinPersonIndex")
    public ServerResult toJoinPersonIndex(HttpServletRequest request){
        Integer userId= (Integer) request.getSession().getAttribute("userId");
        List<Meeting> meetings=meetingRepository.selectByUserIdAndStatusJoin(userId);
        ServerResult serverResult=new ServerResult();
        serverResult.setData(meetings);
        serverResult.setStatus(true);
        return serverResult;
    }

    // 显示某场会议的签到情况
    //传入参数 显示序号、参会人员名字、电话、状态(如果状态是已签到，显示签到时间，如果状态是未签到的有个提醒按钮）
    @RequestMapping("/showOneMeeting")
    public ServerResult showMeeting(@RequestParam("meetingId") Integer meetingId){
        return joinPersonService.showMeeting(meetingId);
    }

    //提醒状态是未签到的人
    @RequestMapping("/remindOne")
    public ServerResult remind(@RequestParam("meetingId") Integer meetingId, @RequestParam("userId") Integer userId){
        return joinPersonService.remind(meetingId, userId);
    }
}
