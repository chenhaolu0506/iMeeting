import React, { Component } from 'react';
import { Table, Card, Col, Row, Button, Tooltip, Icon, message, Input, Drawer, Modal } from "antd";
import global from '@/global';
import Highlighter from 'react-highlight-words';
class WeekMeetManage extends Component {
    componentDidMount() {
        this.manageFindAll();
    }
    state = {
        dataSource: [],
        equipName: "",
        equipId: 0,
        drawerVisible: false,
        addOrChange: false,
        modalVisible: false,
        searchText: "",
    }
    //表格查询
    getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys, selectedKeys, confirm, clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => { this.searchInput = node; }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm)}
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
                </Button>
                <Button
                    onClick={() => this.handleReset(clearFilters)}
                    size="small"
                    style={{ width: 90 }}
                >
                    Reset
                </Button>
            </div>
        ),
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: (text) => (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text == null ? "" : text.toString()}
            />
        ),
    })
    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    }

    handleReset = (clearFilters) => {
        clearFilters();
        this.setState({ searchText: '' });
    }

    handleCancel = (e) => {
        this.setState({
            modalVisible: false,
        });
    }
    onClose = (e) => {
        this.setState({
            drawerVisible: false,
        });
    }
    showDelete = (ev, id) => {
        this.setState({
            modalVisible: true,
            equipId: id,
        });
    }
    showUpdate = (ev, id, name) => {
        this.setState({
            addOrChange: false,
            drawerVisible: true,
            equipName: name,
            equipId: id,
        });
    }
    showAddEquip = () => {
        this.setState({
            addOrChange: true,
            drawerVisible: true,
            equipName: "",
        });
    }
    equipNameChange = (e) => {
        this.setState({
            equipName: e.target.value,
        });
    }

    /////////////////////////////////////////////////////////////////////
    agreeOne = (id) => {
        const url = global.localhostUrl + "weeklyMeeting/approveWeeklyMeeting?id=" + id;
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(res => res.json())
            .then(json => {
                const data = json;
                if (data.status) {
                    message.success(data.message);
                } else {
                    message.error(data.message);
                }
                this.manageFindAll();
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
    }
    disagreeOne = (id) => {
        const url = global.localhostUrl + "weeklyMeeting/rejectWeeklyMeeting?id=" + id;
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(res => res.json())
            .then(json => {
                const data = json;
                if (data.status) {
                    message.success(data.message);
                } else {
                    message.error(data.message);
                }
                this.manageFindAll();
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
    }
    //manageFindAll
    manageFindAll = () => {
        const url = global.localhostUrl + "weeklyMeeting/manageWeeklyMeetings";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(res => res.json())
            .then(json => {
                const data = json;
                this.setState({
                    dataSource: data.data
                })
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
    }
    render() {
        const columns = [
            {
                title: "序号",
                key: "id",
                render: (item, data, i) => {
                    return (<div>{i + 1}</div>)
                }
            }, {
                title: "会议室",
                render: (item) => {
                    return item.meetroom.name
                }
            }, {
                title: "星期",
                dataIndex: "week",
                render: (item) => {
                    switch (item) {
                        case 0:
                            return "星期日"
                        case 1:
                            return "星期一"
                        case 2:
                            return "星期二"
                        case 3:
                            return "星期三"
                        case 4:
                            return "星期四"
                        case 5:
                            return "星期五"
                        case 6:
                            return "星期六"
                        default:
                            return null
                    }
                }
            }, {
                title: "会议开始时间",
                dataIndex: "meetBegin",
                key: "meetBegin",
                ...this.getColumnSearchProps("meetBegin")
            }, {
                title: "会议结束时间",
                dataIndex: "meetOver",
                key: "meetOver",
                ...this.getColumnSearchProps("meetOver")
            }, , {
                title: "创建时间",
                dataIndex: "createTime",
                key: "createTime",
                ...this.getColumnSearchProps("createTime")
            }, {
                title: "申请人",
                render: (item) => {
                    return <Tooltip
                        title={
                            <div>
                                部门：{item.depart.name}
                                <br />
                                联系方式：{item.userinfo.phone}
                                <br />
                            </div>
                        }
                    >
                        {item.userinfo.name}
                    </Tooltip>
                }
            }, {
                title: "状态",
                dataIndex: "status",
                render: (item) => {
                    switch (item) {
                        case 0:
                            return "未处理"
                        case 1:
                            return "已通过"
                        case 2:
                            return "不通过"
                        case 3:
                            return "已取消"
                        default:
                            return null
                    }
                }
            }, {
                title: "操作",
                render: (item) => {
                    return (
                        <div>
                            <Tooltip title="通过">
                                <Button onClick={() => { this.agreeOne(item.id) }}><Icon type="check" /></Button>
                            </Tooltip>
                            <Tooltip title="不通过">
                                <Button onClick={() => { this.disagreeOne(item.id) }}><Icon style={{ color: "red" }} type="close" /></Button>
                            </Tooltip>
                        </div>
                    )
                }
            }
        ];
        return (
            <div >
                <Row>
                    <Col span={18} offset={3}>
                        <Card
                            title={<h2 style={{ float: 'left', marginBottom: -3 }}>每周例会管理</h2>}
                        >
                            <Table rowKey={record => record.id} className={'table'} columns={columns} dataSource={this.state.dataSource} />
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default WeekMeetManage;
