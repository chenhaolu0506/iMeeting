package org.IMeeting.entity;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
public class PageBean<T> implements Serializable {
    //总共的数据条数
    private Long totalCount;
    //第几页
    private Integer pageNum;
    //每页显示多少
    private Integer pageSize;
    //查询出来的数据
    private List<T> data;
}
