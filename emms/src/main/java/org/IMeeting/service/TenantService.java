package org.IMeeting.service;

import org.IMeeting.entity.Tenant;

import java.util.Optional;

public interface TenantService {
    Optional<Tenant> findById(Integer tenantId);
}