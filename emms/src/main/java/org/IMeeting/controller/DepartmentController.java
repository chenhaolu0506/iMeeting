package org.IMeeting.controller;

import org.IMeeting.entity.Department;
import org.IMeeting.repository.DepartmentRepository;
import org.IMeeting.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.IMeeting.entity.ServerResult;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/department")
public class DepartmentController {
    @Autowired
    private DepartmentService departmentService;
    @Autowired
    private DepartmentRepository departmentRepository;

    //查询该租户所有的部门
    @RequestMapping("/selectAll")
    public ServerResult selectAll(HttpServletRequest request){
        return departmentService.selectAll(request);
    }
    //修改一个部门的名字
    @RequestMapping("/editOne")
    public ServerResult editOne(@RequestParam("departId") Integer departId, @RequestParam("departName")String departName){
        int bol = departmentRepository.updateName(departId, departName);
        ServerResult serverResult=new ServerResult();
        if (bol != 0){
            serverResult.setStatus(true);
        }
        return serverResult;
    }

    //删除一个部门,显示各种情况的相应内容Message
    @RequestMapping("/deleteOne")
    public ServerResult deleteOne(@RequestParam("departId") Integer departId){
        return departmentService.deleteByDepartmentId(departId);
    }

    //增加一个部门
    @RequestMapping("/insertOne")
    public ServerResult insertOne(@RequestParam("departName") String departName,HttpServletRequest request){
        Department department=new Department();
        department.setTenantId((Integer)request.getSession().getAttribute("tenantId"));
        department.setName(departName);
        departmentRepository.saveAndFlush(department);
        ServerResult serverResult=new ServerResult();
        serverResult.setStatus(true);
        return  serverResult;
    }
}
