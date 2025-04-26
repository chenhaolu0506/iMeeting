package org.IMeeting.repository;

import org.IMeeting.entity.EquipRepairInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Repository
public interface EquipRepairInfoRepository extends JpaRepository<EquipRepairInfo,Integer> {
    List<EquipRepairInfo>findByTenantId(int tenantId);
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "update EquipRepairInfo m set m.repairName=?1 ,m.repairTime=?2,m.status=1 where m.id=?3")
    int updateRepairInfo(String repairName,String repairTime,Integer id);
    List<EquipRepairInfo>findByUserId(Integer userId);
}
