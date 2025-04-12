package org.example.controller;

import org.example.service.IdentityParams;
import org.example.service.UserException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.example.service.UserService;

import javax.annotation.Resource;

@RestController
public class UserController {
    @Resource
    private UserService userService;

    @PostMapping(path = "/user/signup")
    public String signup(@RequestParam("username") String username,
                         @RequestParam("password") String password,
                         @RequestParam("phone") String phone,
                         @RequestParam("email") String email) {
        String result = null;
        IdentityParams params = new IdentityParams();
        params.setName(username);
        params.setPassword(password);
        params.setPhone(phone);
        params.setEmail(email);

        int signUpResult = userService.signUp(params);
        switch (signUpResult) {
            case 0:
                result = "success";
                break;
            case -1:
                result = "input error";
                break;
            case -2:
                result = "user already exists";
                break;
            case -3:
                result = "invalid password";
                break;
            case -4:
                result = "invalid username";
                break;
            case -5:
                result = "invalid email";
                break;
            case -6:
                result = "invalid phone";
                break;
        }
        return result;
    }

    @PostMapping(path = "/user/login")
    public Resp login(@RequestParam("username") String username,
                      @RequestParam("password") String password) {
        String result = null;
        try {
            IdentityParams params = new IdentityParams();
            params.setName(username);
            params.setPassword(password);
            userService.login(params);
            result = "Success";
        } catch (UserException.UserNotFoundException e) {
            result = "User not found";
        } catch (UserException.InvalidPasswordException e) {
            result = "Invalid password";
        } catch (UserException.InvalidParametersException e) {
            result = "Invalid parameters";
        } catch (UserException e) {
            e.printStackTrace();
            result = "Fail";
        }
        return Resp.newInstance(0, result);
    }
}
