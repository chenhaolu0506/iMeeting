import React, { Component } from 'react';
import { Table, Card, Col, Row, Button, Tooltip, message, Input, Drawer, Modal } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import global from "../../../global";
import Highlighter from 'react-highlight-words';
import WeeklyMeetingCreateForm from './tools/WeeklyMeetingCreateForm';

class WeeklyMeeting extends Component {
    componentDidMount() {
        this.getEffectiveMeetingRoom();
        this.userFindAll();
    }
    state = {
        dataSource: [],
        roomList: [],
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
                    搜索
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
    saveFormRef = (formRef) => {
        this.formRef = formRef;
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
                console.log(e);
                alert('系统错误');
            });
    }
    cancelOne = (id) => {
        const url = global.localhostUrl + "weeklyMeeting/cancelWeeklyMeeting?id=" + id;
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
                this.userFindAll();
            }).catch(function (e) {
                console.log(e);
                alert('系统错误');
            });
    }
    //用户端查看所有周会
    userFindAll = () => {
        const url = global.localhostUrl + "weeklyMeeting/userFindAllWeeklyMeetings";
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
                console.log(e);
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

            const url = global.localhostUrl + "weeklyMeeting/setupWeeklyMeeting";
            fetch(url, {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify({
                    beginTime: values.beginTime.format("YYYY-MM-DD"),
                    overTime: values.overTime.format("YYYY-MM-DD"),
                    week: values.week,
                    meetRoomId: values.meetRoomId,
                    meetBegin: values.meetBegin.format("HH:mm"),
                    meetOver: values.meetOver.format("HH:mm"),
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
                    console.log(e);
                    alert('系统错误');
                });
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
            }, {
                title: "创建时间",
                dataIndex: "createTime",
                key: "createTime",
                ...this.getColumnSearchProps("createTime")
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
                            <Tooltip title="取消周会">
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
                            title={<h2 style={{ float: 'left', marginBottom: -3 }}>每周例会</h2>}
                            extra={
                                <div style={{ width: 200 }} >
                                    <Row>
                                        <Col span={24}>
                                            <Button type="primary" onClick={this.showAddEquip}>申请例会</Button>
                                        </Col>
                                    </Row>
                                </div>
                            }
                        >
                            <Table rowKey={record => record.id} className={'table'} columns={columns} dataSource={this.state.dataSource} />
                        </Card>
                    </Col>
                </Row>
                <WeeklyMeetingCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    roomList={this.state.roomList}
                    visible={this.state.drawerVisible}
                    onClose={this.onClose}
                    onCreate={this.handleCreate}
                    getOthersList={this.getOthersList}
                >
                </WeeklyMeetingCreateForm>
                <Modal
                    visible={this.state.modalVisible}
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

export default WeeklyMeeting;
