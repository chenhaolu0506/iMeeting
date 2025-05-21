import React, { Component } from 'react';
import { Table, Card, Col, Row, Button, Select, DatePicker, Input, Tooltip, message } from "antd";
import global from '../../global';
import moment from "moment";
import Highlighter from 'react-highlight-words';
import OneMeetingDrawer from "../meeting/tools/OneMeetingDrawer";

class MeetingInfoManage extends Component {
    componentDidMount() {
        this.toFindMeetingBySpecification();
    }
    state = {
        dataSource: [],
        meetRoomList: [],
        departList: [],
        othersList: [],
        topic: "",
        selectBegin: "",
        selectOver: "",
        meetRoomId: "",
        departmentId: "",
        reserveName: "",
        status: "",
        drawerVisible: false,
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

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }
    onClose = (e) => {
        this.setState({
            drawerVisible: false,
        });
    }
    topicChange = (e) => {
        this.setState({
            topic: e.target.value,
        })
    }
    meetRoomIdChange = (e) => {
        this.setState({
            meetRoomId: e,
        })
    }
    departmentIdChange = (e) => {
        this.setState({
            departmentId: e,
        })
    }
    reserveNameChange = (e) => {
        this.setState({
            reserveName: e.target.value,
        })
    }
    statusChange = (e) => {
        this.setState({
            status: e,
        })
    }
    timeChange = (date, dateString) => {
        this.setState({
            selectBegin: dateString[0],
            selectOver: dateString[1],
        })
    }
    /////////////////////////////////////////////////////////////////////
    //显示一个会议的具体信息
    showOneReserveDetail = (ev, text) => {
        console.log(ev)
        console.log(text)
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
                    drawerVisible: true,
                })
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
        this.setState({
            bookVisible: true,
            meetingId: text,
        })

    }
    // 查询
    findMeetingBySpecification = () => {
        if (this.state.selectBegin === "") {
            return message.warning("请填写查询时间区间！")
        }
        const url = global.localhostUrl + "meeting/findMeetingBySpecification";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                topic: this.state.topic,
                selectBegin: this.state.selectBegin,
                selectOver: this.state.selectOver,
                meetRoomId: this.state.meetRoomId,
                departmentId: this.state.departmentId,
                reserveName: this.state.reserveName,
                status: this.state.status,
            }),
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
    // 导出会议记录
    exportMeetingRecord = () => {
        if (this.state.selectBegin === "") {
            return message.warning("请填写查询时间区间！")
        }
        const url = global.localhostUrl + "meeting/exportMeetingRecord";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                topic: this.state.topic,
                selectBegin: this.state.selectBegin,
                selectOver: this.state.selectOver,
                meetRoomId: this.state.meetRoomId,
                departmentId: this.state.departmentId,
                reserveName: this.state.reserveName,
                status: this.state.status,
            }),
        }).then(res => res.json())
            .then(json => {
                const data = json;
                console.log(data);
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
    }
    // 跳转条件查找预定记录页面,返回显示会议室id和名字，部门id和名字
    toFindMeetingBySpecification = () => {
        const url = global.localhostUrl + "meeting/toFindMeetingBySpecification";
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
                    departList: data.data[1],
                })
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
    }
    //取消会议
    cancelMeeting = (ev, id) => {
        const url = global.localhostUrl + "meeting/cancelMeeting?meetingId=" + id;
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
                console.log("fetch fail");
                alert('系统错误');
            });
    }
    //////
    render() {
        const columns = [
            {
                title: "序号",
                key: "id",
                render: (item, data, i) => {
                    return (<div>{i + 1}</div>)
                }
            }, {
                title: "主题",
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
                title: "发起人",
                dataIndex: "peopleName",
                key: "peopleName",
                ...this.getColumnSearchProps("peopleName"),
            }, {
                title: "部门",
                dataIndex: "departName",
                key: "departName",
                ...this.getColumnSearchProps("departName"),
            }, {
                title: "会议室",
                dataIndex: "meetRoom",
                key: "meetRoom",
                ...this.getColumnSearchProps("meetRoom"),
            }, {
                title: "会议状态",
                dataIndex: "status",
                key: "status",
                ...this.getColumnSearchProps("status"),
                render: (item) => {
                    switch (item) {
                        case 6:
                            return ("预约失败");
                        case 1:
                            return ("预约成功");
                        case 2:
                            return ("预约中");
                        case 3:
                            return ("会议进行中");
                        case 4:
                            return ("会议结束");
                        case 5:
                            return ("取消会议");
                        case 7:
                            return ("调用失败");
                        case 8:
                            return ("调用中");
                        default:
                            return <div>{item}</div>;
                    }

                }
            }, , {
                title: "创建时间",
                dataIndex: "createTime",
                key: "createTime",
                ...this.getColumnSearchProps("createTime"),
            }, {
                title: "操作",
                render: (item) => {
                    return (
                        <div>
                            <Tooltip title="查看">
                                <Button onClick={(ev) => { this.showOneReserveDetail(ev, item.id) }}><EyeOutlined /></Button>
                            </Tooltip>
                            {
                                item.status === "预约成功" ? <Tooltip title="取消会议">
                                    <Button onClick={(ev) => { this.cancelMeeting(ev, item.id) }}><DeleteOutlined style={{ color: "red" }} /></Button>
                                </Tooltip> : ""
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
                            title={<h2 style={{ float: 'left', marginBottom: -3 }}>会议查询</h2>}
                            extra={
                                <div style={{ width: 200 }} >
                                    <Row>
                                        <Col span={12}>
                                            <Button type={"primary"} onClick={this.findMeetingBySpecification}>查询</Button>
                                        </Col>
                                        <Col span={12}>
                                            <Button type={"primary"} onClick={this.exportMeetingRecord}>导出查询结果</Button>
                                        </Col>
                                    </Row>
                                </div>
                            }
                        >
                            <Row>
                                <Col span={7}>
                                    会议主题:
                                    <Input style={{ width: 160 }} value={this.state.topic} onChange={this.topicChange} />
                                </Col>
                                <Col span={7}>
                                    会议室名:
                                    <Select style={{ width: 160 }} onChange={this.meetRoomIdChange}>
                                        {
                                            this.state.meetRoomList.map(item => {
                                                return (
                                                    <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </Col>
                                <Col span={9}>
                                    查询时间:
                                    <DatePicker.RangePicker style={{ width: 240 }} onChange={this.timeChange} />
                                </Col>
                            </Row>
                            <Row>
                                <Col span={7}>
                                    部门名称:
                                    <Select style={{ width: 160 }} onChange={this.departmentIdChange}>
                                        {
                                            this.state.departList.map(item => {
                                                return (
                                                    <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                                )
                                            })
                                        }
                                    </Select>
                                </Col>
                                <Col span={7}>
                                    申请人名:
                                    <Input style={{ width: 160 }} value={this.state.reserveName} onChange={this.reserveNameChange} />
                                </Col>
                                <Col span={7}>
                                    会议状态:
                                    <Select style={{ width: 160 }} onChange={this.statusChange}>
                                        <Select.Option value={6}>预约失败</Select.Option>
                                        <Select.Option value={1}>预约成功</Select.Option>
                                        <Select.Option value={2}>预约中</Select.Option>
                                        <Select.Option value={3}>会议进行中</Select.Option>
                                        <Select.Option value={4}>会议结束</Select.Option>
                                        <Select.Option value={5}>取消会议</Select.Option>
                                        <Select.Option value={7}>调用失败</Select.Option>
                                        <Select.Option value={8}>调用中</Select.Option>
                                    </Select>
                                </Col>
                            </Row>
                            <Table rowKey={record => record.id} className={'table'} columns={columns} dataSource={this.state.dataSource} />
                        </Card>
                    </Col>
                </Row>
                <OneMeetingDrawer
                    wrappedComponentRef={this.saveFormRef}
                    roomList={this.state.meetRoomList || []}
                    open={this.state.drawerVisible}
                    othersList={this.state.othersList}
                    onClose={this.onClose}
                    changeAble={false}
                    coordinate={false}//是否调用会议
                    rob={false}//是否抢会议
                >
                </OneMeetingDrawer>
            </div>
        );
    }
}

export default MeetingInfoManage;