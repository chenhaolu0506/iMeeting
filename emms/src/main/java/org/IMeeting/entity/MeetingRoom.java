package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "m_meetroom")
public class MeetingRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private String num;
    private String place;
    private Integer contain;
    private Integer availStatus;
    private Integer nowStatus;
    private Integer tenantId;
    private String wifiCode;
    private String QRCodeAddress;
}
