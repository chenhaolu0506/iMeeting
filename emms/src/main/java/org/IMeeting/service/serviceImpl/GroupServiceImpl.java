package org.IMeeting.service.serviceImpl;

import org.IMeeting.entity.*;
import org.IMeeting.repository.DepartmentRepository;
import org.IMeeting.repository.GroupRecordRepository;
import org.IMeeting.repository.GroupRepository;
import org.IMeeting.repository.UserInfoRepository;
import org.IMeeting.service.GroupService;
import org.IMeeting.service.UserInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class GroupServiceImpl implements GroupService {
    @Autowired
    private GroupRepository groupRepository;
    @Autowired
    private GroupRecordRepository groupRecordRepository;
    @Autowired
    private UserInfoRepository userInfoRepository;
    @Autowired
    private UserInfoService userInfoService;
    @Autowired
    private DepartmentRepository departmentRepository;

    @Override
    public ServerResult deleteByGroupId(Integer groupId) {
        ServerResult serverResult = new ServerResult();
        groupRecordRepository.deleteGroupRecordByGroupId(groupId);
        groupRepository.deleteByGroupId(groupId);
        serverResult.setStatus(true);
        return serverResult;
    }

    @Override
    public Group selectGroupById(Integer groupId) {
        Optional<Group> group = groupRepository.findById(groupId);
        return group.orElse(null);
    }

    @Override
    public ServerResult showGroupById(Integer groupId) {
        ServerResult serverResult = new ServerResult();
        Group group = selectGroupById(groupId);
        List<GroupRecord> groupRecords = groupRecordRepository.findByGroupId(groupId);
        HashMap<Integer, String> u = new HashMap<>();
        String name = null;
        int departmentId = 1;
        for (GroupRecord groupRecord : groupRecords) {
            Integer userId = groupRecord.getUserId();
            UserInfo userInfo = userInfoService.getUserInfo(userId);
            if (userInfo != null) {
                name = userInfo.getName();
                departmentId = userInfo.getDepartId();
                groupRecord.setGroupId(departmentId);
            }
            u.put(userId, name);
        }
        List<Object> list = new ArrayList<>();
        list.add(group);
        list.add(groupRecords);
        list.add(u);
        serverResult.setData(list);
        serverResult.setStatus(true);
        return serverResult;
    }

    @Override
    public ServerResult updateOneGroup(Integer groupId, List<Integer> userIds, String name) {
        int update = groupRepository.updateGroupName(groupId, name);
        groupRecordRepository.deleteGroupRecordByGroupId(groupId);
        for (Integer userId : userIds) {
            GroupRecord groupRecord = new GroupRecord();
            groupRecord.setUserId(userId);
            groupRecord.setGroupId(groupId);
            GroupRecord save = groupRecordRepository.saveAndFlush(groupRecord);
        }
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    //获取该用户所属的所有群组
    @Override
    public ServerResult getGroupList(Integer userId) {
        List<Group> groupList = groupRepository.findByUserId(userId);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        serverResult.setData(groupList);
        return serverResult;
    }

    @Override
    public ServerResult showUser(HttpServletRequest request) {
        ServerResult serverResult = new ServerResult();
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        List<Department> departments = departmentRepository.findByTenantId(tenantId);
        List<Object> results = new ArrayList<>();
        List<Object> resultUsers = new ArrayList<>();
        for (Department department : departments) {
            Integer departmentId = department.getId();
            List<UserInfo> userInfos = userInfoRepository.findByDepartId(departmentId);
            resultUsers.add(userInfos);
        }
        results.add(departments);
        results.add(resultUsers);
        serverResult.setData(results);
        serverResult.setStatus(true);
        return serverResult;
    }
}
