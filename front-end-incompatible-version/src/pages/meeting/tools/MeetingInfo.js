import React, { Component } from "react";
import { Table, Button, message, Tooltip, Input } from "antd";
import { ExclamationCircleOutlined, IssuesCloseOutlined, SearchOutlined } from "@ant-design/icons";
import global from "../../../global";
import '../../../css/meeting.less';
import moment from 'moment';
import OneMeetingDrawer from "./OneMeetingDrawer";
import Highlighter from 'react-highlight-words';
import Search from "antd/es/transfer/search";

class MeetingInfo extends Component {
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
        bookTool:[],
        roomList:[
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
        roomTools:[],
        bookVisible: false,
        othersList:[],
        searchDate:"2019-01-17",
        searchText: '',
        changeAble:true,
        coordinate:true,
        rob:true,
        meetingId:0,
    };

    getColumnSearchProps = (dataIndex) => ({
        filterDropdown:({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {this.searchInput = node;}}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}   
                />
                <Button
                    type="primary" 
                    onClick={() => this.handleSearch(selectedKeys, confirm)}
                    icon={<SearchOutlined />}
                    size='small'
                    style={{ width: 90, marginRight: 8 }}
                    >
                    Search
                </Button>
                <Button
                    onClick={() => this.handleReset(clearFilters)}
                    size='small'
                    style={{ width: 90 }}
                >
                    Reset
                </Button>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: text => (
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
    }
    showDrawer = () => {
        this.setState({
            bookVisible: true,
        });
    }
    saveFromRef = (formRef) => {
        this.formRef = formRef;
    }
    getOthersList = (e) => {
        this.setState({
            othersList: e
        })
    }

    ////////////////////////////////////////////fetch接口//////////////////////////////////////////////////////////////////
    //提交预定
    // 第一种修改方式，修改了时间或者地点或者都修改，相当于取消原会议重新预定
    // 第二种修改方式，修改除时间和地点外的其他内容
    handleCreate = () => {
        const form = this.formRef.props.form;
        if (this.state.coordinate){
            form.validateFields((err, values) => {
                if (err) {
                    return;
                }
                const url = global.localhostUrl + 'meeting/coordinateMeeting';
                const body = this.state.rob ? JSON.stringify({
                        topic:values.title,
                        content:values.description,
                        meetRoomId:values.meetingRoom,
                        reserveDate:values.dateTime.format("YYYY-MM-DD"),
                        beginTime:values.startTime.format("HH:mm"),
                        lastTime:values.continuedTime,
                        prepareTime:values.prepareTime,
                        joinPeopleId:values.guests,
                        outsideJoinPersons:this.state.othersList,
                        beforeOrLast:values.beforeOrLast,
                        note:values.coordinateNote,
                        beforeMeetingId:this.state.meetingId,
                    }) : JSON.stringify({
                        topic:values.title,
                        content:values.description,
                        meetRoomId:values.meetingRoom,
                        lastTime:values.continuedTime,
                        prepareTime:values.prepareTime,
                        joinPeopleId:values.guests,
                        outsideJoinPersons:this.state.othersList,
                        beforeOrLast:values.beforeOrLast,
                        note:values.coordinateNote,
                        beforeMeetingId:this.state.meetingId,
                    })
                fetch(url, {
                    method: "POST",
                    mode: "cors",
                    credentials:"include",
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                    },
                    body: body,
                }).then(res => res.json())
                .then(json => {
                    const data = json;
                    if(data.status){
                        message.success("调用申请提交成功");
                        this.setState({
                            bookVisible: false,
                        });
                       form.resetFields();
                    } else {
                        message.error(data.message);
                    }
                }).catch(function (e) {
                    console.log(e);
                    alert('系统错误');
                });
            })
        } else {
            form.validateFields((err, values) => {
                if (err) {
                    return;
                }

                const url = global.localhostUrl + "meeting/editOneServer";
                fetch(url, {
                    method: "POST",
                    mode: "cors",
                    credentials:"include",
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                    },
                    body: JSON.stringify({
                        meetingId:this.state.meetingId,
                        topic:values.title,
                        content:values.description,
                        meetRoomId:values.meetingRoom,
                        reserveDate:values.dateTime.format("YYYY-MM-DD"),
                        beginTime:values.startTime.format("HH:mm"),
                        lastTime:values.continuedTime,
                        prepareTime:values.prepareTime,
                        joinPeopleId:values.guests,
                        outsideJoinPersons:this.state.othersList,
                    }),
                }).then(res => res.json())
                .then(json => {
                    const data = json;
                    if(data.status){
                        message.success("预定信息提交成功！")
                        this.setState({
                            bookVisible: false,
                        })
                        form.resetFields();
                    }else {
                        message.error(data.message);
                    }

                }).catch(function (e) {
                    console.log(e);
                    alert('系统错误');
                });
            });
        }
    }

    // 预定首页
    reserveIndex = () => {
        const url = global.localhostUrl + "meeting/reserveIndex";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(res => res.json())
        .then(json => {
            const data = json;
            this.setState({
                bookRule:data.data[0], // 会议室预定参数
                bookTool:data.data[1], // 该租户的设备功能
                roomList:data.data[2], // 可预订的会议室
                roomBookInfo:data.data[3], // 今天该用户能够预定的所有会议室预定情况
                roomTools:data.data[4], // 会议室设备集合
            })
        }).catch(function (e) {
            console.log(e);
            alert('系统错误');
        });
    }

    ////////////////////////////////////////////////////////////////////////////////

    // 显示某个会议预定的信息
    showCoordinateMeeting = (ev, text, isRob) =>{
        this.setState({
            meetingId:text,
        })
        const form = this.formRef.props.form;
        const url = global.localhostUrl + "meeting/showOneReserveDetail?meetingId="+text;
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(res => res.json())
        .then(json => {
            const data = json;
            const others = data.data[0].outsideJoinPersons.map(item => item.name);
            form.resetFields();
            form.setFieldsValue({
                title:data.data[0].topic,
                meetingRoom:data.data[0].meetRoomId,
                description:data.data[0].content,
                guests:data.data[0].joinPeopleId,
                dateTime:moment(data.data[0].reserveDate,"YYYY-MM-DD"),
                startTime:moment(data.data[0].beginTime),
                prepareTime:data.data[0].prepareTime,
                continuedTime:data.data[0].lastTime,
                others:others,
            })
            this.setState({
                othersList:data.data[0].outsideJoinPersons,
                changeAble:true,
                coordinate:true,
                rob: isRob,
            })
        }).catch(function (e) {
            console.log(e);
            alert('系统错误');
        });
        this.setState({
            bookVisible:true,
        })
    }

    render() {
        const columns = [{
            title: '预定开始时间',
            dataIndex: 'begin',
            key: 'begin',
            colSpan: 2,
        }, {
            title: '预定结束时间',
            dataIndex: 'over',
            key: 'over',
            colSpan: 0,
        }, {
            title: '主题',
            dataIndex: 'topic',
            key: 'topic',
            ...this.getColumnSearchProps("topic"),
        }, {
            title: '预定人',
            dataIndex: 'peopleName',
            key: 'peopleName',
            colSpan: 2,
            ...this.getColumnSearchProps("peopleName"),
        }, {
            title: '预定人部门',
            dataIndex: 'departName',
            key: 'departName',
            colSpan: 0,
        }, {
            title: '联系电话',
            dataIndex: 'phone',
            key: 'phone',
            ...this.getColumnSearchProps("phone"),
        },
            // {
            //     title: '创建时间',
            //     dataIndex: 'createTime',
            //     key: 'createTime',
            // },
            {
                title: '操作',
                dataIndex: 'id',
                render: (text) => {
                    return(
                        <div>
                            <Tooltip title="调用会议">
                                <Button onClick={(ev) => {this.showCoordinateMeeting(ev, text, false)}}>
                                    <ExclamationCircleOutlined />
                                </Button>
                            </Tooltip>
                            <Tooltip title="抢会议">
                                <Button onClick={(ev) => {this.showRobMeeting(ev, text, true)}}>
                                    <IssuesCloseOutlined />
                                </Button>
                            </Tooltip>
                        </div>
                    )
                }
            }];
        return (
            <div>
                <Table rowKey={record => record.id} className={'table'} columns={columns} dataSource={this.props.dataSource} />
                <OneMeetingDrawer
                    wrappedComponentRef={this.saveFormRef}
                    roomList={this.state.roomList || []}
                    visible={this.state.bookVisible}
                    onClose={this.onClose}
                    onCreate={this.handleCreate}
                    getOthersList={this.getOthersList}
                    changeAble={this.state.changeAble}
                    coordinate={this.state.coordinate} // 是否调用会议
                    rob={this.state.rob}// 是否抢会议
                >
                </OneMeetingDrawer>
            </div>
        );
    }
}

export default MeetingInfo;