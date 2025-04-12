package org.example.service;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;

@Getter
@Setter
public class IdentityParams {
    String name;

    String email;

    String phone;

    String password;

    String status;

    String address;

    int age;

    String nationality;

}
