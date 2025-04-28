package org.IMeeting.util;

/**
 * Created by gjw on 2018/11/19.
 */
public class Random {
    public String GetRandom() {
        String str = "";
        for (int i=0;i<4;i++) {
            int x = (int) (Math.random() * 10);
            str = str + x;
        }
        return str;
    }
}
