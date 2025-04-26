package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class MeetingRoomParam {
    private Integer id;
    private String name;
    private String num;
    private String place;
    private Integer contain;
    private List<Integer> equip;
    private List<Integer> enables;
    private List<Integer> bans;
}
