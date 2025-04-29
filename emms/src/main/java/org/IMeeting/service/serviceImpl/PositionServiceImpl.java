package org.IMeeting.service.serviceImpl;

import org.IMeeting.entity.Department;
import org.IMeeting.entity.Position;
import org.IMeeting.entity.ServerResult;
import org.IMeeting.entity.UserInfo;
import org.IMeeting.repository.DepartmentRepository;
import org.IMeeting.repository.PositionRepository;
import org.IMeeting.repository.UserInfoRepository;
import org.IMeeting.service.PositionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

@Service
public class PositionServiceImpl implements PositionService {
    @Autowired
    private PositionRepository positionRepository;
    @Autowired
    private DepartmentRepository departmentRepository;
    @Autowired
    private UserInfoRepository userInfoRepository;

    @Override
    public ServerResult selectAll(HttpServletRequest request) {
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        List<Position> positions = positionRepository.findByTenantId(tenantId);
        List<Department> departments = departmentRepository.findByTenantId(tenantId);
        List<List> results = new ArrayList<>();
        results.add(positions);
        results.add(departments);
        ServerResult serverResult = new ServerResult();
        serverResult.setData(results);
        serverResult.setStatus(true);
        return serverResult;
    }

    @Override
    public ServerResult deletePosition(Integer positionId) {
        List<UserInfo> userInfos = userInfoRepository.findByPositionId(positionId);
        ServerResult serverResult = new ServerResult();
        if (!userInfos.isEmpty()){
            serverResult.setStatus(true);
            serverResult.setMessage("该岗位下有人员,无法删除");
        } else {
            positionRepository.deletePosition(positionId);
            serverResult.setStatus(true);
            serverResult.setMessage("删除岗位成功");
        }
        return serverResult;
    }
}
