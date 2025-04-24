package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EquipRepairInfoResult {
    private int id;
    private String meetingRoomName;
    private String userName;
    private String status;
    private String reportTime;
    private String repairTime;
    private String repairName;
    private String equipName;
    private String damageInfo;
}
