package org.IMeeting.controller;

import org.IMeeting.entity.Group;
import org.IMeeting.entity.GroupList;
import org.IMeeting.entity.GroupRecord;
import org.IMeeting.repository.DepartmentRepository;
import org.IMeeting.repository.GroupRecordRepository;
import org.IMeeting.repository.GroupRepository;
import org.IMeeting.repository.UserInfoRepository;
import org.IMeeting.service.GroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.IMeeting.entity.ServerResult;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@CrossOrigin(
        origins = "http://localhost:3000",
        methods = {RequestMethod.GET, RequestMethod.POST},
        allowedHeaders = "*",
        allowCredentials = "true"
)
@RestController
@RequestMapping("/group")
@Transactional
public class GroupController {
    @Autowired
    private DepartmentRepository departmentRepository;
    @Autowired
    private UserInfoRepository userInfoRepository;
    @Autowired
    private GroupRecordRepository groupRecordRepository;
    @Autowired
    private GroupRepository groupRepository;
    @Autowired
    private GroupService groupService;

    //显示用户
    @RequestMapping("/showUser")
    public ServerResult showUserinfo(HttpServletRequest request) {
        return groupService.showUser(request);
    }

    //保存单条群组记录
    @RequestMapping("/saveGroup")
    public ServerResult insertGroupRecord(HttpServletRequest request, @RequestBody GroupList group) {
        ServerResult serverResult=new ServerResult();
        Integer userId= (Integer) request.getSession().getAttribute("userId");
        Group group1=new Group();
        group1.setName(group.getGroupName());
        group1.setUserId(userId);
        groupRepository.saveAndFlush(group1);
        List<Integer> ids=group.getUserIdList();
        for (Integer id : ids) {
            GroupRecord groupRecord = new GroupRecord();
            groupRecord.setGroupId(group1.getId());
            groupRecord.setUserId(id);
            groupRecordRepository.saveAndFlush(groupRecord);
        }
        serverResult.setStatus(true);
        return serverResult;
    }

    //删除单条群组记录
    @RequestMapping("/deleteGroup")
    public ServerResult deleteGroup(@RequestParam("id") Integer id) {
        return groupService.deleteByGroupId(id);
    }

    //显示该用户的所有群组
    @RequestMapping("/showGroup")
    public ServerResult showGroup(HttpServletRequest request){
        Integer userId=(Integer) request.getSession().getAttribute("userId");
        List<Group>groups=groupRepository.findByUserId(userId);
        ServerResult serverResult=new ServerResult();
        serverResult.setData(groups);
        serverResult.setStatus(true);
        return serverResult;
    }
    //显示单条详细群组记录
    @RequestMapping("/showOneGroup")
    public ServerResult showOneGroup(@RequestParam("id")Integer id){
        return groupService.showGroupById(id);
    }

    //更新单条群组记录
    @RequestMapping("/updateOneGroup")
    public ServerResult updateOneGroup(@RequestBody GroupList groupList){
        return groupService.updateOneGroup(groupList.getGroupId(), groupList.getUserIdList(), groupList.getGroupName());
    }
}
