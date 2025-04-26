package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RoleMenuParam {
    private Integer roleId;
    private String roleName;
    private List<Integer> menuIds;
}
