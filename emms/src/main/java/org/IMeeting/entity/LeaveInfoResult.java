package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LeaveInfoResult {
    private Integer leaveInfoId;
    private String name;
    private String phoneNumber;
    private String note;
    private Integer status;
}
