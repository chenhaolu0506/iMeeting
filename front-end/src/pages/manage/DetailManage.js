import React, { Component } from 'react';
import { Table, Card, Col, Row, Button, Tooltip, message, Input, Drawer, Modal } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import global from "../../../global";
import Highlighter from 'react-highlight-words';
class DetailManage extends Component {
    componentDidMount() {
        this.selectAll();
    }
    state = {
        dataSource: [
            {
                id: 1,
                a1: "桥东",
                a2: "副院长",
                a3: "修改会议参数",
                a4: "2019-02-21 20:24",
            },
            {
                id: 2,
                a1: "桥东",
                a2: "副院长",
                a3: "修改会议参数",
                a4: "2019-02-21 20:20",
            },
            {
                id: 3,
                a1: "郭精明",
                a2: "管理员",
                a3: "修改角色管理参数",
                a4: "2019-02-20 20:19",
            }
        ],
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
                this.selectAll();
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
    }

    updateOne = () => {
        const url = global.localhostUrl + "equip/updateOne?equipName=" + this.state.equipName + "&equipId=" + this.state.equipId;
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
        const url = global.localhostUrl + "equip/selectAll";
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
                    addOrChange: false,
                    modalVisible: false,
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
                title: "管理员",
                dataIndex: "a1",
                key: "a1",
                ...this.getColumnSearchProps("a1")
            }, {
                title: "角色",
                dataIndex: "a2",
                key: "a2",
                ...this.getColumnSearchProps("a2")
            }, {
                title: "操作内容",
                dataIndex: "a3",
                key: "a3",
                ...this.getColumnSearchProps("a3")
            }, {
                title: "操作时间",
                dataIndex: "a4",
                key: "a4",
                ...this.getColumnSearchProps("a4")
            }, {
                title: "操作",
                render: (item) => {
                    return (
                        <div>
                            <Tooltip title="删除">
                                <Button onClick={(ev) => { this.showDelete(ev, item.id) }}><DeleteOutlined style={{ color: "red" }} /></Button>
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
                            title={<h2 style={{ float: 'left', marginBottom: -3 }}>日志管理</h2>}
                            extra={
                                <div style={{ width: 200 }} >
                                    <Row>
                                        <Col span={24}>
                                            <Button type="primary" onClick={this.showAddEquip}>导出日志</Button>
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
                    open={this.state.drawerVisible}
                    width={"60%"}
                >
                    <Card>
                        设备名称：
                        <Input value={this.state.equipName} onChange={this.equipNameChange} />
                    </Card>
                </Drawer>
                <Modal
                    open={this.state.modalVisible}
                    onOk={this.deleteOne}
                    onCancel={this.handleCancel}
                    okText={"确定"}
                    cancelText={"我再想想"}
                >
                    <h3>您确定要删除此设备吗</h3>
                </Modal>
            </div>
        );
    }
}

export default DetailManage;