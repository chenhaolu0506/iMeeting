package org.IMeeting.dao.impl;

import org.IMeeting.dao.WeeklyMeetingDao;
import org.IMeeting.entity.WeeklyMeeting;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Repository
public class WeeklyMeetingDaoImpl extends BaseDaoImpl<WeeklyMeeting, Integer> implements WeeklyMeetingDao {
}
