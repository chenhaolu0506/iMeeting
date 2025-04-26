package org.IMeeting.repository;

import org.IMeeting.entity.OpenApply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OpenApplyRepository extends JpaRepository<OpenApply, Integer> {
    @Query(value = "select m from OpenApply m where m.userId=?1 and status=?2 and meetRoomId=?3 and beginDate<=?4 and overDate>=?4 and beginTime<=?5 and overTime>=?5")
    List<OpenApply> findByUserIdAndStatusAndMeetRoomId(Integer userId, Integer status, Integer meetRoomId, String today, String nowTime);
}
