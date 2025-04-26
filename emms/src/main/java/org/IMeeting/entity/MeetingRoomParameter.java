package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "m_meetroom_parameter")
public class MeetingRoomParameter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String begin;
    private String over;
    private Integer dateLimit;
    private Integer timeLimit;
    private Integer timeInterval;
    private Integer tenantId;
}
