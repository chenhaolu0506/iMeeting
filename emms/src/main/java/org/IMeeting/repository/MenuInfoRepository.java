package org.IMeeting.repository;

import org.IMeeting.entity.MenuInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MenuInfoRepository extends JpaRepository<MenuInfo,Integer> {
}
