package org.IMeeting.repository;

import org.IMeeting.entity.LeaveInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface LeaveInformationRepository extends JpaRepository<LeaveInformation, Integer> {
    @Query("select count(*) from LeaveInformation l where l.meetingId = ?1")
    int countByMeetingId(int meetingId);

    @Query("select count(*) from LeaveInformation l where l.meetingId = ?1 and l.status = 0")
    int countUnprocessedByMeetingId(int meetingId);

    List<LeaveInformation> findByMeetingIdOrderByStatus(int meetingId);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query("update LeaveInformation l set l.status = 1 where l.id = ?1")
    int approveLeave(int leaveInfoId);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query("update LeaveInformation l set l.status = 2 where l.id = ?1")
    int rejectLeave(int leaveInfoId);
}
