package org.IMeeting.repository;

import org.IMeeting.entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, Integer> {
    UserInfo findByUsernameAndPasswordAndStatus(String username, String password, Integer status);
    UserInfo findByPhoneAndPasswordAndStatus(String phone, String password, Integer status);
    UserInfo findByUsername(String username);
    UserInfo findByPhone(String phone);
    UserInfo findByWorknumAndTenantId(String worknum, Integer tenantId);
    List<UserInfo> findByDepartId(Integer departId);
    List<UserInfo> findByTenantIdAndStatus(Integer tenantId, Integer status);
    List<UserInfo> findByPositionId(Integer positionId);
    List<UserInfo> findByRoleId(Integer roleId);
    Optional<UserInfo> findById(Integer id);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "update UserInfo m set m.password=?1 where m.phone=?2")
    int updatePasswordByPhone(String password, String phone);

    @Transactional
    @Modifying(clearAutomatically = true)//刷新hibernate的一级缓存
    @Query(value = "update UserInfo m set m.password=?1 where m.id=?2")
    int updatePasswordById(String password, Integer id);

    UserInfo findByIdAndPassword(Integer id, String password);

    @Transactional
    @Modifying(clearAutomatically = true)//刷新hibernate的一级缓存
    @Query(value = "update UserInfo m set m.phone=?1 where m.id=?2")
    int updatePhoneById(String phone, Integer id);

    @Transactional
    @Modifying(clearAutomatically = true)//刷新hibernate的一级缓存
    @Query(value = "update UserInfo m set m.status=0 where m.id=?1")
    int deleteStatusById(Integer id);

    @Transactional
    @Modifying(clearAutomatically = true)//刷新hibernate的一级缓存
    @Query(value = "update UserInfo m set m.username=?2 where m.id=?1")
    int updateUsernameById(Integer id, String username);

    @Transactional
    @Modifying(clearAutomatically = true)//刷新hibernate的一级缓存
    @Query(value = "update UserInfo m set m.resume=?1 where m.id=?2")
    int updateResumeById(String resume, Integer id);

    @Transactional
    @Modifying(clearAutomatically = true)
    @Query(value = "update UserInfo m set m.worknum=?2,m.name=?3,m.phone=?4,m.departId=?5,m.positionId=?6,m.roleId=?7 where m.id=?1")
    int updateUserInfoById(Integer id, String worknum, String name, String phone, Integer departId, Integer positionId, Integer roleId);
}
