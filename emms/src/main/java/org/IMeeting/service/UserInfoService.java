package org.IMeeting.service;

import org.IMeeting.entity.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;

public interface UserInfoService {
    UserInfo login(String username, String password);
    UserInfo getUserInfo(Integer id);
    Department getDepartment(Integer id);
    Position getPosition(Integer id);

    ServerResult selectAllPeople(HttpServletRequest request);
    ServerResult updateUser(UserInfo userInfo);
    ServerResult insertUser(UserInfo userInfo,Integer tenantId);
    ServerResult batchImport(String fileName, MultipartFile file, HttpServletRequest request) throws Exception;
    ServerResult showUserInfo(Integer id);
    RoleInfo getRoleInfo(Integer roleId);
}
