package org.IMeeting.dao.impl;

import org.IMeeting.dao.AbnormalInfoDao;
import org.IMeeting.entity.AbnormalInfo;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class AbnormalDaoImpl extends BaseDaoImpl<AbnormalInfo, Integer> implements AbnormalInfoDao {
}
