package org.IMeeting.service.serviceImpl;

import org.IMeeting.entity.FaceInfo;
import org.IMeeting.entity.FaceResult;
import org.IMeeting.entity.ServerResult;
import org.IMeeting.repository.FaceInfoRepository;
import org.IMeeting.service.FaceService;
import org.IMeeting.service.UserInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

@Service
public class FaceServiceImpl implements FaceService {
    @Autowired
    private FaceInfoRepository faceInfoRepository;
    @Autowired
    private UserInfoService userInfoService;

    @Override
    public ServerResult selectAll(HttpServletRequest request) {
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        List<FaceInfo> faceInfos = faceInfoRepository.findByTenantIdOrderByStatus(tenantId);
        List<FaceResult> faceResults = new ArrayList<>();
        for (FaceInfo faceInfo : faceInfos) {
            FaceResult faceResult = new FaceResult();
            faceResult.setId(faceInfo.getId());
            faceResult.setFaceAddress(faceInfo.getFaceAddress());
            String status = "";
            switch (faceInfo.getStatus()){
                case 0:
                    status = "未审核";
                    break;
                case 1:
                    status = "已通过";
                    break;
                case 2:
                    status = "未通过";
                    break;
            }
            faceResult.setStatus(status);
            faceResult.setName(userInfoService.getUserInfo(faceInfo.getUserId()).getName());
            faceResults.add(faceResult);
        }
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        serverResult.setData(faceResults);
        return serverResult;
    }
}
