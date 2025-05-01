package org.IMeeting.repository;

import org.IMeeting.entity.MeetingVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MeetingVideoRepository extends JpaRepository<MeetingVideo, Integer> {
    @Query(value = "select m from MeetingVideo m,VideoRight n where n.userId=?1 and n.videoId=m.id and m.status=1")
    List<MeetingVideo> findByUserId(Integer userId);

    List<MeetingVideo>findByCreateUserIdAndId(Integer userId,Integer id);
}
