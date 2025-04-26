package org.IMeeting.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.IMeeting.entity.RoleInfo;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

@Repository
public interface RoleInfoRepository extends JpaRepository<RoleInfo, Integer> {
    List<RoleInfo> findByTenantId(Integer tenantId);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "delete from RoleInfo m where m.id=?1")
    int deleteRoleInfo(Integer roleId);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "update RoleInfo m set m.name=?2 where m.id=?1")
    int updateRoleInfo(Integer roleId, String roleName);
}
