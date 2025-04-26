package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TIME_INFO {
    private TIME startTime;
    private TIME overTime;

    public TIME_INFO(TIME startTime, TIME overTime) {
        super();
        this.startTime = startTime;
        this.overTime = overTime;
    }
}