package org.IMeeting.repository;

import org.IMeeting.entity.FileUpload;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileUploadRepository extends JpaRepository<FileUpload, Integer> {
    List<FileUpload> findByMeetingIdAndStatus(Integer meetingId, Integer status);
}
