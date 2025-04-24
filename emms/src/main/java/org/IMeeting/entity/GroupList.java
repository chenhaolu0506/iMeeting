package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class GroupList {
    private Integer groupId;
    private String groupName;
    private List<Integer> userIdList;
}
