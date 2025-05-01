package org.IMeeting.dao.impl;

import org.IMeeting.dao.TaskDao;
import org.IMeeting.entity.Task;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class TaskDaoImpl extends BaseDaoImpl<Task, Integer> implements TaskDao {
}
