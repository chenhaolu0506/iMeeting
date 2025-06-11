import React, { Component } from 'react';
import moment from 'moment';
import {
    Slider,
    Switch,
    InputNumber,
    Col,
    Row,
    Card,
    Button,
    message,
    DatePicker,
    Checkbox, Modal, Table,
} from 'antd';
import global from '@/global';
import ShowMeeting from "@/pages/meeting/tool/ShowMeeting";
import CollectionCreateForm from "@/pages/meeting/tool/CollectionCreateForm";
import MeetingGraph from "@/pages/meeting/tool/MeetingGraph";
import FreeTimePopover from "@/pages/meeting/tool/FreeTimePopover";
import '@/css/meeting.less';
import NoMeeting from "@/pages/meeting/tool/noMeeting3.png";

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
    name: 'John',
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
        console.log(e)
        this.setState({
            othersList: e
        })
    }
    checkEquipChange = (e) => {
        // console.log(e)
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
    timeChange = (e) => {//本来应该在此方法setState的，但是因为异步问题，不得不把e传入下一个fetch请求中再进行渲染
        // console.log(e.format("YYYY-MM-DD"));
        console.log('timeChange', e);
        if (e) {
            this.oneDayReserver(e);
        }
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
        // console.log(e);
        this.setState({
            screenVisible: false,
        });
    }

    screenCancel = (e) => {
        // console.log(e);
        this.setState({
            screenVisible: false,
        });
    }
    bookByMeetRoom = (roomId) => {
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
            credentials: "include",//跨域携带cookie
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
                // console.log(data);
                this.setState({
                    dataSource: data.data,
                })
                this.setState({
                    screenVisible: true,
                })
                form.setFieldsValue({
                    dateTime: moment(this.state.searchDate, "YYYY-MM-DD"),
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
            const url = global.localhostUrl + "meeting/reserveMeeting";
            fetch(url, {
                method: "POST",
                mode: "cors",
                credentials: "include",//跨域携带cookie
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
                        this.oneDayReserverFlash();
                    } else {
                        // message.error("预定时间冲突，请重新选择预定时间！")
                        message.error(data.message);
                    }
                }).catch(function (e) {
                    console.log("fetch fail");
                    alert('系统错误');
                });

            // console.log('Received values of form: ', values);
            // console.log("标题", values.title);
            // console.log("会议说明", values.description);
            // console.log("会议室ID", values.meetingRoom);
            // console.log("预定日期", values.dateTime.format("YYYY-MM-DD"));
            // console.log("开始时间", values.startTime.format("HH:mm"));
            // console.log("持续时间", values.continuedTime);
            // console.log("准备时间", values.prepareTime);
            // console.log("参会人员", values.guests);
            // console.log("其它人员列表", this.state.othersList);
            //form.resetFields();//数据清空

        });
    }
    //reserveIndex
    reserveIndex = () => {
        const url = global.localhostUrl + "meeting/reserveIndex";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",//跨域携带cookie
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(res => res.json())
            .then(json => {
                // get result
                const data = json;
                console.log("data", data);
                this.setState({
                    bookRule: data.data[0],
                    equipList: data.data[1],
                    roomList: data.data[2],
                    searchMeetInfo: data.data[3],
                    roomTools: data.data[4],
                }, this.roomListShowFlash()//刷新要显示的会议室列表
                );
                this.roomListShowFlash();
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
    }
    //oneDayReserver表单提交后刷新数据
    oneDayReserverFlash = () => {
        const url = global.localhostUrl + "meeting/oneDayReserve";
        let meetRooms = this.state.roomList.map(item => item.id)
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",//跨域携带cookie
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                dayReservation: this.state.searchDate,
                meetRooms: meetRooms,
            }),
        }).then(res => res.json())
            .then(json => {
                const data = json;
                console.log("data in onedayreserverflash", data);
                this.setState({
                    searchMeetInfo: data.data,
                }, function () { })
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
    }
    //oneDayReserver
    oneDayReserver = (e) => {
        const url = global.localhostUrl + "meeting/oneDayReserve";
        let meetRooms = this.state.roomList.map(item => item.id)
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",//跨域携带cookie
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                dayReservation: e.format("YYYY-MM-DD"),
                meetRooms: meetRooms,
            }),
        }).then(res => res.json())
            .then(json => {
                const data = json;
                console.log("data in onedayreserver", data);
                this.setState({
                    searchMeetInfo: data.data,
                    searchDate: e.format("YYYY-MM-DD"),
                }, function () { })
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
                title: '仪器',
                render: (text) => {
                    return (
                        <div>
                            {text.meetroomEquips.map((item) => {
                                return item.equip.name + "|"
                            })}
                        </div>
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
                                    this.bookByMeetRoom(text.meetRoomId);
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
                title: '8:00-9:00',
                colSpan: 0,
            }, {
                title: '8:00-9:00',
                colSpan: 0,
            }, {
                title: '8:00-9:00',
                colSpan: 0,
            }
            )
        }
        let searchMeetInfo = []
        this.state.searchMeetInfo.map(() => {
            return searchMeetInfo.push([]);
        })
        return (
            <div id={"haha"} >
                <Row>
                    <Col span={18} offset={3}>

                        <Card
                            title={<h1 style={{ float: 'left', marginBottom: -10 }}>
                                预定会议
                            </h1>}
                            extra={<Button href="#" type={"primary"} onClick={this.showDrawer}>创建预定</Button>}
                        // style={{ width: 300 }}
                        >
                            <Row>
                                <Col span={8} >
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
                                    &nbsp;人以上
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
                                    <Button type='primary' onClick={this.showScreen}>人工智能快速寻找会议室</Button>
                                    <Modal
                                        title="人工智能筛选结果"
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
                                    <img style={{ width: "100%" }} src={NoMeeting} alt={"当天还没有预定会议哦"} /> :
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

class Demo extends Component {
    state = {
        disabled: false,
    };

    handleDisabledChange = (disabled) => {
        this.setState({ disabled });
    }

    render() {
        const { disabled } = this.state;
        return (
            <div>
                <Slider min={800} max={1400} range defaultValue={[800, 800]} step={25} disabled={disabled} />
                Disabled: <Switch size="small" checked={disabled} onChange={this.handleDisabledChange} />
            </div>
        );
    }
}


export default BookMeeting;