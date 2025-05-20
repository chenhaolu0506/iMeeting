import React, { Component } from 'react';
import { Table, Card, Col, Row, Button, Tooltip, message, Input, Drawer, Modal, Select } from "antd";
import { SearchOutlined, EditOutlined, CheckOutlined } from "@ant-design/icons";
import global from "../../../global";
import Highlighter from 'react-highlight-words';
class EquipmentRepairManage extends Component {
    componentDidMount() {
        this.selectAll();
    }
    state = {
        meet_room_id: 0,
        equip_id: 0,
        damage_info: "",
        meetRoomList: [
            {
                "id": 1,
                "name": "会议室一",
                "num": "A01",
                "place": "办公大楼A01室",
                "contain": 40,
                "availStatus": 1,
                "nowStatus": 0,
                "tenantId": 1,
                "wifiCode": null,
                "qrcodeAddress": null
            }
        ],
        equipList: [],
        dataSource: [
            {
                id: 1,
                meetRoomName: "会议室一",
                downName: "桥东",
                upTime: "2019-02-08 12:21",
                downTime: "2019-02-09 15:21",
                status: "已修复",
            }
        ],
        equipName: "",
        equipId: 0,
        drawerVisible: false,
        addOrChange: false,
        modalVisible: false,
        searchText: "",
        repairName: "",

    }

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
                    查找
                </Button>
                <Button
                    onClick={() => this.handleReset(clearFilters)}
                    size="small"
                    style={{ width: 90 }}
                >
                    重置
                </Button>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
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
                textToHighlight={text.toString()}
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
    showDeal = (ev, id) => {
        this.setState({
            id: id,
            modalVisible: true,
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
    damage_infoChange = (e) => {
        this.setState({
            damage_info: e.target.value,
        });
    }
    meetRoomChange = (e) => {
        this.setState({
            meet_room_id: e,
        })
    }
    equipChange = (e) => {
        this.setState({
            equip_id: e,
        })
    }
    repairNameChange = (e) => {
        this.setState({
            repairName: e.target.value,
        })
    }

    /////////////////////////////////////////////////////////////////////
    processRepair = () => {
        const url = global.localhostUrl + "equip/processEquipRepair?repairName=" + this.state.repairName + "&id=" + this.state.id;
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
                this.handleCancel();
                this.selectAll();
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
    }

    insertOne = () => {
        const url = global.localhostUrl + "equip/reportDemage";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                meet_room_id: this.state.meet_room_id,
                equip_id: this.state.equip_id,
                damage_info: this.state.damage_info,
            }),
        }).then(res => res.json())
            .then(json => {
                const data = json;
                if (data.status) {
                    message.success("操作成功！")
                }
                this.selectAll();
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
    }
    deleteOne = () => {
        const url = global.localhostUrl + "equip/deleteOne?equipId=" + this.state.equipId;
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

    selectAll = () => {
        this.userGetEquipRepairInfo();
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
                    meetRoomList: data.data[0],
                    equipList: data.data[1],
                })
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
    }

    userGetEquipRepairInfo = () => {
        const url = global.localhostUrl + "equip/getEquipRepairInfos";
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
                title: "会议室名",
                dataIndex: "meetRoomName",
            }, {
                title: "设备名",
                dataIndex: "equipName",
            }, {
                title: "维修人",
                dataIndex: "repairName",
            }, {
                title: "维修时间",
                dataIndex: "repairTime",
            }, {
                title: "状态",
                dataIndex: "status",
            }, {
                title: "报修人",
                dataIndex: "userName",
            }, {
                title: "操作",
                render: (item) => {
                    return (
                        <div>
                            <Tooltip title="修改">
                                <Button onClick={(ev) => { this.showUpdate(ev, item.id, item.name) }}><EditOutlined /></Button>
                            </Tooltip>
                            <Tooltip title="处理">
                                <Button onClick={(ev) => { this.showDeal(ev, item.id) }}><CheckOutlined style={{ color: "red" }} /></Button>
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
                            title={<h2 style={{ float: 'left', marginBottom: -3 }}>设备报修</h2>}
                            extra={
                                <div style={{ width: 200 }} >
                                    <Row>
                                        <Col span={24}>
                                            <Button type="primary" onClick={this.showAddEquip}>我要报修</Button>
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
                    title={<Button href="#" type={"primary"} onClick={this.insertOne}>报修</Button>}
                    placement="right"
                    closable={false}
                    onClose={this.onClose}
                    open={this.state.drawerVisible}
                    width={"60%"}
                >
                    <Card>
                        会议室名称：
                        <Select style={{ width: 120 }} onChange={this.meetRoomChange}>
                            {
                                this.state.meetRoomList.map((item, j) => {
                                    return <Select.Option key={j} value={item.id}>{item.name}</Select.Option>
                                })
                            }
                        </Select>
                        设备名称：
                        <Select style={{ width: 120 }} onChange={this.equipChange}>
                            {
                                this.state.equipList.map((item, j) => {
                                    return <Select.Option key={j} value={item.id}>{item.name}</Select.Option>
                                })
                            }
                        </Select>
                        <br />
                        报修原因：
                        <Input value={this.state.damage_info} onChange={this.damage_infoChange} />
                    </Card>
                </Drawer>
                <Modal
                    open={this.state.modalVisible}
                    onOk={this.processRepair}
                    onCancel={this.handleCancel}
                >
                    维修人：
                    <Input value={this.state.repairName} onChange={this.repairNameChange} />
                </Modal>
            </div>
        );
    }
}

export default EquipmentRepairManage;