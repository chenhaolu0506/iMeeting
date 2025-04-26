package org.IMeeting.repository;

import org.IMeeting.entity.OutsideJoinPerson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface OutsideJoinPersonRepository extends JpaRepository<OutsideJoinPerson, Integer> {
    List<OutsideJoinPerson> findByMeetingId(Integer meetingId);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query("delete from OutsideJoinPerson o where o.meetingId = ?1")
    int deleteByMeetingId(Integer meetingId);
}
