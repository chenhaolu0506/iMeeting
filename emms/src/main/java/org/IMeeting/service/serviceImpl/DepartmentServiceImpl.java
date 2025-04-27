package org.IMeeting.service.serviceImpl;

import org.IMeeting.entity.*;
import org.IMeeting.repository.DepartmentRepository;
import org.IMeeting.repository.MeetingRoomDepartmentRepository;
import org.IMeeting.repository.PositionRepository;
import org.IMeeting.repository.UserInfoRepository;
import org.IMeeting.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Optional;

@Service
public class DepartmentServiceImpl implements DepartmentService {
    @Autowired
    private DepartmentRepository departmentRepository;
    @Autowired
    private UserInfoRepository userInfoRepository;
    @Autowired
    private PositionRepository positionRepository;
    @Autowired
    private MeetingRoomDepartmentRepository meetingRoomDepartmentRepository;

    @Override
    public ServerResult selectAll(HttpServletRequest request) {
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        List<Department> departments = departmentRepository.findByTenantId(tenantId);
        ServerResult serverResult = new ServerResult();
        serverResult.setData(departments);
        serverResult.setStatus(true);
        return serverResult;
    }

    @Override
    public ServerResult deleteByDepartmentId(Integer departmentId) {
        ServerResult serverResult = new ServerResult();
        List<UserInfo> userInfos = userInfoRepository.findByDepartId(departmentId);
        List<Position> positions = positionRepository.findByDepartId(departmentId);
        List<MeetingRoomDepartment> meetingRoomDepartments = meetingRoomDepartmentRepository.findByDepartId(departmentId);
        if (!userInfos.isEmpty()){
            serverResult.setMessage("该部门下有人员,无法删除");
            serverResult.setStatus(false);
        } else if (!positions.isEmpty()){
            serverResult.setMessage("该部门下有岗位,无法删除");
            serverResult.setStatus(false);
        } else if (!meetingRoomDepartments.isEmpty()){
            serverResult.setMessage("该部门下有绑定会议室,无法删除");
            serverResult.setStatus(false);
        } else {
            int delete = departmentRepository.deleteByDepartmentId(departmentId);
            if (delete != 0){
                serverResult.setMessage("删除部门成功");
                serverResult.setStatus(true);
            }
        }
        return serverResult;
    }

    @Override
    public Department findByDepartmentId(Integer departmentId) {
        Optional<Department> department = departmentRepository.findById(departmentId);
        return department.orElse(null);
    }
}
