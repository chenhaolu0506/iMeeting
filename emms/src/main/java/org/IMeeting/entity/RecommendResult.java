package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RecommendResult {
    private int meetingRoomId;
    private String meetingRoomName;
    private String similar;
    private double similarityScore;
    private int contain;
    private String num;
    private List<MeetingRoomEquip> meetingRoomEquipList;
}