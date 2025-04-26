package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserInfoResult {
    private Integer id;
    private String worknum;
    private String name;
    private String phone;
    private Integer departId;
    private Integer positionId;
    private Integer roleId;
    private String resume;
    private String roleName;
    private String departName;
    private String positionName;
}
