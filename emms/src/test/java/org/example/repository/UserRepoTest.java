package org.example.repository;

import org.example.entity.User;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import javax.annotation.Resource;

import static org.junit.jupiter.api.Assertions.assertNull;

@SpringBootTest
public class UserRepoTest {

    @Resource
    private UserRepo userRepo;

    @Test
    public void testUserRepo() {
        User user = userRepo.findUserByEmail("wrongemail@test.com");
        assertNull(user);
    }
}
