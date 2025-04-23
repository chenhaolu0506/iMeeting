package org.IMeeting.service;

import org.IMeeting.entity.Department;
import org.IMeeting.entity.ServerResult;

import javax.servlet.http.HttpServletRequest;

public interface DepartmentService {
    ServerResult selectAll(HttpServletRequest request);
    ServerResult deleteByDepartmentId(Integer departmentId);
    Department findByDepartmentId(Integer departmentId);

}
