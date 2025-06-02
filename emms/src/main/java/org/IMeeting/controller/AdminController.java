package org.IMeeting.controller;

import org.IMeeting.entity.RoleMenu;
import org.IMeeting.entity.RoleMenuParam;
import org.IMeeting.entity.ServerResult;
import org.IMeeting.repository.RoleMenuRepository;
import org.IMeeting.service.ManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@CrossOrigin(
        origins = "http://localhost:3000",
        methods = {RequestMethod.GET, RequestMethod.POST},
        allowedHeaders = "*",
        allowCredentials = "true"
)
@RestController
@RequestMapping("/manager")
public class AdminController {
    @Autowired
    private RoleMenuRepository roleMenuRepository;
    @Autowired
    private ManagerService managerService;

    // 查询该租户所有的角色和菜单列表，需存储，菜单列表下面操作需要用到
    @RequestMapping("/selectAll")
    public ServerResult selectAll(HttpServletRequest request) {
        return managerService.selectAll(request);
    }

    // 查询一个角色拥有的权限
    @RequestMapping("/selectOneRole")
    public ServerResult selectOneRole(@RequestParam("roleId") Integer roleId) {
        List<RoleMenu> roleMenus = roleMenuRepository.findByRoleId(roleId);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        serverResult.setData(roleMenus);
        return serverResult;
    }

    // 删除一个角色
    @RequestMapping("/deleteOneRole")
    public ServerResult deleteOneRole(@RequestParam("roleId") Integer roleId) {
        return managerService.deleteByRoleId(roleId);
    }

    //增加一个角色 传入参数为角色名字和角色的权限菜单id集合
    @RequestMapping("/insertOneRole")
    public ServerResult insertOneRole(@RequestBody RoleMenuParam roleMenuParam, HttpServletRequest request) {
        return managerService.insertRole(roleMenuParam, request);
    }

    //更新一个角色 传入参数角色id、角色名字和角色的权限菜单id集合
    @RequestMapping("/updateOneRole")
    public ServerResult updateOneRole(@RequestBody RoleMenuParam roleMenuParam, HttpServletRequest request) {
        return managerService.updateRole(roleMenuParam);
    }

    //点击用户界面跳转到管理员界面时显示该管理员所具有的权限即可操作的菜单
    @RequestMapping("/toManager")
    public ServerResult toManager(HttpServletRequest request) {
        Integer userId = (Integer) request.getSession().getAttribute("userId");
        if (userId == null) {
            return ServerResult.failWithMessage("User not logged in.");
        }
        return managerService.toManager(userId);
    }
}
