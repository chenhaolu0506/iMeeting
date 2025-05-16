import React, { Component } from "react";
import moment from 'moment';
import { Slider, Switch, Row, Col, InputNumber, Card, Button, message, DatePicker, Modal, Table, Checkbox } from 'antd';
import global from "../../../global";
import ShowMeeting from "./tools/ShowMeeting";
import CollectionCreateForm from "./tools/CollectionCreateForm";
import MeetingGraph from "./tools/MeetingGraph";
import FreeTimePopover from "./tools/FreeTimePopover";
import '../../css/meeting.less';
import NoMeeting from "./tools/noMeeting3.png";

const data = [{
    key: '1',
    name: 'John',
    time: 32,
    begin: "",
    over: "",
    dateLimit: "",
    timeLimit: "",
    timeInterval: "",
    tenantId: 1,

}, {
    key: '2',
    name: 'James',
    time: 32,
    begin: "",
    over: "",
    dateLimit: "",
    timeLimit: "",
    timeInterval: "",
    tenantId: 1,
}, {
    key: '3',
    name: 'Brown',
    time: 32,
    begin: "",
    over: "",
    dateLimit: "",
    timeLimit: "",
    timeInterval: "",
    tenantId: 1,
}];

class BookMeeting extends Component {
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
        checkEquip: [],
        equipList: [],
        roomList: [],
        roomListShow: [],
        roomTools: [],
        bookVisible: false,
        othersList: [],
        searchDate: moment().format("YYYY-MM-DD"),
        searchMeetInfo: [],
        contain: 0,
        screenVisible: false,
        dataSource: [],
    };

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
        this.setState({
            othersList: e
        })
    }
    checkEquipChange = (e) => {
        this.setState({
            checkEquip: e,
        }, this.roomListShowFlash());
        this.roomListShowFlash2(e);
    }
    containChange = (e) => {
        this.setState({
            contain: e,
        }, this.roomListShowFlash());
    }
    timeChange = (e) => { //本来应该在此方法setState的，但是因为异步问题，不得不把e传入下一个fetch请求中再进行渲染
        this.oneDayReserve(e);
    }
    roomListShowFlash = () => {
        let roomListShow = this.state.roomList.map(item => item.contain >= this.state.contain);
        roomListShow = this.state.roomTools.map((tools, i) => {
            const hasAllEquip = this.state.checkEquip.every(equipId => tools.some(tool => tool.equipId === equipId));
            return hasAllEquip && roomListShow[i];
        })
        this.setState({
            roomListShow: roomListShow,
        })
    }
    roomListShowFlash2 = (e) => {
        let roomListShow = this.state.roomList.map(item => item.contain >= this.state.contain);
        roomListShow = this.state.roomTools.map((tools, i) => {
            const hasAllEquip = e.every(equipId => tools.some(tool => tool.equipId === equipId));
            return hasAllEquip && roomListShow[i];
        })
        this.setState({
            roomListShow: roomListShow,
        })
    }
    screenOk = (e) => {
        this.setState({
            screenVisible: false,
        });
    }

    screenCancel = (e) => {
        this.setState({
            screenVisible: false,
        });
    }
    bookByMeetingRoom = (roomId) => {
        const form = this.formRef.props.form;
        form.setFieldsValue({
            meetingRoom: roomId
        })
        this.setState({
            bookVisible: true
        })
    }
    ////////////////////////////////////////////fetch接口//////////////////////////////////////////////////////////////////
    //人工智能搜索结果
    showScreen = () => {
        const form = this.formRef.props.form;
        let equipList = this.state.equipList.map(item => item.id)
        let weight = equipList.map(id => this.state.checkEquip.includes(id) ? 1 : 0)
        weight.push(1)
        const url = global.localhostUrl + "meeting/recommendMeetingRoom";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include", //跨域携带cookie
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                equips: equipList,
                weight: weight,
                contain: this.state.contain,
            }),
        }).then(res => res.json())
            .then(json => {
                const data = json;
                this.setState({
                    dataSource: data.data,
                    screenVisible: true,
                })
                form.setFieldsValue({
                    dateTime: moment(this.state.searchDate, "YYYY-MM-DD"),
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

            const url = global.localhostUrl + "meeting/reserveMeeting";
            fetch(url, {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify({
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
                        this.oneDayReserveFlash();
                    } else {
                        // message.error("预定时间冲突，请重新选择预定时间！")
                        message.error(data.message);
                    }
                }).catch(function (e) {
                    console.log(e);
                    alert('系统错误');
                });
        });
    }
    //reserveIndex
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
                    bookRule: data.data[0],
                    equipList: data.data[1],
                    roomList: data.data[2],
                    searchMeetInfo: data.data[3],
                    roomTools: data.data[4],
                }, this.roomListShowFlash //刷新要显示的会议室列表
                );
            }).catch(function (e) {
                console.log(e);
                alert('系统错误');
            });
    }
    //oneDayReserve表单提交后刷新数据
    oneDayReserveFlash = () => {
        const url = global.localhostUrl + "meeting/oneDayReserve";
        let meetingRooms = this.state.roomList.map(item => item.id)
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                dayReservation: this.state.searchDate,
                meetingRooms: meetingRooms,
            }),
        }).then(res => res.json())
            .then(json => {
                const data = json;
                this.setState({
                    searchMeetInfo: data.data,
                })
            }).catch(function (e) {
                console.log(e);
                alert('系统错误');
            });
    }
    //oneDayReserve
    oneDayReserve = (e) => {
        const url = global.localhostUrl + "meeting/oneDayReserve";
        let meetingRooms = this.state.roomList.map(item => item.id)
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                dayReservation: e.format("YYYY-MM-DD"),
                meetingRooms: meetingRooms,
            }),
        }).then(res => res.json())
            .then(json => {
                const data = json;
                this.setState({
                    searchMeetInfo: data.data,
                    searchDate: e.format("YYYY-MM-DD"),
                })
            }).catch(function (e) {
                console.log(e);
                alert('系统错误');
            });
    }

    render() {
        const columns = [
            {
                title: '序号',
                dataIndex: 'id',
                key: 'id',
                render: (text, m, i) => {
                    return (
                        <div>{i + 1}</div>
                    )
                }
            }, {
                title: '会议室名',
                dataIndex: 'meetRoomName',
            }, {
                title: '会议室容量',
                dataIndex: 'contain',
            }, {
                title: '设备',
                render: (text) => {
                    return (
                        <div>{text.meetroomEquips.map(item => item.equip.name).join("|")}</div>
                    )
                }
            }, {
                title: '匹配度',
                dataIndex: 'similar',
                key: 'similar',
            }, {
                title: '操作',
                render: (text) => {
                    return (
                        <div>
                            <FreeTimePopover
                                searchDate={this.state.searchDate}
                                meetRoomName={text.meetRoomName}
                                meetRoomId={text.meetRoomId}
                            />
                            <Button type='primary'
                                onClick={() => {
                                    this.bookByMeetingRoom(text.meetRoomId);
                                }}
                            >
                                预定
                            </Button>
                        </div>
                    )
                }
            },
        ];
        const timeTable = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            className: "colStyle",
            width: 120,
        }];
        const beginH = parseInt(this.state.bookRule.begin.split(":")[0]);
        const overH = parseInt(this.state.bookRule.over.split(":")[0]);
        for (let i = beginH; i <= overH; i++) {
            timeTable.push(
                {
                    title: i + ":00-" + (i + 1) + ":00",
                    colSpan: 4,
                    className: "11",
                }, {
                title: '',
                colSpan: 0,
            }, {
                title: '',
                colSpan: 0,
            }, {
                title: '',
                colSpan: 0,
            }
            )
        }
        let searchMeetInfo = []
        this.state.searchMeetInfo.map(() => {
            return searchMeetInfo.push([]);
        })
        return (
            <div id={"haha"}>
                <Row>
                    <Col span={18} offset={3}>
                        <Card
                            title={<h1 style={{ float: 'left', marginBottom: -10 }}>
                                预定会议
                            </h1>}
                            extra={<Button href="#" type={"primary"} onClick={this.showDrawer}>创建预定</Button>}
                        >
                            <Row>
                                <Col span={8}>
                                    日期：
                                    <DatePicker
                                        placeholder="选择日期"
                                        onChange={this.timeChange}
                                        defaultValue={moment(this.state.searchDate, "YYYY-MM-DD")}
                                    />
                                </Col>
                                <Col span={8} >
                                    人数：
                                    <InputNumber value={this.state.contain} min={0} defaultValue={0} onChange={this.containChange} />
                                    人以上
                                </Col>
                            </Row>
                            <Row>
                                <Col span={18} >
                                    <div style={{ marginTop: "10px", marginLeft: "1px" }}>
                                        <Checkbox.Group value={this.state.checkEquip} style={{ width: '100%' }} onChange={this.checkEquipChange}>
                                            <Row>
                                                <Col span={2} offset={1}>器材：</Col>
                                                {
                                                    this.state.equipList.map(item => {
                                                        return (
                                                            <Col span={4} key={item.id}><Checkbox value={item.id}>{item.name}</Checkbox></Col>
                                                        )
                                                    })
                                                }
                                            </Row>
                                        </Checkbox.Group>
                                    </div>
                                </Col>
                                <Col span={6}>
                                    <Button type='primary' onClick={this.showScreen}>智能快速寻找会议室</Button>
                                    <Modal
                                        title="智能筛选结果"
                                        visible={this.state.screenVisible}
                                        width={800}
                                        onOk={this.screenOk}
                                        onCancel={this.screenCancel}
                                        okText={"确定"}
                                        cancelText={"取消"}
                                    >
                                        <Table rowKey={record => record.meetRoomId} className={'table'} columns={columns} dataSource={this.state.dataSource} />
                                    </Modal>
                                </Col>
                            </Row>
                            {
                                this.state.searchMeetInfo.toString() === searchMeetInfo.toString() ?
                                    <img style={{ width: "100%" }} src={NoMeeting} alt={"当天还没有预定会议"} /> :
                                    <MeetingGraph //图表显示
                                        startTime={this.state.searchDate + " " + this.state.bookRule.begin}
                                        overTime={this.state.searchDate + " " + this.state.bookRule.over}
                                        searchMeetInfo={this.state.searchMeetInfo} //查找过的会议信息
                                        roomListShow={this.state.roomListShow} //删选过的roomList
                                        roomList={this.state.roomList} //roomList
                                    />
                            }
                        </Card>
                        {/*<Card>*/}
                        {/**/}
                        {/*<Row>*/}
                        {/*<Table className={'table'} columns={timeTable} dataSource={data} bordered/>*/}
                        {/*<Col span={16} offset={4}>*/}
                        {/*<Demo/>*/}
                        {/*</Col>*/}
                        {/*</Row>*/}
                        {/*</Card>*/}
                    </Col>
                </Row>
                <CollectionCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    roomList={this.state.roomList}
                    visible={this.state.bookVisible}
                    onClose={this.onClose}
                    onCreate={this.handleCreate}
                    getOthersList={this.getOthersList}
                >
                </CollectionCreateForm>
                <ShowMeeting roomList={this.state.roomList} searchDate={this.state.searchDate} />
            </div>
        );
    }
}

export default BookMeeting;