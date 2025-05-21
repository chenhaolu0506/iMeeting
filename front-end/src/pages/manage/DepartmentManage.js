import React, { Component } from 'react';
import { Table, Card, Col, Row, Button, Tooltip, message, Input, Drawer, Modal } from "antd";
import { DeleteOutlined, EditOutlined, SearchOutlined } from "@ant-design/icons";
import global from "../../global";
import Highlighter from 'react-highlight-words';

class DepartManage extends Component {
    componentDidMount() {
        this.selectAllDepartments();
        this.selectAllPositions();
    }
    state = {
        dataSource: [],
        departName: "",
        departId: 0,
        positionList: [],
        positionId: 0,
        positionName: "",
        positionVisible: false,
        drawerVisible: false,
        addOrChange: false,
        addPositionVisible: false,
        modalVisible: false,
        positionModalVisible: false,
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

    showPosition = (ev, id, name) => {
        this.setState({
            positionVisible: true,
            positionId: id,
            positionName: name,
        })
    }
    positionNameChange = (e) => {
        this.setState({
            positionName: e.target.value,
        })
    }
    handleCancel = (e) => {
        this.setState({
            modalVisible: false,
            positionVisible: false,
            positionModalVisible: false,
            addPositionVisible: false,
        });
    }
    onClose = (e) => {
        this.setState({
            drawerVisible: false,
        });
    }
    showDeletePosition = (ev, id) => {
        this.setState({
            positionModalVisible: true,
            positionId: id,
        });
    }
    showDelete = (ev, id) => {
        this.setState({
            modalVisible: true,
            departId: id,
        });
    }
    showUpdate = (ev, id, name) => {
        this.setState({
            addOrChange: false,
            drawerVisible: true,
            departName: name,
            departId: id,
        });
    }
    showAddPosition = () => {
        this.setState({
            addPositionVisible: true,
        });
    }
    showAddDepart = () => {
        this.setState({
            addOrChange: true,
            drawerVisible: true,
            departName: "",
        });
    }
    departNameChange = (e) => {
        this.setState({
            departName: e.target.value,
        });
    }

    /////////////////////////////////////////////////////////////////////
    editPosition = () => {
        const url = global.localhostUrl + "position/editPosition";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                id: this.state.positionId,
                name: this.state.positionName,
                departId: this.state.departId,
            }),
        }).then(res => res.json())
            .then(json => {
                const data = json;
                if (data.status) {
                    message.success("操作成功！");
                }
                this.selectAllDepartments();
            }).catch(function (e) {
                console.log("fetch failed");
                alert('系统错误');
            });
    }

    insertPosition = () => {
        const url = global.localhostUrl + "position/insertPosition?departId=" + this.state.departId + "&positionName=" + this.state.positionName;
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
                    message.success("操作成功！");
                    this.handleCancel();
                }
                this.selectAllPositions();
            }).catch(function (e) {
                console.log("fetch failed");
                alert('系统错误');
            });
    }

    insertDepartment = () => {
        const url = global.localhostUrl + "department/insertOne?departName=" + this.state.departName;
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
                    message.success("操作成功！");
                }
                this.selectAllDepartments();
            }).catch(function (e) {
                console.log("fetch failed");
                alert('系统错误');
            });
    }

    editDepartment = () => {
        const url = global.localhostUrl + "department/editOne?departName=" + this.state.departName + "&departId=" + this.state.departId;
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
                this.selectAllDepartments();
            }).catch(function (e) {
                console.log("fetch failed");
                alert('系统错误');
            });
    }

    deletePosition = () => {
        const url = global.localhostUrl + "position/deletePosition?positionId=" + this.state.positionId;
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
                    this.handleCancel();
                } else {
                    message.error(data.message);
                }
                this.selectAllPositions();
            }).catch(function (e) {
                console.log("fetch failed");
                alert('系统错误');
            });
    }

    deleteDepartment = () => {
        const url = global.localhostUrl + "department/deleteOne?departId=" + this.state.departId;
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
                this.selectAllDepartments();
            }).catch(function (e) {
                console.log("fetch failed");
                alert('系统错误');
            });
    }

    selectAllPositions = () => {
        const url = global.localhostUrl + "position/selectAllDepartments";
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
                    positionList: data.data[0],
                })
            }).catch(function (e) {
                console.log("fetch failed");
                alert('系统错误');
            });
    }

    selectAllDepartments = () => {
        const url = global.localhostUrl + "department/selectAll";
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
                console.log("fetch failed");
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
                title: "操作",
                render: (item) => {
                    return (
                        <div>
                            <Tooltip title="修改">
                                <Button onClick={(ev) => { this.showUpdate(ev, item.id, item.name) }}><EditOutlined /></Button>
                            </Tooltip>
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
                            title={<h2 style={{ float: 'left', marginBottom: -3 }}>部门管理</h2>}
                            extra={
                                <div style={{ width: 200 }} >
                                    <Row>
                                        <Col span={24}>
                                            <Button type="primary" onClick={this.showAddDepart}>添加部门</Button>
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
                            <Button href="#" type={"primary"} onClick={this.insertDepartment}>添加</Button>
                            :
                            <Button href="#" type={"primary"} onClick={this.editDepartment}>保存修改</Button>
                    }
                    placement="right"
                    closable={false}
                    onClose={this.onClose}
                    open={this.state.drawerVisible}
                    width={"60%"}
                >
                    <Card>
                        部门名称：
                        <Input value={this.state.departName} onChange={this.departNameChange} />
                        <br />
                        <div style={{ display: this.state.addOrChange ? "none" : "block" }}>
                            所属职位：
                            <Button type="primary" onClick={this.showAddPosition}>添加职位</Button>
                            {
                                this.state.positionList.map((item) => {
                                    if (item.departId === this.state.departId) {
                                        return (
                                            <div key={item.id}>
                                                <Button onClick={ev => { this.showPosition(ev, item.id, item.name) }}>
                                                    {item.name}
                                                </Button>
                                                <Tooltip title="删除">
                                                    <Button onClick={(ev) => { this.showDeletePosition(ev, item.id) }}><DeleteOutlined style={{ color: "red" }} /></Button>
                                                </Tooltip>
                                                <br />
                                            </div>
                                        )
                                    } else {
                                        return null;
                                    }
                                })
                            }
                        </div>
                    </Card>
                </Drawer>
                <Modal
                    open={this.state.modalVisible}
                    onOk={this.deleteDepartment}
                    onCancel={this.handleCancel}
                    okText={"确定"}
                    cancelText={"我再想想"}
                >
                    <h3>您确定要删除此部门吗</h3>
                </Modal>
                <Modal
                    visible={this.state.positionModalVisible}
                    onOk={this.deletePosition}
                    onCancel={this.handleCancel}
                    okText={"确定"}
                    cancelText={"我再想想"}
                >
                    <h3>您确定要删除此职位吗</h3>
                </Modal>
                <Modal
                    title={"职位信息"}
                    open={this.state.positionVisible}
                    onOk={this.editPosition}
                    onCancel={this.handleCancel}
                    okText={"保存"}
                    cancelText={"取消"}
                >
                    <Input value={this.state.positionName} onChange={this.positionNameChange} />
                </Modal>
                <Modal
                    title={"添加职位"}
                    open={this.state.addPositionVisible}
                    onOk={this.insertPosition}
                    onCancel={this.handleCancel}
                    okText={"添加"}
                    cancelText={"取消"}
                >
                    <Input value={this.state.positionName} onChange={this.positionNameChange} />
                </Modal>
            </div>
        );
    }
}

export default DepartManage;