package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OneDayReservation {
    private String reserveDate;
    private List<Integer> meetingRooms;
}
