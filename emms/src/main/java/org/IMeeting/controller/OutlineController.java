package org.IMeeting.controller;

import org.IMeeting.dao.OutlineDao;
import org.IMeeting.entity.Outline;
import org.IMeeting.entity.ServerResult;
import org.IMeeting.repository.OutlineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Transactional
@RequestMapping("/outline")
public class OutlineController {
    @Autowired
    private OutlineDao outlineDao;
    @Autowired
    private OutlineRepository outlineRepository;

    // 会议预定者和会议参与者查看某个会议的会议大纲
    @RequestMapping("/findMeetingOutline")
    public ServerResult findMeetingOutline(@RequestParam("meetingId") Integer meetingId){
        List<Outline> outlines = outlineRepository.findByMeetingIdOrderByLevel(meetingId);
        ServerResult serverResult = new ServerResult();
        serverResult.setData(outlines);
        serverResult.setStatus(true);
        return serverResult;
    }

    // 会议预定者插入某个会议的大纲
    @RequestMapping("/insertMeetingOutline")
    public ServerResult insertMeetingOutline(@RequestBody Outline outline){
        outlineDao.save(outline);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    //会议预定者删除某条会议大纲
    @RequestMapping("/deleteMeetingOutline")
    public ServerResult deleteMeetingOutline(@RequestParam("outlineId")Integer outlineId){
        outlineDao.delete(outlineId);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    //会议预定者修改某条会议大纲
    @RequestMapping("/updateMeetingOutline")
    public ServerResult updateMeetingOutline(@RequestBody Outline outline){
        outlineDao.update(outline);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }
}
