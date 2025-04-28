package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CoordinateParameter {
    private String topic;
    private String content;
    private Integer meetRoomId;
    private String reserveDate;
    private String beginTime;
    private String overTime;
    private int prepareTime;
    private int lastTime;
    private int beforeOrLast;//1表示开始后 2表示结束前
    private List<Integer> joinPeopleId;
    private String note;
    private Integer beforeMeetingId;
    private List<OutsideJoinPerson> outsideJoinPersons;
}
