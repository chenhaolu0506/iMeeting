package org.IMeeting.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import org.IMeeting.entity.JoinPerson;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface JoinPersonRepository extends JpaRepository<JoinPerson, Integer> {
    List<JoinPerson> findByMeetingId(Integer meetingId);
    List<JoinPerson> findByMeetingIdOrderByStatus(Integer meetingId);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query("delete from JoinPerson j where j.meetingId = ?1")
    int deleteByMeetingId(Integer meetingId);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query("update JoinPerson j set j.status = ?2, j.joinTime = ?3 where j.meetingId = ?1")
    int updateStatusAndTime(Integer meetingId, Integer status, String time);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query("update JoinPerson j set j.status = ?3 where j.meetingId = ?1 and j.userId = ?2")
    int updateStatus(Integer meetingId, Integer userId, Integer status);
}
