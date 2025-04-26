package org.IMeeting.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import org.IMeeting.entity.MeetingRoom;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface MeetingRoomRepository extends JpaRepository<MeetingRoom, Integer> {
    List<MeetingRoom> findByTenantIdAndAvailStatus(Integer tenantId, Integer availStatus);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "select m from MeetingRoom m , Meeting n where m.id=n.meetRoomId and n.begin=?1")
    List<MeetingRoom> findByBeginTime(String beginTime);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "update MeetingRoom m set m.nowStatus=1 where m.id=?1")
    List<MeetingRoom> updateMeetingRoomStatusByRoomId(Integer roomId);

    @Query(value = "select m from MeetingRoom m where m.tenantId=?1 and (m.availStatus=0 or m.availStatus=1)")
    List<MeetingRoom> findByTenantId(Integer tenantId);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "update MeetingRoom m set m.availStatus=?2 where m.id=?1")
    int updateMeetingRoomAvailStatus(Integer meetRoomId,Integer availStatus);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "update MeetingRoom m set m.name=?2,m.num=?3,m.place=?4,m.contain=?5 where m.id=?1")
    int updateMeetingRoom(Integer meetingRoomId, String name, String num, String place, Integer contain);

    @Query(value = "select count(m) from MeetingRoom m where m.tenantId=?1")
    int countByTenantId(Integer tenantId);

    @Query(value = "select count(m) from MeetingRoom m where m.tenantId=?1 and m.nowStatus=0")
    int countFreeRoomByTenantId(Integer tenantId);
}
