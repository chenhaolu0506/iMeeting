package org.IMeeting.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import org.IMeeting.entity.Position;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface PositionRepository extends JpaRepository<Position, Integer> {
    Optional<Position> findById(Integer id);
    List<Position> findByTenantId(Integer tenantId);
    List<Position> findByDepartId(Integer departId);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "update Position m set m.departId=?2 ,m.name=3 where m.id=?1")
    int updatePosition(Integer positionId,Integer departId,String name);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "delete from Position m where m.id=?1")
    int deletePosition(Integer positionId);
}
