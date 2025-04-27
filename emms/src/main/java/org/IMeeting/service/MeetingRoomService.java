package org.IMeeting.service;

import org.IMeeting.entity.MeetingRoom;
import org.IMeeting.entity.MeetingRoomParam;
import org.IMeeting.entity.ServerResult;

import javax.servlet.http.HttpServletRequest;
import java.util.List;


public interface MeetingRoomService {
    List selectAll(HttpServletRequest request);
    MeetingRoom getMeetingRoom(Integer meetingRoomId);
    ServerResult showMeetingRoom(Integer meetRoomId, HttpServletRequest request);
    ServerResult editMeetingRoom(MeetingRoomParam meetingRoomParam, HttpServletRequest request);
    ServerResult insertMeetingRoom(MeetingRoomParam meetingRoomParam, HttpServletRequest request);
}
