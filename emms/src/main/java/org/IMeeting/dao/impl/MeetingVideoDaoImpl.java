package org.IMeeting.dao.impl;

import org.IMeeting.dao.MeetingVideoDao;
import org.IMeeting.entity.MeetingVideo;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class MeetingVideoDaoImpl extends BaseDaoImpl<MeetingVideo, Integer> implements MeetingVideoDao {
}
