package org.IMeeting.repository;

import org.IMeeting.entity.RoleMenu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface RoleMenuRepository extends JpaRepository<RoleMenu, Integer> {
    List<RoleMenu> findByRoleId(Integer roleId);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "delete from RoleMenu m where m.roleId=?1")
    int deleteByRoleId(Integer roleId);
}
