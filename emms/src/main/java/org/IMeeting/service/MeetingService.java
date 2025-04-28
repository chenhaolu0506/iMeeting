package org.IMeeting.service;

import org.IMeeting.entity.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

public interface MeetingService {
    MeetingRoomParameter selectParameter(Integer tenantId);
    List<MeetingRoom> getEffectiveMeetingRoom(HttpServletRequest request);
    List<Equip> selectEquip(Integer tenantId);
    List<MeetingRoomEquip> selectMeetingRoomEquip(Integer meetingRoomId);
    ServerResult toReserveIndex(HttpServletRequest request);
    ServerResult getRoomReserver(Integer meetingRoomId, String reserveDate);
    ServerResult getOneDayReserve(OneDayReservation oneDayReservation);
    ServerResult reserveMeeting(ReserveParam reserveParam, HttpServletRequest request) throws Exception;
    ServerResult robMeeting(ReserveParam reserveParam, HttpServletRequest request);
    ServerResult coordinateMeeting(CoordinateParameter coordinateParameter, HttpServletRequest request);
    ServerResult cancelMeeting(Integer meetingId);
    Meeting findByMeetingId(Integer meetingId);
    ServerResult showMyReserve(HttpServletRequest request);
    ServerResult specifiedMyReserve(HttpServletRequest request, String yearMonth);
    ServerResult oneReserveDetail(Integer meetingId);
    ServerResult oneDayMyReserve(String reserveDate,HttpServletRequest request);
    MeetingRoom findByMeetRoomId(Integer meetingRoomId);
    ServerResult disagreeCoordinate(Integer coordinateId);
    ServerResult agreeCoordinate(Integer coordinateId);
    CoordinateInfo findByCoordinateId(Integer coordinateId);
    ServerResult rescheduleMeeting(ReserveParam reserveParam,HttpServletRequest request) throws Exception;
    ServerResult editMeetingDetail(ReserveParam reserveParam,HttpServletRequest request);
    ServerResult advanceOver(Integer meetingId);
    ServerResult selectMyJoinMeeting(HttpServletRequest request,String yearMonth);
    void updateMeetingStatus(String nowTime,Integer beforeStatus,Integer afterStatus);
    void updateMeetingOverStatus(String nowTime,Integer beforeStatus,Integer afterStatus);
    ServerResult selectMyJoinMeetingByDate(String meetDate,HttpServletRequest request);
    ServerResult sendLeaveInformation(LeaveInformation leaveInformation,HttpServletRequest request);
    ServerResult countLeaveInformation(HttpServletRequest request);
    ServerResult showOneMeetingLeaveInfo(Integer meetingId);
    ServerResult findPushMessage(HttpServletRequest request);
    LeaveInformation findById(Integer id);
    double countSimilar(double[] source, double[] target, double[] weight);
    List<String> findFreeTime(Integer meetRoomId, HttpServletRequest request);
    /*-------------华丽分割线-------------*/
    List findBySpecification(SelectMeetingParameter selectMeetingParameter,HttpServletRequest request);
    void exportMeetingRecord(List<Meeting> meetings, HttpServletResponse response) throws IOException;
    List countTimeByDepart(Integer tenantId,String begin,String over);
    List countTimeByPeople(Integer tenantId,String begin,String over);
    List countTimeByMeetingRoom(Integer tenantId,String begin,String over);
    List countHourByDepart(Integer tenantId,String begin,String over);
    List countHourByPeople(Integer tenantId,String begin,String over);
    List countHourByMeetingRoom(Integer tenantId,String begin,String over);
}
