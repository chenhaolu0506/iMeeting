package org.IMeeting.repository;

import org.IMeeting.entity.Outline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OutlineRepository extends JpaRepository<Outline, Integer> {
    List<Outline> findByMeetingIdOrderByLevel(Integer meetingId);
}
