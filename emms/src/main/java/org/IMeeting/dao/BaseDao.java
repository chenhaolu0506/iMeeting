package org.IMeeting.dao;

import org.IMeeting.entity.PageBean;

import java.util.List;
import java.util.Map;


/**
 * @param <T> 实体类
 * @param <L> 主键
 */
public interface BaseDao<T, L> {

    void save(T bean);

    void update(T bean);

    T findOne(L id);

    /**
     * 根据id删除制定数据
     * @param id
     * @return
     */
    int delete(L id);

    /**
     * 查询所有数据
     * @return
     */
    List<T> findAll();

    /**
     * 批量保存
     * @param beans
     */
    void batchSave(List<T> beans);

    /**
     * 批量更新所有字段
     * @param beans
     */
    void batchUpdate(List<T> beans);

    /**
     * 批量删除
     * @param ids
     * @return
     */
    int batchDelete(List<L> ids);

    /**
     * 批量更新非空字段
     * @param beans
     */
    void batchUpdateNotNull(List<T> beans);

    /**
     * 这个用于执行删除和更新的sql语句
     *
     * @param sql
     * @param params
     */
    int executeSql(String sql, Object... params);

    /**
     * 这个用于执行删除和更新的hql语句
     * @param hql
     * @param params
     */
    int executeHql(String hql, Object... params);

    /**
     * 根据原始sql语句执行sql
     *
     * @param sql    原始sql语句
     * @param params 要传递的参数
     * @return map对象
     */
    List<Map<String, Object>> findSql(String sql, Object... params);

    /**
     * @param sql    原始sql语句
     * @param clazz  要反射的Class对象
     * @param params 要传递的参数
     * @param <T>
     * @return
     */
    <T> List<T> findSql(String sql, Class<T> clazz, Object... params);


    /**
     * 分页显示数据
     *
     * @param sql
     * @param pageNum  第几页
     * @param pageSize 每页显示多少个
     * @param params   需要传递的参数
     * @return
     */
    PageBean<Map<String,Object>> pageSql(String sql, Integer pageNum, Integer pageSize, Object... params);

    /**
     * 执行hql查询语句
     * @param hql
     * @param params
     * @return
     */
    List<T> findHql(String hql, Object... params);

    /**
     * hql的分页操作
     * @param hql
     * @param pageNum
     * @param pageSize
     * @param params
     * @return
     */
    PageBean<T> pageHql(String hql, Integer pageNum, Integer pageSize, Object... params);

    /**
     *hql执行统计总数
     * @param hql
     * @param params
     * @return
     */
    Long countHql(String hql, Object... params);

    /**
     * 执行统计总数
     * @param sql
     * @param params
     * @return
     */
    Long countSql(String sql, Object... params);

    /**
     * 更新非空字段
     * @param bean
     * @return
     */
    int updateNotNull(T bean);

    /**
     * 根据字段删除数据
     * @param field
     * @param value
     * @return
     */
    int deleteEqualField(String field, Object value);

    /**
     * like匹配删除
     * @param field
     * @param value
     * @return
     */
    int deleteLikeField(String field, String value);

    /**
     * 根据对象的某个字段相同查找
     * @param field
     * @param value
     * @return
     */
    List<T> findEqualField(String field, Object value);

    /**
     * 根据对象某个字段Like查找
     * @param field
     * @param value
     * @return
     */
    List<T> findLikeField(String field, String value);
}