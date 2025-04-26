package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class MeetingVideoParam {
    private List<Integer> userIdList;
    private String videoRoomName;
}
