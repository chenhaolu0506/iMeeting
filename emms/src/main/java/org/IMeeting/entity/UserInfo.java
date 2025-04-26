package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "u_user_info")
public class UserInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String worknum;
    private String name;
    private String phone;
    private String username;
    private String password;
    private Integer departId;
    private Integer positionId;
    private Integer roleId;
    private Integer tenantId;
    private Integer status;
    private String resume;
}
