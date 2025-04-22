package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CoordinateParameter {
    private String topic;
    private String content;
    private Integer meetingRoomId;
    private String reserveDate;
    private String startTime;
    private String endTime;
    private Integer preparationTime;
    private Integer meetingLength;
    private Integer alignWith; // 1: align with beginning, 2: align with end
    private List<Integer> participantIds;
    private String note;
    private Integer prevMeetingId;
    private List<ExternalParticipant> externalParticipants;
}
