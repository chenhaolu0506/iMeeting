package org.IMeeting.repository;

import org.IMeeting.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Integer> {
    Optional<Department> findById(Integer id);
    List<Department> findByTenantId(Integer tenantId);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query("update Department d set d.name = ?2 where d.id = ?1")
    int updateName(Integer id, String name);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query("delete from Department d where d.id = ?1")
    int deleteByDepartmentId(Integer id);
}
