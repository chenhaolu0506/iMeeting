package org.IMeeting.controller;

import org.IMeeting.entity.AbnormalInfo;
import org.IMeeting.entity.ServerResult;
import org.IMeeting.repository.AbnormalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@CrossOrigin(
        origins = "http://localhost:3000",
        methods = {RequestMethod.GET, RequestMethod.POST},
        allowedHeaders = "*",
        allowCredentials = "true"
)
@RestController
@RequestMapping("/abnormal")
public class AbnormalController {
    @Autowired
    private AbnormalRepository abnormalRepository;

    //    Retrieve abnormal info for the current user
    @RequestMapping("/selectAbnormal")
    public ServerResult selectAbnormal(HttpServletRequest request) {
        int userId = (int) request.getSession().getAttribute("userId");
        List<AbnormalInfo> abnormalInfos = abnormalRepository.selectAbnormal(userId);
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
