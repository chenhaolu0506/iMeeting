package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ReserveParam {
    private Integer meetingId;
    private String topic;
    private String content;
    private Integer meetingRoomId;
    private String reserveDate;
    private String beginTime;
    private int prepareTime;
    private int userId;
    private List<Integer> joinPersonIds;
    private String status;
    private String meetingRoom;
    private String meetingRoomPlace;
    private String overTime;
    private List<OutsideJoinPerson> outsideJoinPersonList;
    private int lastTime;
}
