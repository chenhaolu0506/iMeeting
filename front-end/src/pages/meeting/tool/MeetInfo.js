import React, { Component } from 'react';
import {Table, Button, Icon, message, Tooltip, Input} from "antd";
import global from '@/global';
import '@/css/meeting.less';
import moment from 'moment'
import OneMeetDrawer from "@/pages/meeting/tool/OneMeetDrawer";
import Highlighter from "react-highlight-words";


class MeetInfo extends Component {
    //
    componentDidMount(){
        this.reserveIndex();
    }
    state = {
        bookRule:{
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
        changeAble:true,
        coordinate:true,
        rob:true,
        meetingId:0,

    };
    //表格查询...this.getColumnSearchProps("name"),
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
                    Search
                </Button>
                <Button
                    onClick={() => this.handleReset(clearFilters)}
                    size="small"
                    style={{ width: 90 }}
                >
                    Reset
                </Button>
            </div>
        ),
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
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
    //表格查询

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
    getOthersList=(e)=>{
        console.log(e)
        this.setState({
            othersList:e
        })
    }
    ////////////////////////////////////////////fetch接口//////////////////////////////////////////////////////////////////
    //提交预定
    handleCreate = () => {
        const form = this.formRef.props.form;
        this.state.coordinate?this.state.rob?
            form.validateFields((err, values) => {
                if (err) {
                    return;
                }

                const url=global.localhostUrl+"meeting/coordinateMeeting";
                fetch(url, {
                    method: "POST",
                    mode: "cors",
                    credentials:"include",//跨域携带cookie
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                    },
                    body: JSON.stringify({
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
                    }),
                }).then(function (res) {//function (res) {} 和 res => {}效果一致
                    return res.json()
                }).then(json => {
                    // get result
                    const data = json;
                    console.log(data);
                    if(data.status){
                        message.success("调用申请提交成功！")
                        this.setState({
                            bookVisible: false,
                        })
                        form.resetFields();
                    }else {
                        // message.error("预定时间冲突，请重新选择预定时间！")
                        message.error(data.message);
                    }

                }).catch(function (e) {
                    console.log("fetch fail");
                    alert('系统错误');
                });

                console.log('Received values of form: ', values);
                console.log("会议编号",this.state.meetingId);
                console.log("标题",values.title);
                console.log("会议说明",values.description);
                console.log("会议室ID",values.meetingRoom);
                console.log("预定日期",values.dateTime.format("YYYY-MM-DD"));
                console.log("开始时间",values.startTime.format("HH:mm"));
                console.log("持续时间",values.continuedTime);
                console.log("准备时间",values.prepareTime);
                console.log("参会人员",values.guests);
                console.log("其它人员列表",this.state.othersList);
                console.log("调用原因",values.coordinateNote);
                //form.resetFields();//数据清空

            })
            :
            form.validateFields((err, values) => {
                if (err) {
                    return;
                }

                const url=global.localhostUrl+"meeting/coordinateMeeting";
                fetch(url, {
                    method: "POST",
                    mode: "cors",
                    credentials:"include",//跨域携带cookie
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                    },
                    body: JSON.stringify({
                        topic:values.title,
                        content:values.description,
                        meetRoomId:values.meetingRoom,
                        // reserveDate:values.dateTime.format("YYYY-MM-DD"),
                        // beginTime:values.startTime.format("HH:mm"),
                        lastTime:values.continuedTime,
                        prepareTime:values.prepareTime,
                        joinPeopleId:values.guests,
                        outsideJoinPersons:this.state.othersList,
                        beforeOrLast:values.beforeOrLast,
                        note:values.coordinateNote,
                        beforeMeetingId:this.state.meetingId,
                    }),
                }).then(function (res) {//function (res) {} 和 res => {}效果一致
                    return res.json()
                }).then(json => {
                    // get result
                    const data = json;
                    console.log(data);
                    if(data.status){
                        message.success("调用申请提交成功！")
                        this.setState({
                            bookVisible: false,
                        })
                        form.resetFields();
                    }else {
                        // message.error("预定时间冲突，请重新选择预定时间！")
                        message.error(data.message);
                    }

                }).catch(function (e) {
                    console.log("fetch fail");
                    alert('系统错误');
                });

                console.log('Received values of form: ', values);
                console.log("会议编号",this.state.meetingId);
                console.log("标题",values.title);
                console.log("会议说明",values.description);
                console.log("会议室ID",values.meetingRoom);
                // console.log("预定日期",values.dateTime.format("YYYY-MM-DD"));
                // console.log("开始时间",values.startTime.format("HH:mm"));
                console.log("持续时间",values.continuedTime);
                console.log("准备时间",values.prepareTime);
                console.log("参会人员",values.guests);
                console.log("其它人员列表",this.state.othersList);
                console.log("调用原因",values.coordinateNote);
                //form.resetFields();//数据清空

            })
            ://双目运算符的:
            form.validateFields((err, values) => {
                if (err) {
                    return;
                }

                const url=global.localhostUrl+"meeting/editOneServer";
                fetch(url, {
                    method: "POST",
                    mode: "cors",
                    credentials:"include",//跨域携带cookie
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
                }).then(function (res) {//function (res) {} 和 res => {}效果一致
                    return res.json()
                }).then(json => {
                    // get result
                    const data = json;
                    console.log(data);
                    if(data.status){
                        message.success("预定信息提交成功！")
                        this.setState({
                            bookVisible: false,
                        })
                        form.resetFields();
                    }else {
                        // message.error("预定时间冲突，请重新选择预定时间！")
                        message.error(data.message);
                    }

                }).catch(function (e) {
                    console.log("fetch fail");
                    alert('系统错误');
                });

                console.log('Received values of form: ', values);
                console.log("会议编号",this.state.meetingId);
                console.log("标题",values.title);
                console.log("会议说明",values.description);
                console.log("会议室ID",values.meetingRoom);
                console.log("预定日期",values.dateTime.format("YYYY-MM-DD"));
                console.log("开始时间",values.startTime.format("HH:mm"));
                console.log("持续时间",values.continuedTime);
                console.log("准备时间",values.prepareTime);
                console.log("参会人员",values.guests);
                console.log("其它人员列表",this.state.othersList);
                //form.resetFields();//数据清空

            });
    }
    //reserveIndex显示会议信息和规则
    reserveIndex = () =>{
        console.log(111)
        const url=global.localhostUrl+"meeting/reserveIndex";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",//跨域携带cookie
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(function (res) {//function (res) {} 和 res => {}效果一致
            return res.json()
        }).then(json => {
            // get result
            const data = json;
            console.log("+++");
            console.log(data);
            this.setState({
                bookRule:data.data[0],
                bookTool:data.data[1],
                roomList:data.data[2],
                roomBookInfo:data.data[3],
                roomTools:data.data[4],
            })
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
    }

    ////////////////////////////////////////////////////////////////////////////////

    //showCoordinateMeeting调用会议
    showCoordinateMeeting = (ev,text) =>{
        console.log(ev)
        console.log(text)
        this.setState({
            meetingId:text,
        })
        const form = this.formRef.props.form;
        const url=global.localhostUrl+"meeting/showOneReserveDetail?meetingId="+text;
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",//跨域携带cookie
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(function (res) {//function (res) {} 和 res => {}效果一致
            return res.json()
        }).then(json => {
            // get result
            const data = json;
            console.log("显示一个会议的具体信息",data);
            console.log("time",moment(data.data[0].beginTime,"HH:mm"));
            const others=[];
            data.data[0].outsideJoinPersons.map((item)=>{
                return others.push(item.name);
            })
            form.resetFields();
            form.setFieldsValue({
                // title:data.data[0].topic,
                meetingRoom:data.data[0].meetRoomId,
                // description:data.data[0].content,
                // guests:data.data[0].joinPeopleId,
                dateTime:moment(data.data[0].reserveDate,"YYYY-MM-DD"),
                startTime:moment(data.data[0].beginTime),
                prepareTime:data.data[0].prepareTime,
                continuedTime:data.data[0].lastTime,
                // others:others,
            })
            this.setState({
                othersList:data.data[0].outsideJoinPersons,
                changeAble:true,
                coordinate:true,
                rob:false,
            })
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
        this.setState({
            bookVisible:true,
        })

    }
    //showCoordinateMeeting抢会议
    showRobMeeting = (ev,text) =>{
        console.log(ev)
        console.log(text)
        this.setState({
            meetingId:text,
        })
        const form = this.formRef.props.form;
        const url=global.localhostUrl+"meeting/showOneReserveDetail?meetingId="+text;
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",//跨域携带cookie
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(function (res) {//function (res) {} 和 res => {}效果一致
            return res.json()
        }).then(json => {
            // get result
            const data = json;
            console.log("显示一个会议的具体信息",data);
            console.log("time",moment(data.data[0].beginTime,"HH:mm"));
            const others=[];
            data.data[0].outsideJoinPersons.map((item)=>{
                return others.push(item.name);
            })
            form.resetFields();
            form.setFieldsValue({
                // title:data.data[0].topic,
                meetingRoom:data.data[0].meetRoomId,
                // description:data.data[0].content,
                // guests:data.data[0].joinPeopleId,
                dateTime:moment(data.data[0].reserveDate,"YYYY-MM-DD"),
                startTime:moment(data.data[0].beginTime),
                prepareTime:data.data[0].prepareTime,
                continuedTime:data.data[0].lastTime,
                // others:others,
            })
            this.setState({
                othersList:data.data[0].outsideJoinPersons,
                changeAble:true,
                coordinate:true,
                rob:true,

            })
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
        this.setState({
            bookVisible:true,
        })

    }
    render() {
        const columns = [{
            title: '预定时间',
            dataIndex: 'begin',
            key: 'begin',
            colSpan: 2,
        }, {
            title: '预定时间',
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
                            {/*<Button onClick={(ev)=>{this.showOneReserveDetail(ev,text)}}><Icon type={"eye"}></Icon></Button>*/}
                            <Tooltip title="调用会议">
                                <Button onClick={(ev)=>{this.showCoordinateMeeting(ev,text)}}>
                                    <Icon type="exclamation-circle" />
                                </Button>
                            </Tooltip>
                            <Tooltip title="抢会议">
                                <Button onClick={(ev)=>{this.showRobMeeting(ev,text)}}>
                                    <Icon type="issues-close" />
                                </Button>
                            </Tooltip>
                        </div>
                    )
                }
            }];
        return (
            <div >
                <Table rowKey={record=>record.id} className={'table'} columns={columns} dataSource={this.props.dataSource} />
                <OneMeetDrawer
                    wrappedComponentRef={this.saveFormRef}
                    roomList={this.state.roomList||[]}
                    visible={this.state.bookVisible}
                    onClose={this.onClose}
                    onCreate={this.handleCreate}
                    getOthersList={this.getOthersList}
                    changeAble={this.state.changeAble}
                    coordinate={this.state.coordinate}//是否调用会议
                    rob={this.state.rob}//是否抢会议
                >
                </OneMeetDrawer>
            </div>
        );
    }
}
export default MeetInfo;
