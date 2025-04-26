package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SelectMeetingParameter {
    private String topic;   //会议主题
    private String selectBeginTime; //查找开始时间
    private String selectOverTime; //查找结束时间
    private Integer meetingRoomId; //会议室id
    private Integer departmentId; //部门id
    private String reserveName; //预定人名字
    private String status; //预定会议状态
}