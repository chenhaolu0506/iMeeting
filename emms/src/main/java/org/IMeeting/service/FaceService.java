package org.IMeeting.service;

import org.IMeeting.entity.ServerResult;

import javax.servlet.http.HttpServletRequest;

public interface FaceService {
    ServerResult selectAll(HttpServletRequest request);
}
