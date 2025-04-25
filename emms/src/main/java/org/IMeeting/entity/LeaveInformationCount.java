package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LeaveInformationCount {
    private Integer meetingId;
    private String meetingTime;
    private String topic;
    private Integer totalCount;
    private Integer unprocessedCount;
}
