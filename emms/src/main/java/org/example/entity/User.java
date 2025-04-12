package org.example.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "proj_users")
public class User {
    @Id
    @GeneratedValue
    int id;

    @Column(name="name")
    String name;

    @Column
    String email;

    @Column
    String phone;

    @Column(name = "pwd")
    String password;

    @Column(name = "userStatus")
    String status;

    @Column
    String address;

    @Column
    int age;

    @Column
    String nationality;



}
