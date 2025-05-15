import React, { Component } from "react";
import { Table, Button, message, Modal, Tooltip, Input } from "antd";
import { EyeOutlined, FileOutlined, OrderedListOutlined, SearchOutlined, SnippetsOutlined, DeleteOutlined } from "@ant-design/icons";
import global from "../../../global";
import '.../../css/meeting.less';
import moment from 'moment';
import OneMeetingDrawer from "./OneMeetingDrawer";
import Highlighter from 'react-highlight-words';
import OutlineDrawer from "./OutlineDrawer";
import TaskDrawer from "./TaskDrawer";
import FileDrawer from "./FileDrawer";

class MyMeetingInfo extends Component {
    componentDidMount() {
        this.reserveIndex();
    }
    state = {
        bookRule: {
            id: 1,
            begin: "07:00",
            over: "18:30",
            dateLimit: "7",
            timeLimit: "120",
            timeInterval: "15",
            tenantId: 1
        },
        bookTool: [],
        roomList: [
            {
                "id": 1,
                "name": "A01会议室",
                "num": "A01",
                "place": "笃行楼一楼A01室",
                "contain": 40,
                "availStatus": 1,
                "nowStatus": 0,
                "tenantId": 1
            },
        ],
        roomTools: [],
        bookVisible: false,
        deleteVisible: false,
        stopVisible: false,
        othersList: [],
        searchDate: "2019-01-17",
        searchText: '',
        meetingId: "",
        changeAble: true,
        coordinate: false,
        dataSource: [],
        outLineVisible: false,
        taskVisible: false,
        fileVisible: false,
        outLineList: [],
        taskList: [],
        fileList: [],

    }
    //表格查询...this.getColumnSearchProps("name"),
    getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
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

    onClose = () => {
        this.setState({
            bookVisible: false,
        });
    };
    showDrawer = () => {
        this.setState({
            bookVisible: true,
        });
    };
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }
    getOthersList = (e) => {
        console.log(e)
        this.setState({
            othersList: e
        })
    }
    showDeleteModal = (ev, text) => {
        this.setState({
            deleteVisible: true,
            meetingId: text,
        })
    }
    handleOk = (e) => { //点击确定取消会议
        console.log(e);
        console.log("取消会议，编号", this.state.meetingId);
        this.cancelMeeting();
        this.setState({
            deleteVisible: false,
        });
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            deleteVisible: false,
        });
    }
    showStopModal = (ev, text) => {
        this.setState({
            stopVisible: true,
            meetingId: text,
        })
    }
    stopInAdvance = (e) => {
        console.log(e);
        console.log("提早结束会议，编号", this.state.meetingId);
        this.advanceOver();
        this.setState({
            stopVisible: false,
        });
    }

    stopCancel = (e) => {
        console.log(e);
        this.setState({
            stopVisible: false,
        });
    }

    outLineClose = () => {
        this.setState({
            outLineVisible: false,
        });
    }
    taskClose = () => {
        this.setState({
            taskVisible: false,
        });
    }
    fileClose = () => {
        this.setState({
            fileVisible: false,
        });
    }
    ////////////////////////////////////////////fetch接口//////////////////////////////////////////////////////////////////
    // 显示会议大纲
    findByMeeting = (ev, id) => {
        const url = global.localhostUrl + "outline/findMeetingOutline?meetingId=" + id;
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
                    outLineList: data.data,
                    outLineVisible: true,
                    meetingId: id,
                })
            }).catch(function (e) {
                console.log(e);
                alert('系统错误');
            });
    }
    // 查询会议文件
    findByMeeting_file = (ev, id) => {
        const url = global.localhostUrl + "file/fineOneMeetingFileOnReserve?meetingId=" + id;
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
                    fileList: data.data,
                    fileVisible: true,
                    meetingId: id,
                })
            }).catch(function (e) {
                console.log(e);
                alert('系统错误');
            });
    }
    // 查询会议任务
    findByMeeting_task = (ev, id) => {
        const url = global.localhostUrl + "task/findByMeeting?meetingId=" + id;
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
                    taskList: data.data,
                    taskVisible: true,
                    meetingId: id,
                })
            }).catch(function (e) {
                console.log(e);
                alert('系统错误');
            });
    }
    // 主页
    reserveIndex = () => {
        const url = global.localhostUrl + "meeting/reserveIndex";
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
                    roomList: data.data[2],
                    bookRule: data.data[0],
                    bookTool: data.data[1],
                    roomBookInfo: data.data[3],
                    roomTools: data.data[4],
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

            const url = global.localhostUrl + (this.state.coordinate ? "meeting/coordinateMeeting" : "meeting/editOneServer");
            fetch(url, {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: this.state.coordinate ? JSON.stringify({
                    meetingId: this.state.meetingId,
                    topic: values.title,
                    content: values.description,
                    meetRoomId: values.meetingRoom,
                    // reserveDate:values.dateTime.format("YYYY-MM-DD"),
                    // beginTime:values.startTime.format("HH:mm"),
                    lastTime: values.continuedTime,
                    prepareTime: values.prepareTime,
                    joinPeopleId: values.guests,
                    outsideJoinPersons: this.state.othersList,
                    beforeOrLast: values.beforeOrLast,
                    note: values.coordinateNote,
                }) : JSON.stringify({
                    meetingId: this.state.meetingId,
                    topic: values.title,
                    content: values.description,
                    meetRoomId: values.meetingRoom,
                    reserveDate: values.dateTime.format("YYYY-MM-DD"),
                    beginTime: values.startTime.format("HH:mm"),
                    lastTime: values.continuedTime,
                    prepareTime: values.prepareTime,
                    joinPeopleId: values.guests,
                    outsideJoinPersons: this.state.othersList,
                }),
            }).then(res => res.json())
                .then(json => {
                    const data = json;
                    if (data.status) {
                        message.success("预定信息提交成功！")
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
        })
    }

    //showOneReserveDetail显示一个会议的具体信息
    showOneReserveDetail = (ev, text, status) => {
        this.setState({
            changeAble: status
        })
        const form = this.formRef.props.form;

        const url = global.localhostUrl + "meeting/showOneReserveDetail?meetingId=" + text;
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
                const others = data.data[0].outsideJoinPersons.map(item => item.name);
                form.setFieldsValue({
                    title: data.data[0].topic,
                    meetingRoom: data.data[0].meetRoomId,
                    description: data.data[0].content,
                    guests: data.data[0].joinPeopleId,
                    dateTime: moment(data.data[0].reserveDate, "YYYY-MM-DD"),
                    startTime: moment(data.data[0].beginTime),
                    prepareTime: data.data[0].prepareTime,
                    continuedTime: data.data[0].lastTime,
                    others: others,
                })
                this.setState({
                    othersList: data.data[0].outsideJoinPersons,
                    dataSource: data.data[1],
                })
            }).catch(function (e) {
                console.log(e);
                alert('系统错误');
            });
        this.setState({
            bookVisible: true,
            meetingId: text,
        })

    }
    // 取消会议
    cancelMeeting = () => {
        const url = global.localhostUrl + "meeting/cancelMeeting?meetingId=" + this.state.meetingId;
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
                message.success("会议取消成功！")
            }).catch(function (e) {
                console.log(e);
                alert('系统错误');
            });
    }
    //提前终止会议
    advanceOver = () => {
        const url = global.localhostUrl + "meeting/advanceOver?meetingId=" + this.state.meetingId;
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
                message.success("会议提前终止成功！")
            }).catch(function (e) {
                console.log(e);
                alert('系统错误');
            });
    }


    render() {
        const actionButtons = {
            view: (id, status, title) => (
                <Tooltip title={title}>
                    <Button onClick={(ev) => this.showOneReserveDetail(ev, id, status)}>
                        <EyeOutlined />
                    </Button>
                </Tooltip>
            ),
            deleteModal: (id, title) => (
                <Tooltip title={title}>
                    <Button onClick={(ev) => this.showDeleteModal(ev, id)}>
                        <DeleteOutlined style={{ color: 'red' }} />
                    </Button>
                </Tooltip>
            ),
            stop: (id, title) => (
                <Tooltip title={title}>
                    <Button onClick={(ev) => this.showStopModal(ev, id)}>
                        <DeleteOutlined style={{ color: 'red' }} />
                    </Button>
                </Tooltip>
            ),
            findOutline: (id, title) => (
                <Tooltip title={title}>
                    <Button onClick={(ev) => this.findByMeeting(ev, id)}>
                        <OrderedListOutlined />
                    </Button>
                </Tooltip>
            ),
            findTask: (id, title) => (
                <Tooltip title={title}>
                    <Button onClick={(ev) => this.findByMeeting_task(ev, id)}>
                        <SnippetsOutlined />
                    </Button>
                </Tooltip>
            ),
            findFile: (id, title) => (
                <Tooltip title={title}>
                    <Button onClick={(ev) => this.findByMeeting_file(ev, id, false)}>
                        <FileOutlined />
                    </Button>
                </Tooltip>
            ),
        };
        const columns = [{
            title: '开始时间',
            dataIndex: 'begin',
            key: 'begin',
        }, {
            title: '结束时间',
            dataIndex: 'over',
            key: 'over',
        }, {
            title: '主题',
            dataIndex: 'topic',
            key: 'topic',
            ...this.getColumnSearchProps("topic"),
        }, {
            title: '预定人',
            dataIndex: 'peopleName',
            key: 'peopleName',
            ...this.getColumnSearchProps("peopleName"),
        }, {
            title: '联系电话',
            dataIndex: 'phone',
            key: 'phone',
            ...this.getColumnSearchProps("phone"),
        }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (text) => {
                switch (text) {
                    case "预约失败":
                        return <div style={{ color: "#f96868" }}>{text}</div>
                    case "预约成功":
                        return <div style={{ color: "#46be8a" }}>{text}</div>
                    case "预约中":
                        return <div style={{ color: "#f2a654" }}>{text}</div>
                    case "会议进行":
                        return <div style={{ color: "#f96868" }}>{text}</div>
                    case "会议结束":
                        return <div style={{ color: "#8c8c8c" }}>{text}</div>
                    case "取消会议":
                        return <div style={{ color: "#f96868" }}>{text}</div>
                    default:
                        return <div>{text}</div>
                }
            }
        }, {
            title: '操作',
            render: (text) => {
                const buttonsByStatus = {
                    "预约失败": actionButtons.view(text.id, false, "查看"),
                    "预约成功": [
                        actionButtons.view(text.id, true, "查看"),
                        actionButtons.deleteModal(text.id, "取消会议"),
                        actionButtons.findOutline(text.id, "查看会议大纲"),
                        actionButtons.findTask(text.id, "查看会议任务"),
                        actionButtons.findFile(text.id, "查看会议文件"),
                    ],
                    "预约中": [
                        actionButtons.view(text.id, true, "查看"),
                        actionButtons.deleteModal(text.id, "取消预约"),
                        actionButtons.findOutline(text.id, "查看会议大纲"),
                        actionButtons.findTask(text.id, "查看会议任务"),
                        actionButtons.findFile(text.id, "查看会议文件"),
                    ],
                    "会议进行中": [
                        actionButtons.view(text.id, false, "查看"),
                        actionButtons.stop(text.id, "提前结束会议"),
                        actionButtons.findOutline(text.id, "查看会议大纲"),
                        actionButtons.findTask(text.id, "查看会议任务"),
                        actionButtons.findFile(text.id, "查看会议文件"),
                    ],
                    "会议结束": [
                        actionButtons.view(text.id, false, "查看"),
                        actionButtons.findOutline(text.id, "查看会议大纲"),
                        actionButtons.findTask(text.id, "查看会议任务"),
                        actionButtons.findFile(text.id, "查看会议文件"),
                    ],
                    "取消会议": [
                        actionButtons.view(text.id, false, "查看"),
                    ],
                }
                return (
                    <div>
                        {buttonsByStatus[text.status] || null}
                    </div>
                )
            }
        }];
        return (
            <div>
                {
                    console.log(this.props.dataSource)
                }
                <Table rowKey={record => record.id} className={'table'} columns={columns} dataSource={this.props.dataSource} />
                <OneMeetingDrawer
                    wrappedComponentRef={this.saveFormRef}
                    roomList={this.state.roomList || []}
                    visible={this.state.bookVisible}
                    othersList={this.state.othersList}
                    onClose={this.onClose}
                    onCreate={this.handleCreate}
                    getOthersList={this.getOthersList}
                    changeAble={this.state.changeAble}
                    coordinate={false}
                    dataSource={this.state.dataSource}
                >
                </OneMeetingDrawer>
                <OutlineDrawer
                    findByMeeting={this.findByMeeting}
                    meetingId={this.state.meetingId}
                    onClose={this.outLineClose}
                    visible={this.state.outLineVisible}
                    outLineList={this.state.outLineList}
                >
                </OutlineDrawer>
                <TaskDrawer
                    findByMeeting={this.findByMeeting_task}
                    meetingId={this.state.meetingId}
                    onClose={this.taskClose}
                    visible={this.state.taskVisible}
                    taskList={this.state.taskList}
                >
                </TaskDrawer>
                <FileDrawer
                    findByMeeting={this.findByMeeting_file}
                    meetingId={this.state.meetingId}
                    onClose={this.fileClose}
                    visible={this.state.fileVisible}
                    fileList={this.state.fileList}
                >
                </FileDrawer>
                <Modal
                    open={this.state.deleteVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText={"确定"}
                    cancelText={"再想想"}
                >
                    <h2>您确定取消本次会议吗？</h2>
                </Modal>
                <Modal
                    open={this.state.stopVisible}
                    onOk={this.stopInAdvance}
                    onCancel={this.stopCancel}
                    okText={"确定"}
                    cancelText={"再想想"}
                >
                    <h2>您确定结束本次会议吗？</h2>
                </Modal>
            </div>
        );
    }
}

export default MyMeetingInfo;