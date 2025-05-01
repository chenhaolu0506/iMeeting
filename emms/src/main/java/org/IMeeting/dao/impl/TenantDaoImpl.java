package org.IMeeting.dao.impl;

import org.IMeeting.dao.TenantDao;
import org.IMeeting.entity.Tenant;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class TenantDaoImpl extends BaseDaoImpl<Tenant, Integer> implements TenantDao {
}
