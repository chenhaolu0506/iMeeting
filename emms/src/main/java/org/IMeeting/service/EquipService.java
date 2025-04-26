package org.IMeeting.service;

import org.IMeeting.entity.Equip;
import org.IMeeting.entity.EquipRepairInfo;
import org.IMeeting.entity.ServerResult;
import org.springframework.web.bind.annotation.RequestBody;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public interface EquipService {
    ServerResult selectAll(HttpServletRequest request);
    ServerResult insertEquip(String equipName, HttpServletRequest request);
    ServerResult updateEquip(String equipName, Integer equipId, HttpServletRequest request);
    ServerResult deleteEquip(Integer equipId);
    int reportDamage(HttpServletRequest request, @RequestBody EquipRepairInfo equipRepairInfo);
    List getEquipRepairInfo(HttpServletRequest request);
    Equip getEquipById(Integer equipId);
}
