package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReserverRecord {
    private Integer id;
    private String begin;
    private String over;
    private String topic;
    private String content;
    private String meetingDate;
    private String peopleName;
    private String departmentName;
    private String phone;
    private String createTime;
    private int prepareTime;
    private String status;
    private int lastTime;
    private String meetingRoom;
}
