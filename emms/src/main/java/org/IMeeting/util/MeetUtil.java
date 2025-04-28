package org.IMeeting.util;

import org.IMeeting.entity.Meeting;
import org.IMeeting.entity.TIME;
import org.IMeeting.entity.TIME_INFO;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by gjw on 2019/4/10.
 */
public class MeetUtil {
    public static List<TIME_INFO> get_free_time(TIME_INFO day_time_info,
                                         List<TIME_INFO> busy_time_info) {
        List<TIME_INFO> free_time_info = new ArrayList<TIME_INFO>();
        int has_used_num = busy_time_info.size();
        TIME start = day_time_info.getStart_time();
        TIME end = day_time_info.getEnd_time();
        for (int i = 0; i < has_used_num; i++) {
            if (start.compare(busy_time_info.get(i).getStart_time()) == true)
                free_time_info.add(new TIME_INFO(start, busy_time_info.get(i).getStart_time()));
            start = busy_time_info.get(i).getEnd_time();
        }
        if (start.compare(end) == true)
            free_time_info.add(new TIME_INFO(start, end));
        return free_time_info;
    }

    public static List<String> returnFreeTime(String begin, String over, List<Meeting> meetings) {
        TIME_INFO day_time_info = new TIME_INFO(new TIME(Integer.parseInt(begin.substring(0, 2)), Integer.parseInt(begin.substring(3, 5))), new TIME(Integer.parseInt(over.substring(0, 2)), Integer.parseInt(over.substring(3, 5))));
        List<TIME_INFO> busy_time_info = new ArrayList<TIME_INFO>();
        for (Meeting meeting : meetings) {
            busy_time_info.add(new TIME_INFO(new TIME(Integer.parseInt(meeting.getBegin().substring(11, 13)), Integer.parseInt(meeting.getBegin().substring(14, 16))), new TIME(Integer.parseInt(meeting.getOver().substring(11, 13)), Integer.parseInt(meeting.getOver().substring(14, 16)))));
        }
        List<String>result=new ArrayList<>();
        List<TIME_INFO> free_time = get_free_time(day_time_info, busy_time_info);
        for (int i = 0; i < free_time.size(); i++) {
            result.add(free_time.get(i).getStart_time().toString() + "~" +
                    free_time.get(i).getEnd_time().toString());
            System.out.println(free_time.get(i).getStart_time().toString() + "~" +
                    free_time.get(i).getEnd_time().toString());
        }
        return result;
    }
}
