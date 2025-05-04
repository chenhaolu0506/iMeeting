package org.IMeeting.controller;

import com.aliyuncs.dysmsapi.model.v20170525.SendSmsResponse;
import com.aliyuncs.exceptions.ClientException;
import org.IMeeting.entity.Department;
import org.IMeeting.entity.Position;
import org.IMeeting.entity.ServerResult;
import org.IMeeting.entity.UserInfo;
import org.IMeeting.repository.TenantRepository;
import org.IMeeting.repository.UserInfoRepository;
import org.IMeeting.service.UserInfoService;
import org.IMeeting.util.FileUtil;
import org.IMeeting.util.Message;
import org.IMeeting.util.Random;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.IMeeting.config.Constant.DEFAULT_PASSWORD;

@RestController
public class IdentityController {
    @Autowired
    private UserInfoService userInfoService;
    @Autowired
    private UserInfoRepository userInfoRepository;
    @Autowired
    private TenantRepository tenantRepository;

    //登陆
    @PostMapping("/login")
    public ServerResult login(@RequestParam("username") String username, @RequestParam("password") String password, HttpServletRequest request) {
        ServerResult serverResult = new ServerResult();
        UserInfo u = userInfoService.login(username, password);
        if (u != null) {
            serverResult.setData(u);
            serverResult.setStatus(true);
            HttpSession session = request.getSession();
            session.setAttribute("userId", u.getId());
            session.setAttribute("name", u.getName());
            session.setAttribute("tenantId", u.getTenantId());
            session.setAttribute("departId", u.getDepartId());
            session.setAttribute("positionId", u.getPositionId());
            session.setAttribute("roleId", u.getRoleId());
            Integer roleId = u.getRoleId();
            String msg = roleId == null ? "no" : "yes";
            serverResult.setMessage(msg);
        } else {
            serverResult.setMessage("账号或密码错误");
        }
        return serverResult;
    }

    //找回密码获取验证码
    @RequestMapping("/pwdCode")
    public ServerResult pwdCode(@RequestParam("phone") String phone) throws ClientException {
        ServerResult serverResult = new ServerResult();
        UserInfo u = userInfoRepository.findByPhone(phone);
        if (u == null) {
            serverResult.setMessage("手机号码不正确");
        } else {
            Random random = new Random();
            String randomNum = random.GetRandom();
            SendSmsResponse response = Message.sendSms(phone, randomNum);
            System.out.println("短信接口返回的数据----------------");
            System.out.println("Code=" + response.getCode());
            System.out.println("Message=" + response.getMessage());
            System.out.println("RequestId=" + response.getRequestId());
            System.out.println("BizId=" + response.getBizId());
            serverResult.setData(randomNum);
            serverResult.setStatus(true);
        }
        return serverResult;
    }

    //找回密码修改密码
    @RequestMapping("/forgetPwd")
    public ServerResult forgetPwd(@RequestParam("phone") String phone, @RequestParam("password") String password) {
        ServerResult serverResult = new ServerResult();
        // Hash a password
        String hashed = BCrypt.hashpw(password, BCrypt.gensalt());
        int u = userInfoRepository.updatePasswordByPhone(hashed, phone);
        if (u != 0) {
            serverResult.setStatus(true);
        }
        return serverResult;
    }

    //通过手机号获取短信验证码
    @RequestMapping("/getCode")
    public ServerResult getCode(@RequestParam("phone") String phone) throws ClientException {
        ServerResult serverResult = new ServerResult();
        UserInfo userInfo = userInfoRepository.findByPhone(phone);
        if (userInfo != null) {
            serverResult.setStatus(false);
            serverResult.setMessage("该手机号已经绑定过账号，请更换手机号");
        } else {
            Random random = new Random();
            String randomNum = random.GetRandom();
            SendSmsResponse response = Message.sendSms(phone, randomNum);
            System.out.println("短信接口返回的数据----------------");
            System.out.println("Code=" + response.getCode());
            System.out.println("Message=" + response.getMessage());
            System.out.println("RequestId=" + response.getRequestId());
            System.out.println("BizId=" + response.getBizId());
            serverResult.setData(randomNum);
            serverResult.setStatus(true);
        }
        return serverResult;
    }

    //短信验证绑定手机号
    @RequestMapping("/recordPhone")
    public ServerResult recordPhone(@RequestParam("phone") String phone, HttpServletRequest request) {
        ServerResult serverResult = new ServerResult();
        Integer id = (Integer) request.getSession().getAttribute("userId");
        int bol = userInfoRepository.updatePhoneById(phone, id);
        if (bol != 0)
            serverResult.setStatus(true);
        return serverResult;
    }

    //修改密码
    @RequestMapping("/changePwd")
    public ServerResult changePwd(HttpServletRequest request, @RequestParam("oldPassword") String oldPassword, @RequestParam("newPassword") String newPassword) {
        ServerResult serverResult = new ServerResult();
        HttpSession session = request.getSession();
        Integer id = (Integer) session.getAttribute("userId");
        Optional<UserInfo> userInfoOptional = userInfoRepository.findById(id);
        if (userInfoOptional.isPresent()) {
            String hashed = userInfoOptional.get().getPassword();
            if (BCrypt.checkpw(oldPassword, hashed)) {
                String newHashedPwd = BCrypt.hashpw(newPassword, BCrypt.gensalt());
                int cnt = userInfoRepository.updatePasswordById(newHashedPwd, id);
                if (cnt == 1) {
                    serverResult.setMessage("密码修改成功");
                    serverResult.setStatus(true);
                } else {
                    serverResult.setMessage("密码修改失败");
                }
            } else {
                serverResult.setMessage("旧密码不正确");
            }

        } else {
            serverResult.setMessage("用户不存在");
        }
        return serverResult;
    }

    //查询显示个人信息
    @RequestMapping("/showUserinfo")
    public ServerResult showUserinfo(HttpServletRequest request) {
        Integer departId = (Integer) request.getSession().getAttribute("departId");
        Integer positionId = (Integer) request.getSession().getAttribute("positionId");
        Integer userId = (Integer) request.getSession().getAttribute("userId");
        // validate params in request
        if (departId == null || userId == null || positionId == null) {
            return ServerResult.failWithMessage("Invalid request parameters");
        }

        Department department = userInfoService.getDepartment(departId);
        String departmentName = department.getName();
        Position position = userInfoService.getPosition(positionId);
        String positionName = position.getName();
        UserInfo u = userInfoService.getUserInfo(userId);
        return getServerResult(u, departmentName, positionName);
    }

    private static ServerResult getServerResult(UserInfo u, String departmentName, String positionName) {
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("name", u.getName());
        userInfo.put("worknum", u.getWorknum());
        userInfo.put("phone", u.getPhone());
        userInfo.put("resume", u.getResume());
        userInfo.put("roleId", u.getRoleId());
        userInfo.put("departName", departmentName);
        userInfo.put("positionName", positionName);
        ServerResult serverResult = new ServerResult();
        serverResult.setData(userInfo);
        serverResult.setStatus(true);
        return serverResult;
    }

    //判断是否已经登陆
    @RequestMapping("/hadLog")
    public ServerResult alreadyLoggedIn(HttpServletRequest request) {
        ServerResult serverResult = new ServerResult();
        Integer userId = (Integer) request.getSession().getAttribute("userId");
        serverResult.setStatus(userId != null);
        return serverResult;
    }

    //更新个人简介
    @RequestMapping("/updateResume")
    public ServerResult updateResume(@RequestParam("resume") String resume, HttpServletRequest request) {
        Integer userId = (Integer) request.getSession().getAttribute("userId");
        int u = userInfoRepository.updateResumeById(resume, userId);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(u != 0);
        return serverResult;
    }

    //退出
    @RequestMapping("/logout")
    public ServerResult logout(HttpServletRequest request) {
        request.getSession().invalidate();
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    //显示所有员工信息(显示项序号1、2、3、4非用户真实id，worknum工号，name名字，phone电话，departId对应的部门名字，positionId对应的职位名字，roleId对应的角色名字)
    @RequestMapping("/userInfo/selectAllPeople")
    public ServerResult selectAllPeople(HttpServletRequest request) {
        return userInfoService.selectAllPeople(request);
    }

    //删除一个员工
    @RequestMapping("/userInfo/deleteOne")
    public ServerResult deleteOne(@RequestParam("userId") Integer userId) {
        ServerResult serverResult = new ServerResult();
        int bol = userInfoRepository.deleteUserInfoById(userId);
        serverResult.setStatus(bol != 0);
        return serverResult;
    }

    //显示一个员工详细信息,需要传递的参数为id
    @RequestMapping("/userInfo/showOne")
    public ServerResult showOne(@RequestParam("id") Integer id) {
        return userInfoService.showUserInfo(id);
    }

    //修改一个员工信息,需要传递的参数为id,worknum,name,phone,departId,positionId,roleId
    @RequestMapping("/userInfo/updateOne")
    public ServerResult deleteOne(@RequestBody UserInfo userInfo) {
        return userInfoService.updateUser(userInfo);
    }

    //增加一个员工,需要传递的参数为worknum(必填),name(必填),phone,departId,positionId,roleId
    @RequestMapping("/userInfo/insertOne")
    public ServerResult insertOne(@RequestBody UserInfo userInfo, HttpServletRequest request) {
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        if (tenantId == null) {
            return new ServerResult();
        }
        return userInfoService.insertUser(userInfo, tenantId);
    }

    //下载人员导入范例excel表格
    @RequestMapping("/userInfo/downloadInsertDemo")
    public void downloadInsertDemo(HttpServletResponse res) {
        FileUtil f = new FileUtil();
        f.downLoad("insertDemo.xls", res);
    }

    //多个员工导入,worknum(必填),name(必填),phone
    @RequestMapping("/userInfo/insertBatch")
    public ServerResult insertBatch(@RequestParam("file") MultipartFile file, HttpServletRequest request) {
        String fileName = file.getOriginalFilename();
        ServerResult serverResult = null;
        try {
            serverResult = userInfoService.batchImport(fileName, file, request);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return serverResult;
    }

    //重置密码,参数为用户id
    @RequestMapping("/userInfo/resetPwd")
    public ServerResult resetPwd(@RequestParam("userId") Integer userId) {
        String hashedPassword = BCrypt.hashpw(DEFAULT_PASSWORD, BCrypt.gensalt());
        int bol = userInfoRepository.updatePasswordById(hashedPassword, userId);
        ServerResult serverResult = new ServerResult();
        if (bol != 0) {
            serverResult.setStatus(true);
            serverResult.setMessage("密码重置成功");
        }
        return serverResult;
    }
}
