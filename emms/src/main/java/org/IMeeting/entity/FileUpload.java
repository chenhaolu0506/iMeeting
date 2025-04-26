package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "m_file_upload")
public class FileUpload {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "meet_room_id")
    private int meetRoomId;
    @Column(name = "meeting_id")
    private int meetingId;
    private String fileName;
    private String fileUrl;
    private int status;
    private int tenantId;
    @OneToOne
    @JoinColumn(name = "meet_room_id", insertable = false, updatable = false, nullable = false)
    private MeetingRoom meetingRoom;

    @OneToOne
    @JoinColumn(name = "meeting_id", insertable = false, updatable = false, nullable = false)
    private Meeting meeting;
}
