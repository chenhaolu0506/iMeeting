package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "m_meeting")
public class Meeting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String topic;
    private String content;
    private String begin;
    @Column(name = "end")
    private String over;
    @Column(name = "user_id")
    private Integer userId;
    @Column(name = "meetroom_id")
    private Integer meetRoomId;
    private Integer status;
    private Integer tenantId;
    private String meetDate;
    private Integer prepareTime;
    private String createTime;
    private Integer lastTime;
    @Column(name = "depart_id")
    private Integer departId;
}
