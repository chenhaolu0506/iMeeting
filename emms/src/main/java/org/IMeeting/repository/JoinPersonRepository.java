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
    @Query("update JoinPerson j set j.status = ?1 where j.meetingId = ?2 and j.userId = ?3")
    int updateStatus(Integer status,Integer meetingId,Integer userId);
}
