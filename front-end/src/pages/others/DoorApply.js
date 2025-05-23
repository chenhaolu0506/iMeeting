import React, { Component } from 'react';
import { Table, Card, Col, Row, Button, Tooltip, message, Input } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import global from "../../global";
import Highlighter from 'react-highlight-words';
import OpenDoorCreateForm from "./tools/OpenDoorCreateForm";

class DoorApply extends Component {
    componentDidMount() {
        this.getEffectiveMeetingRoom();
        this.userShow();
    }
    state = {
        dataSource: [
        ],
        roomList: [],
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
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    /////////////////////////////////////////////////////////////////////
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
    //获取会议室列表
    getEffectiveMeetingRoom = () => {
        const url = global.localhostUrl + "meetingRoom/getEffectiveMeetingRoom";
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
                    roomList: data.data,
                })
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
    }
    //提交预定
    handleCreate = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            const url = global.localhostUrl + "openApply/openRequest";
            fetch(url, {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify({
                    beginDate: values.beginDate.format("YYYY-MM-DD"),
                    overDate: values.overDate.format("YYYY-MM-DD"),
                    meetRoomId: values.meetRoomId,
                    beginTime: values.beginTime.format("HH:mm"),
                    overTime: values.overTime.format("HH:mm"),
                    note: values.note,
                }),
            }).then(res => res.json())
                .then(json => {
                    const data = json;
                    if (data.status) {
                        message.success(data.message)
                        this.setState({
                            bookVisible: false,
                        })
                        form.resetFields();
                    } else {
                        message.error(data.message);
                    }

                }).catch(function (e) {
                    console.log("fetch fail");
                    alert('系统错误');
                });
        });
    }
    // 显示申请列表
    userShow = () => {
        const url = global.localhostUrl + "openApply/showOpenRequest";
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
                })
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
    }

    cancelOne = (id) => {
        const url = global.localhostUrl + "openApply/cancelOpenRequest?id=" + id;
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
                this.userShow();
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
                dataIndex: "meetroom",
                render: (item) => {
                    return item.name
                }
            }, {
                title: "开始时间",
                dataIndex: "beginDate",
                key: "beginDate",
                ...this.getColumnSearchProps("beginDate")
            }, {
                title: "结束时间",
                dataIndex: "overDate",
                key: "overDate",
                ...this.getColumnSearchProps("overDate")
            }, {
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
                            <Tooltip title="取消申请">
                                <Button onClick={() => { this.cancelOne(item.id) }}><DeleteOutlined style={{ color: "red" }} /></Button>
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
                            title={<h2 style={{ float: 'left', marginBottom: -3 }}>开门申请</h2>}
                            extra={
                                <div style={{ width: 200 }} >
                                    <Row>
                                        <Col span={24}>
                                            <Button type="primary" onClick={this.showAddEquip}>申请</Button>
                                        </Col>
                                    </Row>
                                </div>
                            }
                        >
                            <Table rowKey={record => record.id} className={'table'} columns={columns} dataSource={this.state.dataSource} />
                        </Card>
                    </Col>
                </Row>
                <OpenDoorCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    roomList={this.state.roomList}
                    open={this.state.drawerVisible}
                    onClose={this.onClose}
                    onCreate={this.handleCreate}
                    getOthersList={this.getOthersList}
                >
                </OpenDoorCreateForm>
            </div>
        );
    }
}
export default DoorApply;