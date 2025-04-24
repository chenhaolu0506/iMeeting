package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JoinPersonInfo {
    private Integer recordId;
    private Integer userId;
    private String userName;
    private String phoneNumber;
    private String status;
    private String joinTime;
}
