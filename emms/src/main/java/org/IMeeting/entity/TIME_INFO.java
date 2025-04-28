package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TIME_INFO {
    private TIME Start_time;
    private TIME End_time;

    public TIME_INFO(TIME startTime, TIME overTime) {
        super();
        this.Start_time = startTime;
        this.End_time = overTime;
    }
}