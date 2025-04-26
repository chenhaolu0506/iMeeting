package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "m_week_meeting")
public class WeeklyMeeting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String beginTime;
    private String overTime;
    private int week;
    @Column(name = "user_id")
    private int userId;
    private String createTime;
    private int status;
    @Column(name = "meet_room_id")
    private int meetingRoomId;
    private String meetBegin;
    private String meetOver;
    private int tenantId;
    @Column(name = "depart_id")
    private int departmentId;
    private String note;

    @OneToOne
    @JoinColumn(name = "user_id",insertable = false,updatable = false,nullable = false)
    private UserInfo userinfo;
    @OneToOne
    @JoinColumn(name = "depart_id",insertable = false,updatable = false,nullable = false)
    private Department department;
    @OneToOne
    @JoinColumn(name = "meet_room_id",insertable = false,updatable = false,nullable = false)
    private MeetingRoom meetingRoom;
}
