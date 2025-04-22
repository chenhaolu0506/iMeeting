package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

// Coordinate in this case is more like proposing a meeting
@Getter
@Setter
@Entity
@Table(name = "m_coordinateInfo")
public class CoordinateInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer meetingId;
    private String note;
    private Integer status;
    private Integer prevMeetingId;
}
