package org.IMeeting.controller;

import org.IMeeting.entity.AbnormalInfo;
import org.IMeeting.entity.ServerResult;
import org.IMeeting.repository.AbnormalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/abnormal")
public class AbnormalController {
    @Autowired
    private AbnormalRepository abnormalRepository;

//    Retrieve abnormal info for the current user
    @RequestMapping("/selectByAbnormal")
    public ServerResult selectByAbnormal(HttpServletRequest request) {
        int userId = (int) request.getSession().getAttribute("userId");
        List<AbnormalInfo> abnormalInfos = abnormalRepository.selectByAbnormal(userId);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        serverResult.setData(abnormalInfos);
        return serverResult;
    }

    @RequestMapping("/changeIsRead")
    public ServerResult changeIsRead(int id) {
        int result = abnormalRepository.changeIsRead(id);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        if (result != 0) {
            serverResult.setCode(1);
        } else {
            serverResult.setCode(-1);
        }
        return serverResult;
    }
}
