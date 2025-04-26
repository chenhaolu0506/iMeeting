package org.IMeeting.repository;

import org.IMeeting.entity.MeetingRoomEquip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface MeetingRoomEquipRepository extends JpaRepository<MeetingRoomEquip, Integer> {
    List<MeetingRoomEquip> findByMeetroomId(Integer meetroomId);
    List<MeetingRoomEquip> findByEquipId(Integer equipId);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "delete from MeetingRoomEquip m where m.equipId=?1")
    int deleteByEquipId(Integer equipId);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "delete from MeetingRoomEquip m where m.meetroomId=?1")
    int deleteByMeetRoomId(Integer meetRoomId);

    MeetingRoomEquip findByEquipIdAndMeetroomId(Integer equipId,Integer meetRoomId);
}
