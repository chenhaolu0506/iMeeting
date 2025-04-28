package org.IMeeting.util;

import java.math.BigDecimal;

/**
 * Created by gjw on 2019/2/11.
 */
public class NumUtil {
    public static double hold2(double f) {
        BigDecimal bg = new BigDecimal(f);
        double f1 = bg.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
        return f1;
    }
}
