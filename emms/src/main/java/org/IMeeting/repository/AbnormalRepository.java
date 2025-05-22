package org.IMeeting.repository;

import org.IMeeting.entity.AbnormalInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface AbnormalRepository extends JpaRepository<AbnormalInfo, Integer> {
    List<AbnormalInfo> findByStatus(int status);
    List<AbnormalInfo> findByMeetingIdAndImgUrl(int meetingId, String imgUrl);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query("update AbnormalInfo a set a.status = 1 where a.id = ?1")
    int changeStatus(int id);

    @Query("select a from AbnormalInfo a where a.userId = ?1 and a.status=1 order by a.isRead, a.time")
    List<AbnormalInfo>selectAbnormal(int userId);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query("update AbnormalInfo a set a.isRead = 1 where a.id = ?1")
    int changeIsRead(int id);
}
