package org.IMeeting.service;

import org.IMeeting.entity.RoleMenuParam;
import org.IMeeting.entity.ServerResult;

import javax.servlet.http.HttpServletRequest;

public interface ManagerService {
    ServerResult selectAll(HttpServletRequest request);
    ServerResult deleteByRoleId(Integer roleId);
    ServerResult insertRole(RoleMenuParam roleMenuPara, HttpServletRequest request);
    ServerResult updateRole(RoleMenuParam roleMenuPara);
    ServerResult toManager(Integer userId);
}
