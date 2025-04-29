package org.IMeeting.dao.impl;

import org.IMeeting.dao.FileUploadDao;
import org.IMeeting.entity.FileUpload;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Repository
public class FileUploadDaoImpl extends BaseDaoImpl<FileUpload, Integer> implements FileUploadDao {
}
