package org.IMeeting.service.serviceImpl;

import org.IMeeting.entity.*;
import org.IMeeting.repository.DepartmentRepository;
import org.IMeeting.repository.PositionRepository;
import org.IMeeting.repository.RoleInfoRepository;
import org.IMeeting.repository.UserInfoRepository;
import org.IMeeting.service.TenantService;
import org.IMeeting.service.UserInfoService;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.apache.poi.poifs.crypt.Decryptor.DEFAULT_PASSWORD;

@Service
public class UserInfoServiceImpl implements UserInfoService {
    @Autowired
    private UserInfoRepository userInfoRepository;
    @Autowired
    private DepartmentRepository departmentRepository;
    @Autowired
    private PositionRepository positionRepository;
    @Autowired
    private RoleInfoRepository roleInfoRepository;
    @Autowired
    private TenantService tenantService;


    @Override
    public UserInfo login(String username, String password) {
        UserInfo userInfo = userInfoRepository.findByUsername(username);
        if (userInfo != null && BCrypt.checkpw(password, userInfo.getPassword())) {
            return userInfo;
        }
        return null;
    }

    @Override
    public UserInfo getUserInfo(Integer id) {
        Optional<UserInfo> userInfo = userInfoRepository.findById(id);
        return userInfo.orElse(null);
    }

    @Override
    public Department getDepartment(Integer id) {
        Optional<Department> department = departmentRepository.findById(id);
        return department.orElse(null);
    }

    @Override
    public Position getPosition(Integer id) {
        Optional<Position> position = positionRepository.findById(id);
        return position.orElse(null);
    }

    @Override
    public ServerResult selectAllPeople(HttpServletRequest request) {
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        List<List> results = new ArrayList<>();
        List<Department> departments = departmentRepository.findByTenantId(tenantId); //获取所有部门
        List<Position> positions = positionRepository.findByTenantId(tenantId); //获取所有职位
        List<RoleInfo> roleInfos = roleInfoRepository.findByTenantId(tenantId); //获取所有角色
        results.add(departments);
        results.add(positions);
        results.add(roleInfos);
        List<UserInfo> userInfoList = userInfoRepository.findByTenantIdAndStatus(tenantId, 1); //获取所有用户
        results.add(userInfoList);
        ServerResult serverResult = new ServerResult();
        serverResult.setData(results);
        serverResult.setStatus(true);
        return serverResult;
    }

    @Override
    public ServerResult updateUser(UserInfo userInfo) {
        Integer userId = userInfo.getId();
        UserInfo userInServer = getUserInfo(userId);
        if (!userInServer.getWorknum().equals(userInfo.getWorknum())) {
            Optional<Tenant> tenantOptional = tenantService.findById(userInServer.getTenantId());
            if (!tenantOptional.isPresent()) {
                return ServerResult.failWithMessage("租户不存在");
            }
            userInfo.setUsername(tenantOptional.get().getNum() + "-" + userInfo.getWorknum());
            userInfoRepository.updateUsernameById(userId, tenantOptional.get().getNum() + "-" + userInfo.getWorknum());
        }
        Integer departmentId = userInfo.getDepartId();
        Integer positionId = userInfo.getPositionId();
        Integer roleId = userInfo.getRoleId();
        userInfoRepository.updateUserInfoById(userId, userInfo.getWorknum(), userInfo.getName(), userInfo.getPhone(), departmentId, positionId, roleId);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    @Override
    public ServerResult insertUser(UserInfo userInfo, Integer tenantId) {
        Optional<Tenant> tenantOptional = tenantService.findById(tenantId); //获取租户
        if (!tenantOptional.isPresent()) {
            return ServerResult.failWithMessage("租户不存在");
        }
        userInfo.setUsername(tenantOptional.get().getNum() + "-" + userInfo.getWorknum());
        userInfo.setTenantId(tenantId);
        String hashedPassword = BCrypt.hashpw(userInfo.getPassword(), BCrypt.gensalt());
        userInfo.setPassword(hashedPassword);
        userInfo.setStatus(1);
        if (userInfo.getDepartId() == null) {
            userInfo.setDepartId(0);
        }
        userInfoRepository.saveAndFlush(userInfo);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    @Override
    public ServerResult batchImport(String fileName, MultipartFile file, HttpServletRequest request) throws Exception {
        List<UserInfo> userInfoList = new ArrayList<>();
        ServerResult serverResult = new ServerResult();
        if (!fileName.matches("^.+\\.(?i)(xls)$") && !fileName.matches("^.+\\.(?i)(xlsx)$")) {
            serverResult.setMessage("文件格式不正确,必须为xls或者xlsx格式");
            serverResult.setStatus(true);
        }
        boolean isExcel2003 = !fileName.matches("^.+\\.(?i)(xlsx)$");
        InputStream is = file.getInputStream();
        Workbook wb = isExcel2003 ? new HSSFWorkbook(is) : new XSSFWorkbook(is);
        Sheet sheet = wb.getSheetAt(0);
        boolean flag = false;
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        Optional<Tenant> tenantOptional = tenantService.findById(tenantId);
        if (!tenantOptional.isPresent()) {
            return ServerResult.failWithMessage("租户" + tenantId + "不存在");
        }
        String tenantNum = tenantOptional.get().getNum();
        String hashedPassword = BCrypt.hashpw(DEFAULT_PASSWORD, BCrypt.gensalt());
        for (int i = 1; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i);
            if (row == null) {
                continue;
            }
            UserInfo userInfo = new UserInfo();
            row.getCell(0).setCellType(Cell.CELL_TYPE_STRING);
            String worknum = row.getCell(0).getStringCellValue();
            if (worknum == null || worknum.isEmpty()) {
                serverResult.setMessage("导入失败(第" + (i + 1) + "行,工号未填写)");
                serverResult.setStatus(true);
                flag = true;
                break;
            }
            if (row.getCell(1).getCellType() != 1) {
                serverResult.setMessage("导入失败(第" + (i + 1) + "行,姓名请设为文本格式)");
                serverResult.setStatus(true);
                flag = true;
                break;
            }
            String name = row.getCell(1).getStringCellValue();
            if (name == null || name.isEmpty()) {
                serverResult.setMessage("导入失败(第" + (i + 1) + "行,姓名未填写)");
                serverResult.setStatus(true);
                flag = true;
                break;
            }
            row.getCell(2).setCellType(Cell.CELL_TYPE_STRING);
            String phone = row.getCell(2).getStringCellValue();
            UserInfo userInfo1 = userInfoRepository.findByWorknumAndTenantId(worknum, tenantId);
            if (userInfo1 != null) {
                serverResult.setMessage("导入失败(第" + (i + 1) + "行工号为" + worknum + "的员工已存在)");
                serverResult.setStatus(true);
                flag = true;
                break;
            }
            userInfo.setName(name);
            userInfo.setWorknum(worknum);
            userInfo.setPhone(phone);
            userInfo.setUsername(tenantNum + "-" + worknum);
            userInfo.setPassword(hashedPassword);
            userInfo.setStatus(1);
            userInfo.setTenantId(tenantId);
            userInfo.setDepartId(0);
            userInfoList.add(userInfo);
        }
        if (!flag) {
            for (UserInfo userInfo : userInfoList) {
                userInfoRepository.saveAndFlush(userInfo);
            }
            serverResult.setStatus(true);
            serverResult.setMessage("批量导入成功");
        }
        return serverResult;
    }

    @Override
    public ServerResult showUserInfo(Integer id) {
        UserInfo userInfo = getUserInfo(id);
        UserInfoResult userInfoResult = new UserInfoResult();
        userInfoResult.setId(userInfo.getId());
        userInfoResult.setWorknum(userInfo.getWorknum());
        userInfoResult.setName(userInfo.getName());
        userInfoResult.setPhone(userInfo.getPhone());
        userInfoResult.setResume(userInfo.getResume());
        userInfoResult.setDepartId(userInfo.getDepartId());
        userInfoResult.setPositionId(userInfo.getPositionId());
        userInfoResult.setRoleId(userInfo.getRoleId());
        if (userInfo.getDepartId() != null) {
            Department department = getDepartment(userInfo.getDepartId());
            userInfoResult.setDepartName(department.getName());
        }
        if (userInfo.getPositionId() != null) {
            Position position = getPosition(userInfo.getPositionId());
            userInfoResult.setPositionName(position.getName());
        }
        if (userInfo.getRoleId() != null) {
            RoleInfo roleInfo = getRoleInfo(userInfo.getRoleId());
            userInfoResult.setRoleName(roleInfo.getName());
        }
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        serverResult.setData(userInfoResult);
        return serverResult;
    }

    @Override
    public RoleInfo getRoleInfo(Integer roleId) {
        Optional<RoleInfo> roleInfo = roleInfoRepository.findById(roleId);
        return roleInfo.orElse(null);
    }
}
