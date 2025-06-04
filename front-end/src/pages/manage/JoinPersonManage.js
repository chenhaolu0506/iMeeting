import React, { Component } from 'react';
import { Table, Card, Col, Row, Button, Tooltip, Icon, message, Drawer, Input } from "antd";
import global from '@/global';
import Highlighter from "react-highlight-words";

class JoinPersonManage extends Component {
    componentDidMount() {
        this.toJoinPersonIndex();
    }
    state = {
        dataSource: [],
        joinDataSource: [],
        equipName: "",
        meetingId: 0,
        drawerVisible: false,
        addOrChange: false,
        modalVisible: false,
    }
    //表格查询...this.getColumnSearchProps("name"),
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
    onClose = (e) => {
        this.setState({
            drawerVisible: false,
        });
    }
    /////////////////////////////////////////////////////////////////////
    //remindOne 提醒未签到的用户
    remindOne = (ev, id) => {
        const url = global.localhostUrl + "joinPerson/remindOne?meetingId=" + this.state.meetingId + "&userId=" + id;
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
                    message.success("操作成功！")
                }
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
    }
    //showOneMeeting
    showOneMeeting = (ev, id) => {
        const url = global.localhostUrl + "joinPerson/showOneMeeting?meetingId=" + id;
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
                    meetingId: id,
                    drawerVisible: true,
                    joinDataSource: data.data,
                })
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
    }
    //insertOne
    insertOne = () => {
        const url = global.localhostUrl + "equip/insertOne?equipName=" + this.state.equipName;
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
                    message.success("操作成功！")
                }
                this.toJoinPersonIndex();
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
    }
    //toJoinPersonIndex
    toJoinPersonIndex = () => {
        const url = global.localhostUrl + "joinPerson/toJoinPersonIndex";
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
                    dataSource: data.data,
                    drawerVisible: false,
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
                title: "会议名",
                dataIndex: "topic",
                key: "topic",
                ...this.getColumnSearchProps("topic"),
            }, {
                title: "开始时间",
                dataIndex: "begin",
                key: "begin",
                ...this.getColumnSearchProps("begin"),
            }, {
                title: "结束时间",
                dataIndex: "over",
                key: "over",
                ...this.getColumnSearchProps("over"),
            }, {
                title: "操作",
                render: (item) => {
                    return (
                        <div>
                            <Tooltip title="查看此会议">
                                <Button onClick={(ev) => { this.showOneMeeting(ev, item.id) }}><Icon type={"eye"}></Icon></Button>
                            </Tooltip>
                        </div>
                    )
                }
            }
        ];
        const joinColumns = [
            {
                title: "序号",
                key: "recordId",
                render: (item, data, i) => {
                    return (<div>{i + 1}</div>)
                }
            }, {
                title: "姓名",
                dataIndex: "userName",
                key: "userName",
                ...this.getColumnSearchProps("userName"),
            }, {
                title: "联系电话",
                dataIndex: "userPhone",
                key: "userPhone",
                ...this.getColumnSearchProps("userPhone"),
            }, {
                title: "签到状态",
                dataIndex: "status",
                key: "status",
                ...this.getColumnSearchProps("status"),
            }, {
                title: "签到时间",
                dataIndex: "signTime",
            }, {
                title: "操作",
                render: (item) => {
                    if (item.status === "未签到") {
                        return (
                            <div>
                                <Tooltip title="提醒">
                                    <Button onClick={(ev) => { this.remindOne(ev, item.id) }}><Icon type="exclamation" /></Button>
                                </Tooltip>
                            </div>
                        )
                    } else {
                        return null;
                    }
                }
            }
        ];
        return (
            <div >
                <Row>
                    <Col span={18} offset={3}>
                        <Card
                            title={<h2 style={{ float: 'left', marginBottom: -3 }}>会议签到管理</h2>}
                        >
                            <Table rowKey={record => record.id} className={'table'} columns={columns} dataSource={this.state.dataSource} />
                        </Card>
                    </Col>
                </Row>
                <Drawer
                    title={
                        this.state.addOrChange ?
                            <Button href="#" type={"primary"} onClick={this.insertOne}>添加</Button>
                            :
                            <Button href="#" type={"primary"} onClick={this.updateOne}>保存修改</Button>
                    }
                    placement="right"
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.drawerVisible}
                    width={"60%"}
                >
                    <Card>
                        签到状态：
                        <Table rowKey={record => record.recordId} className={'table'} columns={joinColumns} dataSource={this.state.joinDataSource} />
                    </Card>
                </Drawer>
            </div>
        );
    }
}

export default JoinPersonManage;
