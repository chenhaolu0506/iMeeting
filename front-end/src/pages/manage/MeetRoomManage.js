import React, { Component } from 'react';
import { Table, Card, Col, Row, Button, Tooltip, Icon, message, Input, Drawer, Tree, Badge } from "antd";
import global from '@/global';
import Highlighter from "react-highlight-words";

class MeetRoomManage extends Component {
    componentDidMount() {
        this.selectAll();
    }
    state = {
        dataSource: [],
        allMenuList: [],
        allDepartList: [],
        drawerVisible: false,
        roomName: "",
        num: "",
        place: "",
        contain: "",
        menuList: [],
        addOrChange: true,
        roleId: 0,
        checkedKeys: [],
        checkedDepartKeys: [],
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
    onClose = () => {
        this.setState({
            drawerVisible: false,
        });
    };
    showDrawer = (e) => {
        this.setState({
            drawerVisible: true,
            id: e
        });
    }
    showAddRole = () => {
        this.setState({
            roomName: "",
            num: "",
            place: "",
            contain: "",
            menuList: [],
            drawerVisible: true,
            addOrChange: true,
            checkedKeys: [],
            checkedDepartKeys: [],

        });
    }
    roomNameChange = (e) => {
        this.setState({
            roomName: e.target.value,
        });
    }
    numChange = (e) => {
        this.setState({
            num: e.target.value,
        });
    }
    placeChange = (e) => {
        this.setState({
            place: e.target.value,
        });
    }
    containChange = (e) => {
        this.setState({
            contain: e.target.value,
        });
    }
    onSelect = (selectedKeys, info) => {
        console.log('selected', selectedKeys, info);
    }
    departOnCheck = (checkedDepartKeys, info) => {
        this.setState({
            checkedDepartKeys: checkedDepartKeys,
        })
    }
    onCheck = (checkedKeys, info) => {
        this.setState({
            checkedKeys: checkedKeys,
        })
    }
    /////////////////////////////////////////////////////////////////////
    //insertOne
    insertOne = () => {
        const url = global.localhostUrl + "meetingRoom/insertOne";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                roleId: this.state.roleId,
                name: this.state.roomName,
                num: this.state.num,
                place: this.state.place,
                contain: this.state.contain,
                equips: this.state.checkedKeys,
                enables: this.state.checkedDepartKeys,
            }),
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
    //updateOne
    updateOne = () => {
        const url = global.localhostUrl + "meetingRoom/editOne";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                id: this.state.id,
                roleId: this.state.roleId,
                name: this.state.roomName,
                num: this.state.num,
                place: this.state.place,
                contain: this.state.contain,
                equips: this.state.checkedKeys,
                enables: this.state.checkedDepartKeys,
            }),
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
    //showOne
    showOne = (ev, id, name, num, place, contain) => {
        const url = global.localhostUrl + "meetingRoom/showOne?MeetRoomId=" + id;
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
                let checkedKeys = data.data[2].map(item => item.equipId);
                let checkedDepartKeys = data.data[4].map(item => item.departId);
                this.setState({
                    id: id,
                    drawerVisible: true,
                    roomName: data.data[0].name,
                    num: data.data[0].num,
                    place: data.data[0].place,
                    contain: data.data[0].contain,
                    checkedKeys: checkedKeys,
                    checkedDepartKeys: checkedDepartKeys,
                    addOrChange: false,
                })
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
    }
    //banOne
    banOne = (ev, text) => {
        const url = global.localhostUrl + "meetingRoom/banOne?MeetRoomId=" + text;
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
                this.selectAll();
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
    }
    //enableOne
    enableOne = (ev, text) => {
        const url = global.localhostUrl + "meetingRoom/enableOne?MeetRoomId=" + text;
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
                this.selectAll();
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
    }
    //deleteOne
    deleteOne = (ev, text) => {
        console.log(ev)
        console.log(text)
        const url = global.localhostUrl + "meetingRoom/deleteOne?MeetRoomId=" + text;
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
                this.selectAll();
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
    }
    //selectAll
    selectAll = () => {
        const url = global.localhostUrl + "meetingRoom/selectAll";
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
                    dataSource: data.data[0],
                    allMenuList: data.data[1],
                    allDepartList: data.data[2],
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
                title: "名称",
                dataIndex: "name",
                key: "name",
                ...this.getColumnSearchProps("name"),
            }, {
                title: "编号",
                dataIndex: "num",
                key: "num",
                ...this.getColumnSearchProps("num"),
            }, {
                title: "地址",
                dataIndex: "place",
                key: "place",
                ...this.getColumnSearchProps("place"),
            }, {
                title: "容量",
                dataIndex: "contain",
                key: "contain",
                ...this.getColumnSearchProps("contain"),
            }, {
                title: "启用状态",
                dataIndex: "availStatus",
                key: "availStatus",
                render: (item) => {
                    if (item === 1) {
                        return (<Badge status="success">可用</Badge>)
                    } else {
                        return (<Badge status="default">被禁用</Badge>)
                    }
                }
            }, {
                title: "目前状态",
                dataIndex: "nowStatus",
                key: "nowStatus",
                render: (item) => {
                    if (item === 0) {
                        return (<Badge status="success">空闲</Badge>)
                    } else {
                        return (<Badge status="warning">使用中</Badge>)
                    }
                }
            }, {
                title: "操作",
                render: (item) => {
                    return (
                        <div>
                            <Tooltip title="查看">
                                <Button onClick={(ev) => { this.showOne(ev, item.id, item.name, item.num, item.place, item.contain) }}><Icon type={"eye"}></Icon></Button>
                            </Tooltip>
                            <Tooltip title="删除">
                                <Button onClick={(ev) => { this.deleteOne(ev, item.id) }}><Icon style={{ color: "red" }} type={"delete"}></Icon></Button>
                            </Tooltip>
                            {
                                item.availStatus === 0 ?
                                    <Tooltip title="启用">
                                        <Button onClick={(ev) => { this.enableOne(ev, item.id) }}><Icon type="unlock" /></Button>
                                    </Tooltip> :
                                    <Tooltip title="禁用">
                                        <Button onClick={(ev) => { this.banOne(ev, item.id) }}><Icon type="lock" /></Button>
                                    </Tooltip>
                            }
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
                            title={<h2 style={{ float: 'left', marginBottom: -3 }}>会议室管理</h2>}
                            extra={
                                <div style={{ width: 200 }} >
                                    <Row>
                                        <Col span={24}>
                                            <Button type="primary" onClick={this.showAddRole}>添加会议室</Button>
                                        </Col>
                                    </Row>
                                </div>
                            }
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
                        会议室名：
                        <Input value={this.state.roomName} onChange={this.roomNameChange} />
                        会议室编号：
                        <Input value={this.state.num} onChange={this.numChange} />
                        会议室地址
                        <Input value={this.state.place} onChange={this.placeChange} />
                        会议室容量：（人）
                        <Input value={this.state.contain} onChange={this.containChange} />
                        拥有设备：
                        <Tree
                            checkable
                            onSelect={this.onSelect}
                            onCheck={this.onCheck}
                            checkedKeys={this.state.checkedKeys}
                        >
                            {
                                this.state.allMenuList.map((item) => {
                                    return (
                                        <Tree.TreeNode title={item.name} key={item.id}></Tree.TreeNode>
                                    )
                                })
                            }
                        </Tree>
                        可用部门：
                        <Tree
                            checkable
                            onCheck={this.departOnCheck}
                            checkedKeys={this.state.checkedDepartKeys}
                        >
                            <Tree.TreeNode title="所有部门" key={0}>
                                {
                                    this.state.allDepartList.map((item) => {
                                        return (
                                            <Tree.TreeNode title={item.name} key={item.id}></Tree.TreeNode>
                                        )
                                    })
                                }
                            </Tree.TreeNode>
                        </Tree>
                    </Card>
                </Drawer>
            </div>
        );
    }
}

export default MeetRoomManage;
