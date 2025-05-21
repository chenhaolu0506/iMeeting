import React, { Component } from 'react';
import { Select, Table, Card, Col, Row, Button, Tooltip, message, Input, Drawer, Modal, Upload } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined, SettingOutlined } from "@ant-design/icons";
import global from "../../global";
import Highlighter from "react-highlight-words";

const props = {
    withCredentials: true,
    name: 'file',
    action: global.localhostUrl + "userInfo/insertMore",
    headers: {
        authorization: 'authorization-text',
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers": "DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Origin": "*",
    },
    onChange(info) {
        if (info.file.status !== 'uploading') {
            if (info.file.response.status) {
                message.success(info.file.response.message);
            } else {
                message.warning(info.file.response.message);
            }
        }
    },
};

class PersonManage extends Component {
    componentDidMount() {
        this.selectAll();
    }
    state = {
        dataSource: [],
        worknum: "",
        name: "",
        userId: 0,
        phone: "",
        username: "",
        roleId: "",
        departId: "",
        positionId: "",
        roleIdLast: "",
        departIdLast: "",
        positionIdLast: "",
        drawerVisible: false,
        addOrChange: false,
        modalVisible: false,
        departList: [],
        positionList: [],
        roleList: [],
        departName: "",
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
            departId: "",
            positionId: "",
            roleId: "",
            departIdLast: "",
            positionIdLast: "",
            roleIdLast: "",
        });
    }
    showDelete = (ev, id) => {
        this.setState({
            modalVisible: true,
            userId: id,
        });
    }
    showAddEquip = () => {
        this.setState({
            addOrChange: true,
            drawerVisible: true,
            worknum: "",
            name: "",
            phone: "",
            username: "",
            roleId: "",
            departId: "",
            positionId: "",
        });
    }
    nameChange = (e) => {
        this.setState({
            name: e.target.value,
        });
    }
    worknumChange = (e) => {
        this.setState({
            worknum: e.target.value,
        });
    }
    phoneChange = (e) => {
        this.setState({
            phone: e.target.value,
        });
    }
    departIdChange = (e) => {
        this.setState({
            departId: e,
        });
    }
    positionIdChange = (e) => {
        this.setState({
            positionId: e,
        });
    }
    roleIdChange = (e) => {
        this.setState({
            roleId: e,
        });
    }
    //下载表格案例
    downloadInsertDemo = () => {
        document.getElementById('downloadInsertDemo').click();
    }
    /////////////////////////////////////////////////////////////////////
    // 重置密码
    resetPwd = (ev, id) => {
        const url = global.localhostUrl + "userInfo/resetPwd?userId=" + id;
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
                message.success("密码重置成功！")
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
    }

    showUpdate = (ev, id, name) => {
        this.setState({
            addOrChange: false,
            drawerVisible: true,
            name: name,
            userId: id,
        });
        const url = global.localhostUrl + "userInfo/showOne?id=" + id;
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
                    worknum: data.data.worknum,
                    name: data.data.name,
                    phone: data.data.phone,
                    departId: data.data.departId,
                    positionId: data.data.positionId,
                    roleId: data.data.roleId,
                    departIdLast: data.data.departId,
                    positionIdLast: data.data.positionId,
                    roleIdLast: data.data.roleId,
                    departName: data.data.departName,
                })
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
    }

    insertOne = () => {
        const url = global.localhostUrl + "userInfo/insertOne";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                worknum: this.state.worknum,
                name: this.state.name,
                phone: this.state.phone,
                username: this.state.username,
                roleId: this.state.roleId,
                departId: this.state.departId,
                positionId: this.state.positionId,
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

    updateOne = () => {
        const url = global.localhostUrl + "userInfo/updateOne";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                id: this.state.userId,
                worknum: this.state.worknum,
                name: this.state.name,
                phone: this.state.phone,
                username: this.state.username,
                roleId: this.state.roleId,
                departId: this.state.departId,
                positionId: this.state.positionId,
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
        const url = global.localhostUrl + "userInfo/deleteOne?userId=" + this.state.userId;
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
        const url = global.localhostUrl + "userInfo/selectAllPeople";
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
                    departList: data.data[0],
                    positionList: data.data[1],
                    roleList: data.data[2],
                    dataSource: data.data[3],
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
                title: "工号",
                dataIndex: "worknum",
                key: "worknum",
                ...this.getColumnSearchProps("worknum"),
            }, {
                title: "姓名",
                dataIndex: "name",
                key: "name",
                ...this.getColumnSearchProps("name"),
            }, {
                title: "联系电话",
                dataIndex: "phone",
                key: "phone",
                ...this.getColumnSearchProps("phone"),
            }, {
                title: "用户名",
                dataIndex: "username",
                key: "username",
                ...this.getColumnSearchProps("username"),
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
                            <Tooltip title="重置密码">
                                <Button onClick={(ev) => { this.resetPwd(ev, item.id) }}><SettingOutlined /></Button>
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
                            title={<h2 style={{ float: 'left', marginBottom: -3 }}>员工管理</h2>}
                            extra={
                                <div style={{ width: 380 }} >
                                    <Row>
                                        <Col span={8}>
                                            <Button type="primary" onClick={this.showAddEquip}>单个添加</Button>
                                        </Col>
                                        <Col span={8}>
                                            <Upload {...props} >
                                                <Button type="primary">
                                                    <Icon type="upload" /> 表格添加
                                                </Button>
                                            </Upload>
                                        </Col>
                                        <Col span={8}>
                                            <form
                                                method="post"
                                                action="http://39.106.56.132:8080/userInfo/downloadInsertDemo"
                                            >
                                                <button id={"downloadInsertDemo"} type="submit" style={{ display: "none" }}>下载表格案例!</button>
                                            </form>
                                            <Button onClick={this.downloadInsertDemo}>下载表格案例</Button>
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
                        姓名：
                        <Input value={this.state.name} onChange={this.nameChange} />
                        工号：
                        <Input value={this.state.worknum} onChange={this.worknumChange} />
                        联系电话：
                        <Input value={this.state.phone} onChange={this.phoneChange} />
                        部门：
                        <Select value={this.state.departId} style={{ width: "100%" }} onChange={this.departIdChange}>
                            {
                                this.state.departList.map(item => {
                                    return (
                                        <Select.Option value={item.id} key={item.id}>
                                            {item.name}
                                        </Select.Option>
                                    )
                                })
                            }
                        </Select>
                        职位：
                        <Select value={this.state.positionId} style={{ width: "100%" }} onChange={this.positionIdChange}>
                            {
                                this.state.positionList.map(item => {
                                    return (
                                        <Select.Option value={item.id} key={item.id}>
                                            {item.name}
                                        </Select.Option>
                                    )
                                })
                            }
                        </Select>
                        角色：
                        <Select value={this.state.roleId} style={{ width: "100%" }} onChange={this.roleIdChange}>
                            {
                                this.state.roleList.map(item => {
                                    return (
                                        <Select.Option value={item.id} key={item.id}>
                                            {item.name}
                                        </Select.Option>
                                    )
                                })
                            }
                        </Select>
                    </Card>
                </Drawer>
                <Modal
                    open={this.state.modalVisible}
                    onOk={this.deleteOne}
                    onCancel={this.handleCancel}
                    okText={"确定"}
                    cancelText={"我再想想"}
                >
                    <h3>您确定要删除此员工吗</h3>
                </Modal>
            </div>
        );
    }
}

export default PersonManage;