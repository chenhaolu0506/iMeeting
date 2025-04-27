package org.IMeeting.service;

import org.IMeeting.entity.ServerResult;

import javax.servlet.http.HttpServletRequest;

public interface PositionService {
    ServerResult selectAll(HttpServletRequest request);
    ServerResult deletePosition(Integer positionId);
}
