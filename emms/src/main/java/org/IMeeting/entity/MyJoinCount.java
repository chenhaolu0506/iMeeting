package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MyJoinCount {
    private String meetDate;
    private Integer notStartCount;
    private Integer endedCount;
}