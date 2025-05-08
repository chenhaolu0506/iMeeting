package org.IMeeting.controller;

import org.IMeeting.entity.*;
import org.IMeeting.repository.MeetingRepository;
import org.IMeeting.repository.MeetingRoomEquipRepository;
import org.IMeeting.repository.MeetingRoomRepository;
import org.IMeeting.service.MeetingRoomService;
import org.IMeeting.service.MeetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/meetingRoom")
public class MeetingRoomController {
    @Autowired
    private MeetingRoomService meetingRoomService;
    @Autowired
    private MeetingService meetingService;
    @Autowired
    private MeetingRoomRepository meetingRoomRepository;
    @Autowired
    private MeetingRepository meetingRepository;
    @Autowired
    private MeetingRoomEquipRepository meetingRoomEquipRepository;

    //查询该租户所有的会议室,前端根据数字显示会议室状态，nowStatus使用状态0表示未使用，1表示使用中,availstatus表示是否可用1表示可用0表示禁用
    //查询该租户的设备集合equips和部门集合departs需存储 insert方法插入一个部门时需要使用
    @RequestMapping("/selectAll")
    public ServerResult selectAll(HttpServletRequest request){
        ServerResult serverResult=new ServerResult();
        List<List> meetingRooms = (List<List>) meetingRoomService.selectAll(request);
        if (meetingRooms != null) {
            serverResult.setData(meetingRooms);
            serverResult.setStatus(true);
        }
        return serverResult;
    }

    // 禁用会议室
    @RequestMapping("/banOne")
    public ServerResult banOne(@RequestParam("MeetRoomId") Integer meetRoomId){
        meetingRoomRepository.updateMeetingRoomAvailStatus(meetRoomId,0);
        ServerResult serverResult=new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    //启用会议室
    @RequestMapping("/enableOne")
    public ServerResult enableOne(@RequestParam("MeetRoomId")Integer meetRoomId){
        meetingRoomRepository.updateMeetingRoomAvailStatus(meetRoomId,1);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    // 删除会议室
    @RequestMapping("/deleteOne")
    public ServerResult deleteOne(@RequestParam("MeetRoomId")Integer meetRoomId){
        meetingRoomRepository.updateMeetingRoomAvailStatus(meetRoomId,2);
        ServerResult serverResult=new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    //显示会议室详情,具体显示的内容见MeetRoomServiceImpl
    @RequestMapping("/showOne")
    public ServerResult showOne(@RequestParam("MeetRoomId") Integer meetRoomId,HttpServletRequest request){
        return meetingRoomService.showMeetingRoom(meetRoomId, request);
    }

    //修改会议室，传入参数equips表示会议室设备，enables表示允许使用会议室的部门，bans表示禁止使用会议室的部门
    @RequestMapping("/editOne")
    public ServerResult editOne(@RequestBody MeetingRoomParam meetingRoomParam, HttpServletRequest request){
        return meetingRoomService.editMeetingRoom(meetingRoomParam, request);
    }

    //添加一个会议室,传入参数equips表示会议室设备，enables表示允许使用会议室的部门,bans表示禁止使用会议室的部门
    @RequestMapping("/insertOne")
    public ServerResult insertOne(@RequestBody MeetingRoomParam meetingRoomParam, HttpServletRequest request){
        return meetingRoomService.insertMeetingRoom(meetingRoomParam,request);
    }

    //用户端获取用户有权限可预定的会议室
    @RequestMapping("/getEffectiveMeetingRoom")
    public ServerResult getEffectiveMeetingRoom(HttpServletRequest request){
        List<MeetingRoom> meetingRooms = meetingService.getEffectiveMeetingRoom(request);
        ServerResult serverResult = new ServerResult();
        serverResult.setData(meetingRooms);
        serverResult.setStatus(true);
        return serverResult;
    }

    //扫描二维码验证该用户是否有权限预定该会议室
    @RequestMapping("/scanCode")
    public ServerResult scanCode(@RequestParam("meetRoomId") Integer meetRoomId, HttpServletRequest request){
        ServerResult serverResult = new ServerResult();
        Integer userId= (Integer) request.getSession().getAttribute("userId");
        List<MeetingRoom> meetingRooms = meetingService.getEffectiveMeetingRoom(request);
        boolean meetingRoomFound = false;
        if (!meetingRooms.isEmpty()){
            for (MeetingRoom meetingRoom : meetingRooms){
                if (meetingRoom.getId().equals(meetRoomId)){
                    meetingRoomFound = true;
                    break;
                }
            }
        }
        if (!meetingRoomFound){
            serverResult.setMessage("对不起，您没有权限预定该会议室");
            serverResult.setCode(-1);
        } else {
            List<String>result = meetingService.findFreeTime(meetRoomId,request);
            serverResult.setCode(1);
            serverResult.setData(result);
        }
        serverResult.setStatus(true);
        return serverResult;
    }

    //会议室会议管理
    @RequestMapping("/selectByDateAndMeetingRoom")
    public ServerResult selectByDateAndMeetingRoom(@RequestParam("meetRoomId") Integer meetingRoomId, @RequestParam("selectDate") String selectDate){
        ServerResult serverResult = new ServerResult();
        List<Meeting> meetings = meetingRepository.findByMeetroomIdAndMeetDateOrderByBegin(meetingRoomId, selectDate);
        serverResult.setData(meetings);
        serverResult.setStatus(true);
        return serverResult;
    }

    // 获取某个会议室的设备
    @RequestMapping("/getOneRoomEquip")
    public ServerResult getOneRoomEquip(@RequestParam("meetRoomId") Integer meetingRoomId){
        List<MeetingRoomEquip> meetingRoomEquips = meetingRoomEquipRepository.findByMeetroomId(meetingRoomId);
        ServerResult serverResult=new ServerResult();
        serverResult.setData(meetingRoomEquips);
        serverResult.setStatus(true);
        return serverResult;
    }
}
