package org.IMeeting.repository;

import org.springframework.stereotype.Repository;

import org.IMeeting.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, Integer> {
    Tenant findByUsernameAndPassword(String username, String password);
}
