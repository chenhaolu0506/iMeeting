package org.IMeeting.service.serviceImpl;

import org.IMeeting.entity.*;
import org.IMeeting.repository.*;
import org.IMeeting.service.EquipService;
import org.IMeeting.service.MeetingRoomService;
import org.IMeeting.service.UserInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class EquipServiceImpl implements EquipService {
    @Autowired
    private EquipRepository equipRepository;
    @Autowired
    private MeetingRoomEquipRepository meetingRoomEquipRepository;
    @Autowired
    private EquipRepairInfoRepository equipRepairInfoRepository;
    @Autowired
    private UserInfoService userInfoService;
    @Autowired
    private MeetingRoomService meetingRoomService;

    @Override
    public ServerResult selectAll(HttpServletRequest request) {
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        List<Equip> equips = equipRepository.findByTenantId(tenantId);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        serverResult.setData(equips);
        return serverResult;
    }

    @Override
    public ServerResult insertEquip(String equipName, HttpServletRequest request) {
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        Equip equip = new Equip();
        equip.setName(equipName);
        equip.setTenantId(tenantId);
        equipRepository.saveAndFlush(equip);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    @Override
    public ServerResult updateEquip(String equipName, Integer equipId, HttpServletRequest request) {
        equipRepository.updateEquipName(equipId, equipName);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    @Override
    public ServerResult deleteEquip(Integer equipId) {
        ServerResult serverResult = new ServerResult();
        meetingRoomEquipRepository.deleteByEquipId(equipId);
        equipRepository.deleteEquipById(equipId);
        serverResult.setStatus(true);
        return serverResult;
    }

    @Override
    public int reportDamage(HttpServletRequest request, @RequestBody EquipRepairInfo equipRepairInfo){
        equipRepairInfo.setUserId((Integer) request.getSession().getAttribute("userId"));
        equipRepairInfo.setStatus(0);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String time = sdf.format(new java.util.Date());
        equipRepairInfo.setReportTime(time);
        equipRepairInfo.setTenantId((Integer) request.getSession().getAttribute("tenantId"));
        EquipRepairInfo equipmentRepairInfo = equipRepairInfoRepository.saveAndFlush(equipRepairInfo);
        return equipmentRepairInfo != null ? 1 : 0;
    }

    @Override
    public List getEquipRepairInfo(HttpServletRequest request) {
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        List<EquipRepairInfo> equipRepairInfos = new ArrayList<>();
        if (tenantId != null) {
            equipRepairInfos = equipRepairInfoRepository.findByTenantId(tenantId);
        }
        List<EquipRepairInfoResult> results = new ArrayList<>();
        String status = "";
        for (EquipRepairInfo equipRepairInfo : equipRepairInfos) {
            EquipRepairInfoResult equipRepairInfoResult = new EquipRepairInfoResult();
            equipRepairInfoResult.setId(equipRepairInfo.getId());
            equipRepairInfoResult.setDamageInfo(equipRepairInfo.getDamageInfo());
            switch (equipRepairInfo.getStatus()){
                case 0:
                    status = "未处理";
                    break;
                case 1:
                    status = "已修复";
                    break;
                case 2:
                    status = "修复失败";
                    break;
            }
            equipRepairInfoResult.setStatus(status);
            equipRepairInfoResult.setRepairName(equipRepairInfo.getRepairName());
            equipRepairInfoResult.setRepairTime(equipRepairInfo.getRepairTime());
            equipRepairInfoResult.setReportTime(equipRepairInfo.getReportTime());
            UserInfo userInfo = userInfoService.getUserInfo(equipRepairInfo.getUserId());
            equipRepairInfoResult.setUserName(userInfo.getName());
            MeetingRoom meetingRoom = meetingRoomService.getMeetingRoom(equipRepairInfo.getMeetingRoomId());
            equipRepairInfoResult.setMeetingRoomName(meetingRoom.getName());
            Equip equip = getEquipById(equipRepairInfo.getEquipId());
            equipRepairInfoResult.setEquipName(equip.getName());
            results.add(equipRepairInfoResult);
        }
        return results;
    }

    @Override
    public Equip getEquipById(Integer equipId) {
        Optional<Equip> equip = equipRepository.findById(equipId);
        return equip.orElse(null);
    }
}
