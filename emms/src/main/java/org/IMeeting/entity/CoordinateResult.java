package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CoordinateResult {
    private Integer coordinateId;
    private String startTime;
    private String endTime;
    private String note;
    private String contactName;
    private String contactNumber;
}
