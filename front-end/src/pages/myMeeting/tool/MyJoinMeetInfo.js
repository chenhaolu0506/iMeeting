import React, { Component } from 'react';
import {Table, Button, Icon, message, Tooltip, Input, Modal,Select} from "antd";
import global from '@/global';
import '@/css/meeting.less';
import LeaveDrawer from "@/pages/myMeeting/tool/LeaveDrawer";
import OneMeetDrawer from "@/pages/meeting/tool/OneMeetDrawer";
import OutLineDrawerMe from "@/pages/myMeeting/tool/OutLineDrawerMe";
import moment from "moment";
import Highlighter from "react-highlight-words";
import TaskDrawerMe from "./TaskDrawerMe";
import FileDrawerMe from "./FileDrawerMe";
import FileDrawer from "../../meeting/tool/FileDrawer";

class MyMeetInfo extends Component {
    componentDidMount(){
        this.reserveIndex();
    }
    state={
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
        bookVisible:false,
        leaveVisible: false,
        deleteVisible:false,
        stopVisible:false,
        othersList:[],
        searchDate:"2019-01-17",
        meetingId:"",
        meetingName:"",
        fileUploadVisible:false,
        outLineVisible:false,
        outLineList:[],
        taskVisible:false,
        taskList:[],
        fileVisible:false,
        fileList:[],
        file:"",
        fileStatus:1,
    }
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
    onLeaveClose = () => {
        this.setState({
            leaveVisible: false,
        });
    };
    showDrawer = () => {
        this.setState({
            leaveVisible: true,
        });
    };
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }
    saveFormRef2 = (formRef) => {
        this.formRef2 = formRef;
    }
    showFileUpload=(id,name)=>{
        this.setState({
            meetingId:id,
            meetingName:name,
            fileUploadVisible:true
        })
    }

    outLineClose=()=>{
        this.setState({
            outLineVisible: false,
        });
    }
    taskClose=()=>{
        this.setState({
            taskVisible: false,
        });
    }
    fileClose=()=>{
        this.setState({
            fileVisible: false,
        });
    }

    //showOneReserveDetail请假
    showOneLeaveDetail = (ev,text,status) =>{
        console.log(ev)
        console.log(text)
        console.log(status)
        this.setState({
            leaveVisible:true,
            meetingId:text,
        })
    }
    //文件修改
    fileOnChange=(f)=>{
        console.log(f)
        const file = f.target.files[0]
        console.log("file",file)
        this.setState({
            file:file
        })
    }
    ////////////////////////////////////////////fetch接口//////////////////////////////////////////////////////////////////
    //上传文件
    fileUpload=()=>{
        const file = this.state.file
        const meetingId = this.state.meetingId
        const status = this.state.fileStatus
        const formData = new FormData()
        formData.append('file', file)
        formData.append('meetingId', meetingId)
        formData.append('status', status)
        console.log("formData",formData)
        console.log("file",file)
        console.log("meetingId",meetingId)
        console.log("status",status)
        const url=global.localhostUrl+"file/upload";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",//跨域携带cookie
            body: formData
        }).then(function (res) {//function (res) {} 和 res => {}效果一致
            return res.json()
        }).then(json => {
            // get result
            const data = json;
            console.log(data);
            if(data.status){
                message.success(data.message)
                this.setState({
                    file:"",
                    fileStatus:"1",
                    fileUploadVisible:false
                })
            }else{
                message.error(data.message)
            }
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });


    }
    //findByMeeting//会议大纲
    findByMeeting = (ev,id) =>{
        const url=global.localhostUrl+"outline/findByMeeting?meetingId="+id;
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
            console.log(data);
            this.setState({
                outLineList:data.data,
                outLineVisible:true,
                meetingId:id,
            })
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
    }
    //findByMeeting会议文件
    findByMeeting_file = (ev,id) =>{
        const url=global.localhostUrl+"file/fineOneMeetingFileOnJoin?meetingId="+id;
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
            console.log(data);
            this.setState({
                fileList:data.data,
                fileVisible:true,
                meetingId:id,
            })
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
    }
    //findByMeeting
    findByMeeting_task = (ev,id) =>{
        const url=global.localhostUrl+"task/findByMeeting?meetingId="+id;
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
            console.log(data);
            this.setState({
                taskList:data.data,
                taskVisible:true,
                meetingId:id,
            })
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
    }
    //showOneReserveDetail显示一个会议的具体信息
    showOneReserveDetail = (ev,text) =>{
        console.log(ev)
        console.log(text)
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
                changeAble:false,
                coordinate:false,
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
    //提交请假申请
    handleCreate = () => {
        const form = this.formRef2.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            const url=global.localhostUrl+"meeting/sendLeaveInformation";
            fetch(url, {
                method: "POST",
                mode: "cors",
                credentials:"include",//跨域携带cookie
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify({
                    note:values.description,
                    meetingId:this.state.meetingId,
                }),
            }).then(function (res) {//function (res) {} 和 res => {}效果一致
                return res.json()
            }).then(json => {
                // get result
                const data = json;
                console.log(data);
                if(data.status){
                    message.success(data.message)
                    this.setState({
                        leaveVisible: false,
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
            console.log("请假原因",values.description);
            //form.resetFields();//数据清空

        })
    }

    render() {
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
            render:(text)=>{
                switch(text){
                    case "预约失败":
                        return <div style={{color:"#f96868"}}>{text}</div>
                    case "预约成功":
                        return <div style={{color:"#46be8a"}}>{text}</div>
                    case "预约中":
                        return <div style={{color:"#f2a654"}}>{text}</div>
                    case "会议进行":
                        return <div style={{color:"#f96868"}}>{text}</div>
                    case "会议结束":
                        return <div style={{color:"#8c8c8c"}}>{text}</div>
                    case "取消会议":
                        return <div style={{color:"#f96868"}}>{text}</div>
                    default:
                        return <div>{text}</div>
                }

            }
        }, {
            title: '操作',
            // dataIndex: 'id',
            render: (text) => {
                console.log(text)
                switch(text.status){
                    case "未开始":
                        return(
                            <div>
                                <Tooltip title="查看">
                                    <Button onClick={(ev)=>{this.showOneReserveDetail(ev,text.id,false)}}><Icon type={"eye"}></Icon></Button>
                                </Tooltip>
                                <Tooltip title="请假">
                                    <Button onClick={(ev)=>{this.showOneLeaveDetail(ev,text.id,false)}}><Icon type="exclamation"/></Button>
                                </Tooltip>
                                <Tooltip title="上传文件">
                                    <Button onClick={()=>{
                                        this.showFileUpload(text.id,text.topic)
                                    }}>
                                        <Icon type="upload" />
                                    </Button>
                                </Tooltip>
                                <Tooltip title="查看会议大纲">
                                    <Button onClick={(ev)=>{this.findByMeeting(ev,text.id)}}><Icon type="ordered-list" /></Button>
                                </Tooltip>
                                <Tooltip title="查看会议任务">
                                    <Button onClick={(ev)=>{this.findByMeeting_task(ev,text.id)}}><Icon type="snippets" /></Button>
                                </Tooltip>
                                <Tooltip title="查看会议文件">
                                    <Button onClick={(ev)=>{this.findByMeeting_file(ev,text.id,false)}}><Icon type={"file"}></Icon></Button>
                                </Tooltip>
                            </div>
                        )
                    default:
                        return(
                            <div>
                                <Tooltip title="查看会议">
                                    <Button onClick={(ev)=>{this.showOneReserveDetail(ev,text.id,false)}}><Icon type={"eye"}></Icon></Button>
                                </Tooltip>
                                <Tooltip title="查看会议大纲">
                                    <Button onClick={(ev)=>{this.findByMeeting(ev,text.id)}}><Icon type="ordered-list" /></Button>
                                </Tooltip>
                                <Tooltip title="查看会议任务">
                                    <Button onClick={(ev)=>{this.findByMeeting_task(ev,text.id)}}><Icon type="snippets" /></Button>
                                </Tooltip>
                                <Tooltip title="查看会议文件">
                                    <Button onClick={(ev)=>{this.findByMeeting_file(ev,text.id,false)}}><Icon type={"file"}></Icon></Button>
                                </Tooltip>
                            </div>
                        )
                }

            }
        }];
        return (
            <div >
                {
                    console.log(this.props.dataSource)
                }
                <Table rowKey={record=>record.id} className={'table'} columns={columns} dataSource={this.props.dataSource} />
                <LeaveDrawer
                    wrappedComponentRef={this.saveFormRef2}
                    visible={this.state.leaveVisible}
                    onClose={this.onLeaveClose}
                    onCreate={this.handleCreate}
                >
                </LeaveDrawer>
                <OneMeetDrawer
                    wrappedComponentRef={this.saveFormRef}
                    roomList={this.state.roomList||[]}
                    visible={this.state.bookVisible}
                    othersList={this.state.othersList}
                    onClose={this.onClose}
                    onCreate={this.handleCreate}
                    getOthersList={this.getOthersList}
                    changeAble={this.state.changeAble}//是否可修改
                    coordinate={this.state.coordinate}//是否调用会议
                >
                </OneMeetDrawer>
                <Modal
                    title={"文件上传"}
                    visible={this.state.fileUploadVisible}
                    onCancel={()=>{
                        this.setState({
                            fileUploadVisible:false,
                        })
                    }}
                    onOk={this.fileUpload}
                >
                    {this.state.meetingName}
                    <br/>
                    <input type="file" name="file" onChange={this.fileOnChange} />
                    <br/>
                    <Select
                        defaultValue="1"
                        style={{ width: 120 }}
                        onChange={(value)=>{
                            this.setState({
                                fileStatus:value
                            })
                        }}
                    >
                        <Select.Option value="1">允许下载</Select.Option>
                        <Select.Option value="2">禁止下载</Select.Option>
                    </Select>
                </Modal>
                {/*<Modal*/}
                    {/*title={"文件上传"}*/}
                    {/*visible={this.state.fileUploadVisible}*/}
                    {/*onCancel={()=>{*/}
                        {/*this.setState({*/}
                            {/*fileUploadVisible:false,*/}
                        {/*})*/}
                    {/*}}*/}
                    {/*onOk={()=>{*/}
                        {/*console.log("click-submit")*/}
                        {/*document.getElementById("uploadSubmit").click();*/}
                    {/*}}*/}
                {/*>*/}
                    {/*<form*/}
                        {/*name="uploadFile"*/}
                        {/*action = {global.localhostUrl+"file/upload"}*/}
                        {/*method = "POST"*/}
                        {/*enctype="multipart/form-data"*/}
                    {/*>*/}
                        {/*<select*/}
                            {/*name="meetingId"*/}
                            {/*onChange={()=>{*/}
                            {/*}}*/}
                        {/*>*/}
                            {/*<option value={this.state.meetingId}>{this.state.meetingName}</option>*/}
                        {/*</select>*/}
                        {/*<br/>*/}
                        {/*<input name="file" type="file"/>*/}
                        {/*<br/>*/}
                        {/*<label><input name="status" type="radio" value="1" defaultChecked/>允许下载 </label>*/}
                        {/*<label><input name="status" type="radio" value="2" />不允许下载 </label>*/}
                        {/*<button type="submit" id="uploadSubmit" onClick={(event)=>{this.handleSubmit(event)}} />*/}
                    {/*</form>*/}
                {/*</Modal>*/}
                <OutLineDrawerMe
                    findByMeeting={this.findByMeeting}
                    meetingId={this.state.meetingId}
                    onClose={this.outLineClose}
                    visible={this.state.outLineVisible}
                    outLineList={this.state.outLineList}
                >

                </OutLineDrawerMe>
                <TaskDrawerMe
                    findByMeeting={this.findByMeeting_task}
                    meetingId={this.state.meetingId}
                    onClose={this.taskClose}
                    visible={this.state.taskVisible}
                    taskList={this.state.taskList}
                >

                </TaskDrawerMe>
                <FileDrawerMe
                    findByMeeting={this.findByMeeting_file}
                    meetingId={this.state.meetingId}
                    onClose={this.fileClose}
                    visible={this.state.fileVisible}
                    fileList={this.state.fileList}
                >

                </FileDrawerMe>
                {/*//页面上使用a标签数组*/}
                <a id="downloadDiv" style={{display: 'none'}}></a>
            </div>
        );
    }
}

export default MyMeetInfo;
