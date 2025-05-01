package org.IMeeting.dao.impl;

import org.IMeeting.dao.VideoRightDao;
import org.IMeeting.entity.VideoRight;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Repository
public class VideoRightDaoImpl extends BaseDaoImpl<VideoRight, Integer> implements VideoRightDao {
}
