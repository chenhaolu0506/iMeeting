package org.IMeeting.repository;

import org.IMeeting.entity.CoordinateInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface CoordinateRepository extends JpaRepository<CoordinateInfo, Integer> {
    List<CoordinateInfo> findByPrevMeetingIdAndStatus(Integer prevMeetingId, Integer status);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query("update CoordinateInfo c set c.status = ?2 where c.id = ?1")
    int updateCoordinateStatus(Integer coordinateId, Integer status);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query("update CoordinateInfo c set c.status = ?2 where c.meetingId = ?1")
    int updateStatusByMeetingId(Integer meetingId, Integer status);
}