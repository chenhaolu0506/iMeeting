package org.example.service;

import org.apache.commons.lang3.StringUtils;
import org.example.entity.User;
import org.example.repository.UserRepo;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

@Service
public class UserServiceImpl implements UserService {
    @Resource
    private UserRepo userRepo;

    @Override
    public int signUp(IdentityParams params) {
        String username = params.getName();
        String email = params.getEmail();
        String phone = params.getPhone();
        String password = params.getPassword();
        String status = params.getStatus();
        String address = params.getAddress();
        int age = params.getAge();
        String nationality = params.getNationality();

        // -6
        boolean isPhoneValid = StringUtils.isNumeric(phone);
        // -5
        boolean isEmailValid = StringUtils.contains(email, "@");
        // -3
        boolean isPasswordValid = password.length() > 5;
        // -4
        boolean isUsernameValid = StringUtils.isNotEmpty(username);

        if (!isPhoneValid){
            return -6;
        }

        if (!isEmailValid){
            return -5;
        }

        if (!isPasswordValid){
            return -3;
        }

        if (!isUsernameValid){
            return -4;
        }

        // check if user already exists
        boolean emailFound = userRepo.findUserByEmail(email) != null;
        boolean phoneFound = userRepo.findUserByPhone(phone) != null;
        boolean nameFound = userRepo.findUserByName(username) != null;

        if (emailFound || phoneFound || nameFound){
            return -2;
        }

        // Store user details in the database
        User newUser = new User();
        newUser.setName(username);
        newUser.setEmail(email);
        newUser.setPhone(phone);
        newUser.setPassword(password);
        newUser.setStatus(status);
        newUser.setAddress(address);
        newUser.setAge(age);
        newUser.setNationality(nationality);
        userRepo.save(newUser);

        return 0;
    }

    @Override

    public void login(IdentityParams params) throws UserException {
        String username = params.getName();
        String password = params.getPassword();
        String email = params.getEmail();
        String phone = params.getPhone();

        boolean invalidPassword = StringUtils.isBlank(password);
        boolean invalidID = StringUtils.isAllBlank(email, phone, username);

        if (invalidPassword || invalidID){
            throw new UserException.InvalidParametersException("Invalid parameters");
        }

        User userByEmail = userRepo.findUserByEmail(email);
        User userByPhone = userRepo.findUserByPhone(phone);
        User userByName = userRepo.findUserByName(username);

        if (userByEmail == null && userByPhone == null && userByName == null){
            throw new UserException.UserNotFoundException("User not found");
        }

        if (userByEmail != null && !password.equals(userByEmail.getPassword())){
            throw new UserException.InvalidPasswordException("Invalid password");
        }

        if (userByPhone != null && !password.equals(userByPhone.getPassword())){
            throw new UserException.InvalidPasswordException("Invalid password");
        }

        if (userByName != null && !password.equals(userByName.getPassword())){
            throw new UserException.InvalidPasswordException("Invalid password");
        }
    }
}
