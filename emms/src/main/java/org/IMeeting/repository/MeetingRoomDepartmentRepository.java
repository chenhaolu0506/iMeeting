package org.IMeeting.repository;

import org.IMeeting.entity.MeetingRoomDepartment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface MeetingRoomDepartmentRepository extends JpaRepository<MeetingRoomDepartment, Integer> {
    List<MeetingRoomDepartment> findByMeetingRoomId(Integer meetingRoomId);
    List<MeetingRoomDepartment> findByDepartId(Integer departId);
    List<MeetingRoomDepartment> findByMeetingRoomIdAndStatus(Integer meetingRoomId, Integer status);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query("delete from MeetingRoomDepartment m where m.meetroomId = ?1")
    int deleteByMeetingRoomId(Integer meetingRoomId);
}
