package org.IMeeting.dao.impl;

import org.IMeeting.dao.OpenApplyDao;
import org.IMeeting.entity.OpenApply;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Repository
public class OpenApplyDaoImpl extends BaseDaoImpl<OpenApply, Integer> implements OpenApplyDao {
}
