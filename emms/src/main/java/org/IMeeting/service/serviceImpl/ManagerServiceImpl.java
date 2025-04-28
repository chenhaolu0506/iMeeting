package org.IMeeting.service.serviceImpl;

import org.IMeeting.entity.*;
import org.IMeeting.repository.MenuInfoRepository;
import org.IMeeting.repository.RoleInfoRepository;
import org.IMeeting.repository.RoleMenuRepository;
import org.IMeeting.repository.UserInfoRepository;
import org.IMeeting.service.ManagerService;
import org.IMeeting.service.UserInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ManagerServiceImpl implements ManagerService {
    @Autowired
    private RoleInfoRepository roleInfoRepository;
    @Autowired
    private MenuInfoRepository menuInfoRepository;
    @Autowired
    private UserInfoRepository userInfoRepository;
    @Autowired
    private RoleMenuRepository roleMenuRepository;
    @Autowired
    private UserInfoService userInfoService;

    @Override
    public ServerResult selectAll(HttpServletRequest request) {
        List<List> results = new ArrayList<>();
        List<MenuInfo> menuInfos = menuInfoRepository.findAll();
        results.add(menuInfos);
        Integer tenandId = (Integer) request.getSession().getAttribute("tenantId");
        List<RoleInfo> roleInfos = roleInfoRepository.findByTenantId(tenandId);
        results.add(roleInfos);
        ServerResult serverResult = new ServerResult();
        serverResult.setData(results);
        serverResult.setStatus(true);
        return serverResult;
    }

    @Override
    public ServerResult deleteByRoleId(Integer roleId) {
        List<UserInfo> userInfos = userInfoRepository.findByRoleId(roleId);
        ServerResult serverResult = new ServerResult();
        if (!userInfos.isEmpty()){
            serverResult.setStatus(true);
            serverResult.setMessage("该角色下有人员,无法删除");
        } else {
            roleMenuRepository.deleteByRoleId(roleId);
            roleInfoRepository.deleteRoleInfo(roleId);
            serverResult.setStatus(true);
            serverResult.setMessage("删除角色成功");
        }
        return serverResult;
    }

    @Override
    public ServerResult insertRole(RoleMenuParam roleMenuPara, HttpServletRequest request) {
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        RoleInfo roleInfo = new RoleInfo();
        roleInfo.setName(roleMenuPara.getRoleName());
        roleInfo.setTenantId(tenantId);
        RoleInfo roleInfoSave = roleInfoRepository.saveAndFlush(roleInfo);
        List<Integer> menuIds = roleMenuPara.getMenuIds();
        Integer roleId = roleInfoSave.getId();
        if (!menuIds.isEmpty()){
            for (Integer menuId : menuIds) {
                RoleMenu roleMenu = new RoleMenu();
                roleMenu.setMenuId(menuId);
                roleMenu.setRoleId(roleId);
                roleMenuRepository.saveAndFlush(roleMenu);
            }
        }
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    @Override
    public ServerResult updateRole(RoleMenuParam roleMenuPara) {
        Integer roleId=roleMenuPara.getRoleId();
        String roleName=roleMenuPara.getRoleName();
        roleInfoRepository.updateRoleInfo(roleId, roleName);
        List<Integer> menuIds = roleMenuPara.getMenuIds();
        roleMenuRepository.deleteByRoleId(roleId);
        if (!menuIds.isEmpty()){
            for (Integer menuId : menuIds) {
                RoleMenu roleMenu = new RoleMenu();
                roleMenu.setMenuId(menuId);
                roleMenu.setRoleId(roleId);
                roleMenuRepository.saveAndFlush(roleMenu);
            }
        }
        ServerResult serverResult=new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    @Override
    public ServerResult toManager(Integer userId) {
        UserInfo userInfo = userInfoService.getUserInfo(userId);
        Integer roleId = null;
        if (userInfo.getRoleId() != null) {
            roleId = userInfo.getRoleId();
        }
        List<RoleMenu> roleMenus = roleMenuRepository.findByRoleId(roleId);
        List<MenuInfo> menuInfos = new ArrayList<>();
        for (RoleMenu roleMenu : roleMenus) {
            MenuInfo menuInfo = findById(roleMenu.getMenuId());
            menuInfos.add(menuInfo);
        }
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        serverResult.setData(menuInfos);
        return serverResult;
    }

    @Override
    public MenuInfo findById(Integer menuId) {
        Optional<MenuInfo> menuInfo = menuInfoRepository.findById(menuId);
        return menuInfo.orElse(null);
    }
}
