package org.IMeeting.repository;

import org.IMeeting.entity.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


//switch (meeting.getStatus()) {
//        case 6:
//status = "预约失败";
//        break;
//        case 1:
//status = "预约成功";
//        break;
//        case 2:
//status = "预约中";
//        break;
//        case 3:
//status = "会议进行中";
//        break;
//        case 4:
//status = "会议结束";
//        break;
//        case 5:
//status = "取消会议";
//        break;
//        case 7:
//status = "调用失败";
//        break;
//        case 8:
//status = "调用中";
//        break;
//        }

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, Integer>, JpaSpecificationExecutor<Meeting> {
    List<Meeting> findByMeetroomIdAndMeetDateAndStatusOrderByBegin(Integer meetingRoomId, String meetingDate, Integer status);

    @Transactional
    @Modifying
    @Query(value = "update Meeting m set m.status=?2 where m.id=?1")
    int updateMeetingStatus(Integer meetingId,Integer status);

    List<Meeting> findByBeginAndOverAndMeetroomIdAndStatusOrderByCreateTimeAsc(String beginTime, String endTime, Integer meetingRoomId, Integer status);

    @Transactional
    @Modifying
    @Query(value = "select m from Meeting m where m.begin<?2 and m.over>?1 and m.meetroomId=?3 and(m.status=1 or m.status=3)")
    List<Meeting> findIntersectMeeting(String beginTime, String endTime, Integer meetingRoomId);

    @Query(value = "select m from Meeting m where m.userId=?1 and m.meetDate like?2 group by m.meetDate")
    List<Meeting> groupByMeetingDate(Integer userId, String yearMonth);

    @Query(value = "select count (m) from Meeting m where m.userId=?1 and m.meetDate=?2")
    Long countReservation(Integer userId, String meetDate);
    @Query(value = "select m from Meeting m where m.userId=?1 and m.meetDate=?2 order by m.status ,m.begin")
    List<Meeting> findReservation(Integer userId, String meetDate);

    List<Meeting>findByMeetroomIdAndStatus(int meetingRoomId,int status);

    @Override
    void flush();

    @Transactional
    @Modifying
    @Query(value = "update Meeting m set m.begin=?2 where m.id=?1")
    int updateBeginTime(Integer meetingId, String begin);

    @Transactional
    @Modifying
    @Query(value = "update Meeting m set m.over=?2 where m.id=?1")
    int updateEndTime(Integer meetingId, String end);

    @Transactional
    @Modifying
    @Query(value = "update Meeting m set m.topic=?2, m.content=?3, m.prepareTime=?4 where m.id=?1")
    int updateMetaData(Integer meetingId, String topic, String content, Integer prepareTime);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "update Meeting m set m.over=?2,m.status=?3,m.lastTime=?4 where m.id=?1")
    int updateOver(Integer meetingId, String over, Integer status, Integer lastTime);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "update Meeting m set m.status=?3 where m.begin=?1 and m.status=?2")
    int updateMeetingStatus(String beginTime, Integer beforeStatus, Integer afterStatus);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "update Meeting m set m.status=?3 where m.over=?1 and m.status=?2")
    int updateStatusByOverTimeAndStatus(String overTime, Integer beforeStatus, Integer afterStatus);

    @Query(value = "select m from Meeting m ,JoinPerson n where n.userId=?1 and m.id=n.meetingId and m.meetDate like?2 and (m.status=1 or m.status=4)group by m.meetDate")
    List<Meeting> findMeetingsByUserAndMonth(Integer userId,String yearMonth);
    @Query(value = "select count(m) from Meeting m ,JoinPerson n where n.userId=?1 and m.id=n.meetingId and m.meetDate =?2 and m.status=?3")
    int countNotStartMeeting(Integer userId,String meetDate,Integer status);
    @Query(value = "select count(m) from Meeting m ,JoinPerson n where n.userId=?1 and m.id=n.meetingId and m.meetDate =?2 and m.status=?3")
    int countOverMeeting(Integer userId,String meetDate,Integer status);
    @Query(value = "select m from Meeting m ,JoinPerson n where n.userId=?1 and m.id=n.meetingId and m.meetDate =?2 and (m.status=1 or m.status=3 or m.status=4)order by m.status")
    List<Meeting> findMeetingsByUserAndDate(Integer userId,String date);
    @Query(value = "select m from Meeting m where m.userId=?1 and (m.status=1 or m.status=3 )order by m.begin")
    List<Meeting> selectByUserIdAndStatus(Integer userId);
    @Query(value = "select m from Meeting m where m.userId=?1 and (m.status=3 or m.status=4)order by m.begin desc")
    List<Meeting> selectByUserIdAndStatusJoin(Integer userId);
    @Query(value = "select m from Meeting m where m.meetDate=?1 and m.status=?2 and meetroomId=?3 order by m.begin asc")
    List<Meeting> selectByMeetingDateAndStatusAndMeetingRoomId(String meetDate,Integer status,int meetRoomId);
    @Query(value = "select m from Meeting m where m.meetDate=?1 and (m.status=1 or m.status=3) and meetroomId=?2  order by m.begin asc")
    List<Meeting> selectByMeetDateWhereStatusIsOneOrThree(String meetDate,int meetRoomId);
    @Query(value = "select  m from Meeting m , JoinPerson n where  m.meetDate>=?2 and m.meetDate<=?3 and (m.status=1 or m.status=3) and n.userId=?1 and n.meetingId=m.id order by m.begin")
    List<Meeting> findMeetingByUserIdAndDate(Integer userId,String beginDate,String overDate);
    @Query(value="select  m from Meeting m where m.userId=?1 and m.meetDate>=?2 and m.meetDate<=?3 and m.status=4 order by m.meetDate")
    List<Meeting> findOverMeetingByUserIdAndDate(Integer userId, String beginDate, String overDate);
    @Query(value="select  m from Meeting m where m.userId=?1 and m.meetDate>=?2 and m.meetDate<=?3 and m.status=4 group by  m.meetroomId")
    List<Meeting> findOverMeetingByUserIdAndDateGroupByRoom(Integer userId, String beginDate, String overDate);
    @Query(value="select  count (m) from Meeting m where m.userId=?1 and m.meetDate>=?2 and m.meetDate<=?3 and m.status=4 and m.meetroomId=?4 ")
    int countOverMeetingByUserIdAndDateAndRoom(Integer userId, String beginDate, String overDate,Integer roomId);
    @Query(value="select  m from Meeting m where m.tenantId=?1 and m.meetDate>=?2 and m.meetDate<=?3 and m.status=4 group by  m.meetroomId")
    List<Meeting> findOverMeetingByTenantIdAndDateGroupByRoom(Integer tenantId, String beginDate, String overDate);
    @Query(value="select  count (m) from Meeting m where m.meetDate>=?1 and m.meetDate<=?2 and m.status=4 and m.meetroomId=?3 ")
    int countOverMeetingByDateAndRoom(String beginDate, String overDate,Integer roomId);
    List<Meeting> findByMeetroomIdAndMeetDateOrderByBegin(Integer meetRoomId, String meetDate);
    /*-------------华丽分割线-------------*/
    @Query(value = "select  m from Meeting m where m.tenantId=?1 and m.meetDate>=?2 and m.meetDate<=?3 and m.status=4 group by m.departId")
    List<Meeting>selectGroupByDepart(Integer tenantId,String begin,String over);
    @Query(value = "select  m from Meeting m where m.tenantId=?1 and m.meetDate>=?2 and m.meetDate<=?3 and m.status=4 group by m.userId")
    List<Meeting>selectGroupByUser(Integer tenantId,String begin,String over);
    @Query(value = "select  m from Meeting m where m.tenantId=?1 and m.meetDate>=?2 and m.meetDate<=?3 and m.status=4 group by m.meetroomId")
    List<Meeting>selectGroupByMeetRoom(Integer tenantId,String begin,String over);
    @Query(value = "select sum(m.lastTime) from Meeting m where m.userId=?1 and m.meetDate>=?2 and m.meetDate<=?3 and m.status=4")
    int countHoursByUserAndDate(Integer userId,String begin,String over);
    @Query(value = "select sum(m.lastTime) from Meeting m where m.departId=?1 and m.meetDate>=?2 and m.meetDate<=?3 and m.status=4")
    int countHoursByDepartmentAndDate(Integer departId,String begin,String over);
    @Query(value = "select sum(m.lastTime) from Meeting m where m.meetroomId=?1 and m.meetDate>=?2 and m.meetDate<=?3 and m.status=4")
    int countHoursByMeetingRoomAndDate(Integer meetRoomId,String begin,String over);
    @Query(value = "select count (m) from Meeting m where m.userId=?1 and m.meetDate>=?2 and m.meetDate<=?3 and m.status=4")
    int countNumberOfMeetingsByUserAndDate(Integer userId,String begin,String over);
    @Query(value = "select count (m) from Meeting m where m.departId=?1 and m.meetDate>=?2 and m.meetDate<=?3 and m.status=4")
    int countNumberOfMeetingsByDepartmentAndDate(Integer departId,String begin,String over);
    @Query(value = "select count (m) from Meeting m where m.meetroomId=?1 and m.meetDate>=?2 and m.meetDate<=?3 and m.status=4")
    int countNumberOfMeetingsByMeetingRoomAndDate(Integer meetRoomId,String begin,String over);


}
