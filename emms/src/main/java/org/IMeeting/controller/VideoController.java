package org.IMeeting.controller;

import org.IMeeting.dao.MeetingVideoDao;
import org.IMeeting.dao.VideoRightDao;
import org.IMeeting.entity.MeetingVideo;
import org.IMeeting.entity.MeetingVideoParam;
import org.IMeeting.entity.ServerResult;
import org.IMeeting.entity.VideoRight;
import org.IMeeting.repository.MeetingVideoRepository;
import org.IMeeting.util.tls_signature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
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
@RequestMapping("/video")
public class VideoController {
    String privateKey = "-----BEGIN PRIVATE KEY-----\n" +
            "MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgD5PeS6Qtywn8mo0Q\n" +
            "UHdvweAnZbqP8WbQVSnFJmGpm+yhRANCAAQdjpZQaB1JNU/GGIk0zLKulhNviqHC\n" +
            "/wMDdiPhUCyeP1PvXPdyCNwrIiFUMZYWBRHf0LJ/PRlMSH8Y2siE0iFy\n" +
            "-----END PRIVATE KEY-----\n";

    @Autowired
    private VideoRightDao videoRightDao;
    @Autowired
    private MeetingVideoDao meetingVideoDao;
    @Autowired
    private MeetingVideoRepository meetingVideoRepository;

    //查找我参加的视频会议
    @RequestMapping("/selectMyVideoRoom")
    public ServerResult selectMyVideoRoom(HttpServletRequest request){
        Integer userId = (Integer) request.getSession().getAttribute("userId");
        List<MeetingVideo> meetingVideoList = meetingVideoRepository.findByUserId(userId);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        serverResult.setData(meetingVideoList);
        return serverResult;
    }

    // 创建视频会议
    @RequestMapping("/createVideoMeeting")
    public ServerResult createVideoMeeting(HttpServletRequest request, @RequestBody MeetingVideoParam meetingVideoParam){
        Integer userId = (Integer) request.getSession().getAttribute("userId");
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        MeetingVideo meetingVideo = new MeetingVideo();
        meetingVideo.setCreateUserId(userId);
        meetingVideo.setTenantId(tenantId);
        meetingVideo.setVideoRoomName(meetingVideoParam.getVideoRoomName());
        meetingVideo.setStatus(1);
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        meetingVideo.setCreateTime(simpleDateFormat.format(new Date()));
        MeetingVideo meetingVideoSaved = meetingVideoRepository.save(meetingVideo);
        List<Integer> userIdList = meetingVideoParam.getUserIdList();
        boolean isCreatorInList = false;
        for (Integer userId1 : userIdList) {
            VideoRight videoRight =new VideoRight();
            videoRight.setVideoId(meetingVideoSaved.getId());
            videoRight.setUserId(userId1);
            videoRightDao.save(videoRight);
            if (userId1.equals(userId))
                isCreatorInList = true;
        }
        if (isCreatorInList) {
            VideoRight videoRight = new VideoRight();
            videoRight.setVideoId(meetingVideoSaved.getId());
            videoRight.setUserId(userId);
            videoRightDao.save(videoRight);
        }
        ServerResult serverResult=new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    // 结束视频会议
    @RequestMapping("/endVideoMeeting")
    public ServerResult endVideoMeeting(@RequestParam("id") Integer id, HttpServletRequest request){
        Integer userId = (Integer) request.getSession().getAttribute("userId");
        List<MeetingVideo> meetingVideos = meetingVideoRepository.findByCreateUserIdAndId(userId, id);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        if (meetingVideos.isEmpty()){
            serverResult.setMessage("您没有权限结束视频会议");
        } else {
            int bol = meetingVideoDao.executeSql("update m_meeting_video m set m.status=2 where m.id=?", id);
            if (bol != 0) {
                serverResult.setCode(1);
                serverResult.setMessage("视频会议已结束");
            }
            else
                serverResult.setCode(0);
        }
        return serverResult;
    }

    // 加入视频会议
    @RequestMapping("/joinVideoMeeting")
    public ServerResult joinVideoMeeting(HttpServletRequest request){
        Integer userId = (Integer) request.getSession().getAttribute("userId");
        tls_signature.GenTLSSignatureResult result = tls_signature.GenTLSSignatureEx(1400208454, userId.toString(), privateKey);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        List<Object> list = new ArrayList<>();
        list.add(userId);
        list.add(request.getSession().getAttribute("name"));
        list.add(result.urlSig);
        serverResult.setData(list);
        return serverResult;
    }
}
