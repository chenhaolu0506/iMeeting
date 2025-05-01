package org.IMeeting.dao.impl;

import org.IMeeting.dao.OutlineDao;
import org.IMeeting.entity.Outline;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class OutlineDaoImpl extends BaseDaoImpl<Outline, Integer> implements OutlineDao {
}
