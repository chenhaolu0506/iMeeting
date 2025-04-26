package org.IMeeting.service;

import org.IMeeting.entity.ServerResult;

public interface JoinPersonService {
    ServerResult showMeeting(Integer meetingId);
    ServerResult remind(Integer meetingId, Integer userId);
}
