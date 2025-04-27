package org.IMeeting.service.serviceImpl;

import org.IMeeting.entity.*;
import org.IMeeting.repository.JoinPersonRepository;
import org.IMeeting.repository.PushMessageRepository;
import org.IMeeting.service.JoinPersonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.IMeeting.service.UserInfoService;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;


@Service
public class JoinPersonServiceImpl implements JoinPersonService {
    @Autowired
    private JoinPersonRepository joinPersonRepository;
    @Autowired
    private UserInfoService userInfoService;
    @Autowired
    private PushMessageRepository pushMessageRepository;

    @Override
    public ServerResult showMeeting(Integer meetingId) {
        List<JoinPerson> joinPersonList = joinPersonRepository.findByMeetingIdOrderByStatus(meetingId);
        List<JoinPersonInfo> joinPersonInfos = new ArrayList<>();
        for (JoinPerson joinPerson : joinPersonList) {
            JoinPersonInfo joinPersonInfo = new JoinPersonInfo();
            joinPersonInfo.setRecordId(joinPerson.getId());
            joinPersonInfo.setJoinTime(joinPerson.getJoinTime());
            String status = null;
            switch (joinPerson.getStatus()) {
                case 0:
                    status = "未签到";
                    break;
                case 1:
                    status = "已签到";
                    break;
                case 2:
                    status = "请假中";
                    break;
                case 3:
                    status = "请假已批准";
                    break;
                case 4:
                    status = "请假未通过";
                    break;
            }
            joinPersonInfo.setStatus(status);
            if (joinPerson.getUserId() != null) {
                Integer userId = joinPerson.getUserId();
                joinPersonInfo.setUserId(userId);
                UserInfo userInfo = userInfoService.getUserInfo(userId);
                if (userInfo != null) {
                    joinPersonInfo.setUserName(userInfo.getName());
                    joinPersonInfo.setPhoneNumber(userInfo.getPhone());
                }
            }
            joinPersonInfos.add(joinPersonInfo);
        }
        ServerResult serverResult = new ServerResult();
        serverResult.setData(joinPersonInfos);
        serverResult.setStatus(true);
        return serverResult;
    }

    @Override
    public ServerResult remind(Integer meetingId, Integer userId) {
        PushMessage pushMessage = new PushMessage();
        pushMessage.setMeetingId(meetingId);
        pushMessage.setStatus(0);
        pushMessage.setReceiveId(userId);
        pushMessage.setMessage("您有一场未签到的会议，请及时签到");
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String time = sdf.format(new java.util.Date());
        pushMessage.setTime(time);
        pushMessageRepository.saveAndFlush(pushMessage);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }
}
