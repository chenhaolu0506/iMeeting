package org.IMeeting.controller;

import com.jcraft.jsch.SftpException;
import org.IMeeting.dao.AbnormalInfoDao;
import org.IMeeting.entity.AbnormalInfo;
import org.IMeeting.entity.FaceInfo;
import org.IMeeting.entity.Meeting;
import org.IMeeting.entity.PushMessage;
import org.IMeeting.repository.AbnormalRepository;
import org.IMeeting.repository.FaceInfoRepository;
import org.IMeeting.repository.MeetingRepository;
import org.IMeeting.repository.PushMessageRepository;
import org.IMeeting.util.FaceRecognition;
import org.IMeeting.util.SFTPUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Vector;

@Component
public class TimerTask {
    public final static long oneTime = 10 * 1000;
    @Autowired
    private FaceInfoRepository faceInfoRepository;
    @Autowired
    private AbnormalInfoDao abnormalInfoDao;
    @Autowired
    private MeetingRepository meetingRepository;
    @Autowired
    private PushMessageRepository pushMessageRepository;
    @Autowired
    private AbnormalRepository abnormalRepository;

    @Scheduled(fixedRate = oneTime)
    public void startMeeting() throws ParseException, SftpException, FileNotFoundException {
        List<FaceInfo> faceInfos = faceInfoRepository.selectJoinPersonFaceInfo(1, 3);
        List<Meeting> meetings = meetingRepository.findByMeetroomIdAndStatus(1, 3);
        if (!meetings.isEmpty()) {
            Meeting meeting = meetings.get(0);
            int meetingId = meeting.getId();
            String meetingName = meeting.getTopic();
            int userId = meeting.getUserId();
            if (!faceInfos.isEmpty()) {
                SFTPUtil sftp = new SFTPUtil("root", "Jgnzxcvbnm,666!", "39.106.56.132", 22);
                sftp.login();
                Vector<?> sftpList = sftp.listFiles("/usr/share/nginx/image/Face");
                System.out.println("获取到图片名字列表");
                List<String> files = new ArrayList<>();
                for (int i = 0; i < sftpList.size(); i++) {
                    int idx = sftpList.get(i).toString().indexOf("test");
                    String str = null;
                    if (idx != -1) {
                        str = sftpList.get(i).toString().substring(idx);
                        files.add(str);
                        System.out.println(str);
                    }
                }
                System.out.println("循环图片列表");
                for (String fileName : files) {
                    FaceRecognition faceRecognition = new FaceRecognition();
                    File file = sftp.downloadFile("/usr/share/nginx/image/Face", fileName, "com");
                    byte[] faceDetail = faceRecognition.getFeatureData(file);
                    boolean flag = true;
                    System.out.println("循环已有的特征值列表");
                    for (FaceInfo faceInfo : faceInfos) {
                        System.out.println("进行人脸图像相似度比较");
                        double similar = faceRecognition.faceCompare(faceDetail, faceInfo.getFaceDetail());
                        System.out.println("相似度 = " + similar);
                        if (similar > 0.8) {
                            flag = false;
                            System.out.println("相似度>0.8是参会人员，退出循环");
                            break;
                        }
                        else{
                            System.out.println("鉴定为参会人员");
                            sftp.delete("/usr/share/nginx/image/Face/",fileName);
                        }
                    }


                    if (flag) {
                        System.out.println("遍历结束还没有找到参会人员，鉴定为异常人员");
                        AbnormalInfo abnormalInfo = new AbnormalInfo();
                        abnormalInfo.setImgUrl("https://www.jglo.top:8091/FaceAbnormal/" + meetingId + "/" + fileName);
                        InputStream is = new FileInputStream(file);
                        sftp.upload("/usr/share/nginx/image/FaceAbnormal/", ""+meetingId, fileName, is);
                        sftp.delete("/usr/share/nginx/image/Face/",fileName);
                        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                        abnormalInfo.setTime(simpleDateFormat.format(new Date()));
                        abnormalInfo.setMeetingId(meetingId);
                        abnormalInfo.setMeetingName(meetingName);
                        abnormalInfo.setStatus(0);
                        abnormalInfo.setIsRead(0);
                        abnormalInfo.setUserId(userId);
                        System.out.println("存入数据库");
                        abnormalInfoDao.save(abnormalInfo);
                    }
                    else{
                        System.out.println("鉴定为参会人员");
                        sftp.delete("/usr/share/nginx/image/Face/",fileName);
                    }
                }
                sftp.logout();
            }
        }
    }

    @Scheduled(fixedRate = oneTime)
    public void pushAbnormal() {
        List<AbnormalInfo> abnormalInfos = abnormalRepository.findByStatus(0);
        PushMessage pushMessage;
        for (AbnormalInfo abnormalInfo : abnormalInfos) {
            pushMessage = new PushMessage();
            pushMessage.setTime(abnormalInfo.getTime());
            pushMessage.setMeetingId(abnormalInfo.getMeetingId());
            pushMessage.setMessage("您的会议有异常人员进入，请注意");
            pushMessage.setReceiveId(abnormalInfo.getUserId());
            pushMessage.setStatus(0);
            abnormalRepository.changeStatus(abnormalInfo.getId());
            pushMessageRepository.save(pushMessage);
        }
    }

//    @Autowired
//    private MeetingService meetingService;
//    @Autowired
//    private MeetroomRepository meetroomRepository;
//    @Scheduled(fixedRate = oneTime)
//    public void startMeeting() throws ParseException {
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
//        String nowTime=sdf.format(new Date());
//        meetingService.updateMeetingStatus(nowTime,1,3);
//    }
//    @Scheduled(fixedRate = oneTime)
//    public void startMeeting1() throws ParseException {
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
//        String nowTime=sdf.format(new Date());
//        meetingService.updateMeetingStatus(nowTime,2,6);
//    }
//    @Scheduled(fixedRate = oneTime)
//    public void startMeeting2() throws ParseException {
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
//        String nowTime=sdf.format(new Date());
//        meetingService.updateMeetingStatus(nowTime,8,7);
//    }
//    @Scheduled(fixedRate = oneTime)
//    public void overMeeting() throws ParseException {
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
//        String nowTime=sdf.format(new Date());
//        meetingService.updateMeetingOverStatus(nowTime,3,4);
//
//    }
//
//    @Scheduled(fixedRate = oneTime)
//    public void updateMeetRoomBegin() throws ParseException {
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
//        String nowTime=sdf.format(new Date());
//        List<Meetroom> meetroomList=meetroomRepository.findMeetRoomRun(nowTime);
//        for (Meetroom meetroom:meetroomList){
//            meetroomRepository.updateMeetRoomRun(meetroom.getId());
//        }
//    }
//    @Scheduled(fixedRate = oneTime)
//    public void updateMeetRoomOver() throws ParseException {
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
//        String nowTime=sdf.format(new Date());
//        List<Meetroom> meetrooms=meetroomRepository.findMeetRoomOver(nowTime);
//        for (Meetroom meetroom:meetrooms){
//            meetroomRepository.updateMeetRoomOver(meetroom.getId());
//        }
//    }
}
