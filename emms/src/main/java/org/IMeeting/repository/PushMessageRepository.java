package org.IMeeting.repository;

import org.IMeeting.entity.PushMessage;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface PushMessageRepository extends JpaRepository<PushMessage, Integer> {
    @Cacheable(key = "#receiveId")
    List<PushMessage> findByReceiveIdAndStatus(Integer receiveId, Integer status);

    @CacheEvict(key = "#p1")
    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "update PushMessage m set m.status=1 where m.id=?1")
    int updateStatus(Integer id, Integer userId);

    @CacheEvict(key= "#p0.receiveId")
    PushMessage save(PushMessage pushMessage);

    @CacheEvict(key= "#p0.receiveId")
    PushMessage saveAndFlush(PushMessage pushMessage);
}
