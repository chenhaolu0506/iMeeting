package org.IMeeting.repository;

import org.IMeeting.entity.Equip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface EquipRepository extends JpaRepository<Equip, Integer> {
    List<Equip> findByTenantId(Integer tenantId);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query("update Equip e set e.name = ?2 where e.id = ?1")
    int updateEquipName(Integer id, String name);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query("delete from Equip e where e.id = ?1")
    int deleteEquipById(Integer equipId);
}
