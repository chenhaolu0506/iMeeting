package org.IMeeting.dao.impl;

import org.IMeeting.dao.FaceDao;
import org.IMeeting.entity.FaceInfo;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Repository
public class FaceDaoImpl extends BaseDaoImpl<FaceInfo, Integer> implements FaceDao {
}
