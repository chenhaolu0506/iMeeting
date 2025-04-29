package org.IMeeting.service.serviceImpl;

import org.IMeeting.entity.Tenant;
import org.IMeeting.repository.TenantRepository;
import org.IMeeting.service.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TenantServiceImpl implements TenantService {
    @Autowired
    private TenantRepository tenantRepository;

    @Override
    public Optional<Tenant> findById(Integer tenantId) {
        return tenantRepository.findById(tenantId);
    }
}
