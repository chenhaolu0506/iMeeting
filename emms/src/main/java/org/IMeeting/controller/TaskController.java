package org.IMeeting.controller;

import org.IMeeting.dao.TaskDao;
import org.IMeeting.dao.impl.TaskDaoImpl;
import org.IMeeting.entity.ServerResult;
import org.IMeeting.entity.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Transactional
@RequestMapping("/task")
public class TaskController {
    @Autowired
    private TaskDao taskDao;

    //会议预定者和会议参与者查看某个会议的任务
    @RequestMapping("/findByMeeting")
    public ServerResult findByMeeting(@RequestParam("meetingId") Integer meetingId){
        List<Task> tasks = taskDao.findEqualField("meetingId",meetingId);
        ServerResult serverResult = new ServerResult();
        serverResult.setData(tasks);
        serverResult.setStatus(true);
        return serverResult;
    }

    // 插入会议任务
    @RequestMapping("/insertTask")
    public ServerResult insertTask(@RequestBody Task task){
        taskDao.save(task);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    // 删除会议任务
    @RequestMapping("/deleteTask")
    public ServerResult deleteTask(@RequestParam("taskId") Integer taskId){
        taskDao.delete(taskId);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }

    // 修改会议任务
    @RequestMapping("/updateTask")
    public ServerResult updateTask(@RequestBody Task task){
        taskDao.update(task);
        ServerResult serverResult = new ServerResult();
        serverResult.setStatus(true);
        return serverResult;
    }
}
