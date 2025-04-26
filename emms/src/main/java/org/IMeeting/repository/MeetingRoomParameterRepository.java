package org.IMeeting.repository;

import org.IMeeting.entity.MeetingRoomParameter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface MeetingRoomParameterRepository extends JpaRepository<MeetingRoomParameter, Integer> {
    MeetingRoomParameter findByTenantId(Integer tenantId);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "update MeetingRoomParameter m set m.begin=?2,m.dateLimit=?3,m.over=?4,m.timeInterval=?5,m.timeLimit=?6 where m.id=?1")
    int updateMeetingRoomPara(Integer id, String begin, Integer dateLimit, String over,Integer timeInterval,Integer timeLimit);
}
