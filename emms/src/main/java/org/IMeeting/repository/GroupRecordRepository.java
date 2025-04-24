package org.IMeeting.repository;

import org.IMeeting.entity.GroupRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRecordRepository extends JpaRepository<GroupRecord, Integer> {
    @Modifying(clearAutomatically = true)
    @Query("delete from GroupRecord gr where gr.groupId = ?1")
    void deleteGroupRecordByGroupId(Integer groupId);

    List<GroupRecord> findByGroupId(Integer groupId);
}
