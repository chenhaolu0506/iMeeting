package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "m_equip_repair_info")
public class EquipRepairInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int meetingRoomId;
    private int userId;
    private int status;
    private String reportTime;
    private String repairTime;
    private String repairName;
    private int tenantId;
    private int equipId;
    private String damageInfo;
}
