package org.IMeeting.dao.impl;

import org.IMeeting.dao.MeetingDao;
import org.IMeeting.entity.Meeting;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Repository
public class MeetingDaoImpl extends BaseDaoImpl<Meeting, Integer> implements MeetingDao {
}
