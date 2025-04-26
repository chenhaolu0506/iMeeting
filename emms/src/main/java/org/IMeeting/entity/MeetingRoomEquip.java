package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "m_meetroom_equip")
public class MeetingRoomEquip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer meetroomId;
    @Column(name = "equip_id")
    private Integer equipId;
    @OneToOne
    @JoinColumn(name = "equip_id", insertable = false, updatable = false, nullable = false)
    private Equip equip;
}
