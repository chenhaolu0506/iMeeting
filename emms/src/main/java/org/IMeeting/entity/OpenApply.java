package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "m_open_apply")
public class OpenApply {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String beginDate;
    private String overDate;
    @Column(name = "meet_room_id")
    private Integer meetRoomId;
    @Column(name = "user_id")
    private Integer userId;
    private String note;
    private String beginTime;
    private String overTime;
    private Integer status;
    private String createTime;
    private int tenantId;
}
