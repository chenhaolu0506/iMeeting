package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "m_meeting_video")
public class MeetingVideo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String videoRoomName;
    @Column(name = "create_user_id")
    private Integer createUserId;
    private String createTime;
    private Integer status;
    private Integer tenantId;
}
