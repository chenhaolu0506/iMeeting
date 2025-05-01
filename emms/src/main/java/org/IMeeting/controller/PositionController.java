package org.IMeeting.controller;

import org.IMeeting.entity.Position;
import org.IMeeting.entity.ServerResult;
import org.IMeeting.repository.PositionRepository;
import org.IMeeting.service.PositionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/position")
public class PositionController {
    @Autowired
    private PositionService positionService;
    @Autowired
    private PositionRepository positionRepository;

    //查询该租户所有的职位
    @RequestMapping("/selectAll")
    public ServerResult selectAll(HttpServletRequest request){
        return positionService.selectAll(request);
    }

    //修改一个职位(从属部门，名字),参数为职位id,从属部门id,职位名字
    @RequestMapping("/editPosition")
    public ServerResult editPosition(@RequestBody Position position){
        int bol = positionRepository.updatePosition(position.getId(),position.getDepartId(),position.getName());
        ServerResult serverResult = new ServerResult();
        if (bol != 0){
            serverResult.setStatus(true);
        }
        return serverResult;
    }

    //删除一个职位,显示各种情况的相应内容Message
    @RequestMapping("/deletePosition")
    public ServerResult deletePosition(@RequestParam("positionId") Integer positionId){
        return positionService.deletePosition(positionId);
    }

    //增加一个职位，参数为从属部门id，职位名字
    @RequestMapping("/insertPosition")
    public ServerResult insertPosition(@RequestParam("departId")Integer departId,@RequestParam("positionName")String positionName,HttpServletRequest request){
        Position position = new Position();
        position.setTenantId((Integer) request.getSession().getAttribute("tenantId"));
        position.setDepartId(departId);
        position.setName(positionName);
        positionRepository.saveAndFlush(position);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }
}
