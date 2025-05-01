package org.IMeeting.controller;

import org.IMeeting.entity.MeetingRoomParam;
import org.IMeeting.entity.MeetingRoomParameter;
import org.IMeeting.entity.ServerResult;
import org.IMeeting.repository.MeetingRoomParameterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/meetingRoomParam")
public class MeetingRoomParamController {
    @Autowired
    private MeetingRoomParameterRepository meetingRoomParameterRepository;

    // 跳转到会议设置参数界面
    @RequestMapping("/toMeetingRoomParam")
    public ServerResult toMeetingRoomParam(HttpServletRequest request) {
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        MeetingRoomParameter meetingRoomParameter = meetingRoomParameterRepository.findByTenantId(tenantId);
        ServerResult serverResult = new ServerResult();
        serverResult.setData(meetingRoomParameter);
        serverResult.setStatus(true);
        return serverResult;
    }

    // 修改租户会议参数设置，除了租户id(tenant_id其他参数都需要)
    @RequestMapping("/updateMeetingRoomParam")
    public ServerResult updateMeetingRoomParam(@RequestBody MeetingRoomParameter meetingRoomParameter) {
        meetingRoomParameterRepository.updateMeetingRoomPara(meetingRoomParameter.getId(), meetingRoomParameter.getBegin(), meetingRoomParameter.getDateLimit(), meetingRoomParameter.getOver(), meetingRoomParameter.getTimeInterval(), meetingRoomParameter.getTimeLimit());
        ServerResult serverResult=new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    //恢复出厂设置
    @RequestMapping("/resetMeetingRoomParam")
    public ServerResult resetMeetingRoomParam(@RequestParam("id") Integer id) {
        meetingRoomParameterRepository.updateMeetingRoomPara(id,"08:00",7,"18:00",15,120);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }
}
