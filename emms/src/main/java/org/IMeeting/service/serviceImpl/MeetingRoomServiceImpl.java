package org.IMeeting.service.serviceImpl;

import org.IMeeting.entity.*;
import org.IMeeting.repository.*;
import org.IMeeting.service.MeetingRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class MeetingRoomServiceImpl implements MeetingRoomService {
    @Autowired
    private MeetingRoomRepository meetingRoomRepository;
    @Autowired
    private EquipRepository equipRepository;
    @Autowired
    private DepartmentRepository departmentRepository;
    @Autowired
    private MeetingRoomEquipRepository meetingRoomEquipRepository;
    @Autowired
    private MeetingRoomDepartmentRepository meetingRoomDepartmentRepository;

    @Override
    public List selectAll(HttpServletRequest request) {
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        List<MeetingRoom> meetingRooms = meetingRoomRepository.findByTenantId(tenantId);
        List<Equip> equips = equipRepository.findByTenantId(tenantId);
        List<Department> departments = departmentRepository.findByTenantId(tenantId);
        List<List> results = new ArrayList<>();
        results.add(meetingRooms);
        results.add(equips);
        results.add(departments);
        return results;
    }

    @Override
    public MeetingRoom getMeetingRoom(Integer meetingRoomId) {
        Optional<MeetingRoom> meetingRoom = meetingRoomRepository.findById(meetingRoomId);
        return meetingRoom.orElse(null);
    }

    @Override
    public ServerResult showMeetingRoom(Integer meetingRoomId, HttpServletRequest request) {
        Integer tenantId = (Integer) request.getSession().getAttribute("tenantId");
        MeetingRoom meetingRoom = getMeetingRoom(meetingRoomId);
        List<Equip> equips = equipRepository.findByTenantId(tenantId);
        List<MeetingRoomEquip> meetingRoomEquips = meetingRoomEquipRepository.findByMeetroomId(meetingRoomId);
        List<Department> departments = departmentRepository.findByTenantId(tenantId);
        List<MeetingRoomDepartment> meetingRoomDepartments1 = meetingRoomDepartmentRepository.findByMeetingRoomIdAndStatus(meetingRoomId, 1);
        List<MeetingRoomDepartment> meetingRoomDepartments0 = meetingRoomDepartmentRepository.findByMeetingRoomIdAndStatus(meetingRoomId, 0);
        List<Object> results = new ArrayList<>();
        results.add(meetingRoom);
        results.add(equips);
        results.add(meetingRoomEquips);
        results.add(departments);
        results.add(meetingRoomDepartments1);
        results.add(meetingRoomDepartments0);
        ServerResult serverResult = new ServerResult();
        serverResult.setData(results);
        serverResult.setStatus(true);
        return serverResult;
    }

    @Override
    public ServerResult editMeetingRoom(MeetingRoomParam meetingRoomParam, HttpServletRequest request){
        Integer meetingRoomId = meetingRoomParam.getId();
        meetingRoomRepository.updateMeetingRoom(meetingRoomId, meetingRoomParam.getName(), meetingRoomParam.getNum(), meetingRoomParam.getPlace(), meetingRoomParam.getContain());
        meetingRoomEquipRepository.deleteByMeetRoomId(meetingRoomId);
        if (meetingRoomParam.getEquip() != null) {
            List<Integer> equips = meetingRoomParam.getEquip();
            for (Integer equip : equips) {
                MeetingRoomEquip meetingRoomEquip = new MeetingRoomEquip();
                meetingRoomEquip.setMeetroomId(meetingRoomId);
                meetingRoomEquip.setEquipId(equip);
                meetingRoomEquipRepository.saveAndFlush(meetingRoomEquip);
            }
        }
        meetingRoomDepartmentRepository.deleteByMeetingRoomId(meetingRoomId);
        if (meetingRoomParam.getEnables() != null) {
            List<Integer> enables = meetingRoomParam.getEnables();
            for (Integer enable : enables) {
                MeetingRoomDepartment meetingRoomDepartment = new MeetingRoomDepartment();
                meetingRoomDepartment.setMeetroomId(meetingRoomId);
                meetingRoomDepartment.setDepartId(enable);
                meetingRoomDepartment.setStatus(1);
                meetingRoomDepartmentRepository.saveAndFlush(meetingRoomDepartment);
            }
        }
        if (meetingRoomParam.getBans() != null) {
            List<Integer> bans = meetingRoomParam.getBans();
            for (Integer ban : bans) {
                MeetingRoomDepartment meetingRoomDepartment = new MeetingRoomDepartment();
                meetingRoomDepartment.setMeetroomId(meetingRoomId);
                meetingRoomDepartment.setDepartId(ban);
                meetingRoomDepartment.setStatus(0);
                meetingRoomDepartmentRepository.saveAndFlush(meetingRoomDepartment);
            }
        }
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    @Override
    public ServerResult insertMeetingRoom(MeetingRoomParam meetingRoomParam, HttpServletRequest request){
        Integer tenantId= (Integer) request.getSession().getAttribute("tenantId");
        MeetingRoom meetingRoom = new MeetingRoom();
        meetingRoom.setTenantId(tenantId);
        meetingRoom.setAvailStatus(1);
        meetingRoom.setNowStatus(0);
        meetingRoom.setContain(meetingRoomParam.getContain());
        meetingRoom.setName(meetingRoomParam.getName());
        meetingRoom.setNum(meetingRoomParam.getNum());
        meetingRoom.setPlace(meetingRoomParam.getPlace());
        MeetingRoom meetingRoomSaved = meetingRoomRepository.saveAndFlush(meetingRoom);
        Integer meetingRoomId = meetingRoomSaved.getId();
        if (meetingRoomParam.getEquip() != null) {
            List<Integer> equips = meetingRoomParam.getEquip();
            for (Integer equip : equips) {
                MeetingRoomEquip meetingRoomEquip = new MeetingRoomEquip();
                meetingRoomEquip.setMeetroomId(meetingRoomId);
                meetingRoomEquip.setEquipId(equip);
                meetingRoomEquipRepository.saveAndFlush(meetingRoomEquip);
            }
        }
        if (meetingRoomParam.getEnables() != null) {
            List<Integer> enables = meetingRoomParam.getEnables();
            for (Integer enable : enables) {
                MeetingRoomDepartment meetingRoomDepartment = new MeetingRoomDepartment();
                meetingRoomDepartment.setMeetroomId(meetingRoomId);
                meetingRoomDepartment.setDepartId(enable);
                meetingRoomDepartment.setStatus(1);
                meetingRoomDepartmentRepository.saveAndFlush(meetingRoomDepartment);
            }
        }
        if (meetingRoomParam.getBans() != null) {
            List<Integer> bans = meetingRoomParam.getBans();
            for (Integer ban : bans) {
                MeetingRoomDepartment meetingRoomDepartment = new MeetingRoomDepartment();
                meetingRoomDepartment.setMeetroomId(meetingRoomId);
                meetingRoomDepartment.setDepartId(ban);
                meetingRoomDepartment.setStatus(0);
                meetingRoomDepartmentRepository.saveAndFlush(meetingRoomDepartment);
            }
        }
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

}
