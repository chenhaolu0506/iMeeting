package org.IMeeting.service;

import org.IMeeting.entity.Group;
import org.IMeeting.entity.ServerResult;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public interface GroupService {
    ServerResult deleteByGroupId(Integer groupId);
    Group selectGroupById(Integer groupId);
    ServerResult showGroupById(Integer id);
    ServerResult updateOneGroup(Integer id, List<Integer> userIds, String name);
    ServerResult getGroupList(Integer userId);
    ServerResult showUser(HttpServletRequest request);
}
