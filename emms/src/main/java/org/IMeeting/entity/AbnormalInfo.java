package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Setter
@Getter
@Entity
@Table(name = "m_abnormal_info")
public class AbnormalInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int meetingId;
    private String imgUrl;
    private String time;
    private int status;
    private int userId;
    private int isRead;
    private String meetingName;


}
