package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TIME {
    private int hour;
    private int minute;

    public TIME(int hour, int minute) {
        this.hour = hour;
        this.minute = minute;
    }

    public boolean compare(TIME time) {
        if (hour < time.getHour())
            return true;
        return minute < time.getMinute();
    }

    @Override
    public String toString(){
        return String.format("%02d", hour) + ":" + String.format("%02d", minute);
    }
}
