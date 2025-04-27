package org.IMeeting.repository;

import org.IMeeting.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends JpaRepository<Group, Integer> {
    @Modifying(clearAutomatically = true)
    @Query("delete from Group g where g.id = ?1")
    void deleteByGroupId(Integer groupId);

    List<Group> findByUserId(Integer userId);

    @Modifying(clearAutomatically = true)
    @Query("update Group g set g.name = ?2 where g.id = ?1")
    int updateGroupName(Integer groupId, String groupName);
}
