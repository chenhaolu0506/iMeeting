package org.IMeeting.controller;

import org.IMeeting.entity.EquipRepairInfo;
import org.IMeeting.repository.EquipRepairInfoRepository;
import org.IMeeting.service.EquipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.IMeeting.entity.ServerResult;

import javax.servlet.http.HttpServletRequest;
import java.text.SimpleDateFormat;
import java.util.List;


@RestController
@RequestMapping("/equip")
public class EquipController {
    @Autowired
    private EquipService equipService;
    @Autowired
    private EquipRepairInfoRepository equipRepairInfoRepository;

    //查询该租户所有的会议室设备
    @RequestMapping("/selectAll")
    public ServerResult selectAll(HttpServletRequest request){
        return equipService.selectAll(request);
    }

    //增加会议室设备,传入参数会设备名字
    @RequestMapping("/insertOne")
    public ServerResult insertOne(@RequestParam("equipName") String equipName, HttpServletRequest request){
        return equipService.insertEquip(equipName, request);
    }

    //修改一个会议室设备的名字,传入参数会设备名字和id
    @RequestMapping("/updateOne")
    public ServerResult updateOne(@RequestParam("equipName") String equipName, @RequestParam("equipId") Integer equipId,HttpServletRequest request){
        return equipService.updateEquip(equipName, equipId, request);
    }

    //删除一个会议室设备,传入参数会设备id
    @RequestMapping("/deleteOne")
    public ServerResult deleteOne(@RequestParam("equipId") Integer equipId){
        return equipService.deleteEquip(equipId);
    }

    //设备报修
    @RequestMapping("/reportDamage")
    public ServerResult reportDamage(HttpServletRequest request, @RequestBody EquipRepairInfo equipRepairInfo){
        int bol = equipService.reportDamage(request, equipRepairInfo);
        ServerResult serverResult=new ServerResult();
        if (bol == 1) {
            serverResult.setCode(1);
        } else {
            serverResult.setCode(0);
        }
        serverResult.setStatus(true);
        return serverResult;
    }
    //管理端查看设备报修
    @RequestMapping("/getEquipRepairInfos")
    public ServerResult getEquipRepairInfos(HttpServletRequest request){
        List<EquipRepairInfo> equipRepairInfoList = equipService.getEquipRepairInfo(request);
        ServerResult serverResult=new ServerResult();
        serverResult.setData(equipRepairInfoList);
        serverResult.setStatus(true);
        return serverResult;
    }

    //管理端处理设备报修
    @RequestMapping("/processEquipRepair")
    public ServerResult processEquipRepair(@RequestParam("repairName") String repairName, @RequestParam("id") Integer id){
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String nowTime = sdf.format(new java.util.Date());
        int bol = equipRepairInfoRepository.updateRepairInfo(repairName, nowTime, id);
        int code = (bol == 0) ? 0 : 1;
        ServerResult serverResult=new ServerResult();
        serverResult.setCode(code);
        serverResult.setStatus(true);
        return serverResult;
    }
    //用户端查看自己提交的设备报修
    @RequestMapping("/userGetEquipRepairInfos")
    public ServerResult userGetEquipRepairInfos(HttpServletRequest request){
        Integer userId= (Integer) request.getSession().getAttribute("userId");
        List<EquipRepairInfo> equipRepairInfoList = equipRepairInfoRepository.findByUserId(userId);
        ServerResult serverResult = new ServerResult();
        serverResult.setData(equipRepairInfoList);
        serverResult.setStatus(true);
        return  serverResult;
    }
}
