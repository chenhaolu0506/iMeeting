import React, { Component } from 'react';
import {Table, Card, Col, Row, Button, Tooltip, Icon, message, Input, Drawer, Modal} from "antd";
import global from '@/global';
import Highlighter from 'react-highlight-words';
import WeekMeetCreateForm from "@/pages/meeting/tool/WeekMeetCreateForm";
class WeekMeeting extends Component {
    componentDidMount(){
        //this.selectAll();
        this.getEffectiveMeetroom();
        this.userFindAll();
    }
    state={
        dataSource:[
        ],
        roomList:[],
        equipName:"",
        equipId:0,
        drawerVisible:false,
        addOrChange:false,
        modalVisible: false,
        searchText:"",
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

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            modalVisible: false,
        });
    }
    onClose = (e) => {
        console.log(e);
        this.setState({
            drawerVisible: false,
        });
    }
    showDelete=(ev,id)=>{
        this.setState({
            modalVisible: true,
            equipId:id,
        });
    }
    showUpdate=(ev,id,name)=>{
        this.setState({
            addOrChange:false,
            drawerVisible: true,
            equipName:name,
            equipId:id,
        });
    }
    showAddEquip=()=>{
        this.setState({
            addOrChange:true,
            drawerVisible: true,
            equipName:"",
        });
    }
    equipNameChange=(e)=>{
        this.setState({
            equipName: e.target.value,
        });
    }

    /////////////////////////////////////////////////////////////////////
    //获取会议室列表
    getEffectiveMeetroom=()=>{
        const url=global.localhostUrl+"meetRoom/getEffectiveMeetroom";
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
                roomList:data.data,
            })
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
    }
    cancelOne=(id)=>{
        const url=global.localhostUrl+"weekMeeting/cancelOne?id="+id;
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
            if(data.status){
                message.success(data.message);
            }else{
                message.error(data.message);
            }
            this.userFindAll();
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
    }
    //userFindAll
    userFindAll = () =>{
        const url=global.localhostUrl+"weekMeeting/userFindAll";
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
                dataSource:data.data
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

            const url=global.localhostUrl+"weekMeeting/insertOne";
            fetch(url, {
                method: "POST",
                mode: "cors",
                credentials:"include",//跨域携带cookie
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify({
                    beginTime:values.beginTime.format("YYYY-MM-DD"),
                    overTime:values.overTime.format("YYYY-MM-DD"),
                    week:values.week,
                    meetRoomId:values.meetRoomId,
                    meetBegin:values.meetBegin.format("HH:mm"),
                    meetOver:values.meetOver.format("HH:mm"),
                    note:values.note,
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
                        bookVisible: false,
                    })
                    form.resetFields();
                }else {
                    message.error(data.message);
                }

            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });

            console.log('Received values of form: ', values);
            console.log("开始日期",values.beginTime.format("YYYY-MM-DD"));
            console.log("结束日期",values.overTime.format("YYYY-MM-DD"));
            console.log("星期",values.week);
            console.log("会议室ID",values.meetRoomId);
            console.log("开始时间",values.meetBegin.format("HH:mm"));
            console.log("结束时间",values.meetOver.format("HH:mm"));
            console.log("备注",values.note);
            //form.resetFields();//数据清空

        });
    }
    render() {
        const columns=[
            {
                title:"序号",
                key:"id",
                render:(item,data,i)=>{
                    return(<div>{i+1}</div>)
                }
            },{
                title:"会议室",
                render:(item)=>{
                    return item.meetroom.name
                }
            },{
                title:"星期",
                dataIndex:"week",
                render:(item)=>{
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
            },{
                title:"会议开始时间",
                dataIndex:"meetBegin",
                key:"meetBegin",
                ...this.getColumnSearchProps("meetBegin")
            },{
                title:"会议结束时间",
                dataIndex:"meetOver",
                key:"meetOver",
                ...this.getColumnSearchProps("meetOver")
            },{
                title:"创建时间",
                dataIndex:"createTime",
                key:"createTime",
                ...this.getColumnSearchProps("createTime")
            },{
                title:"状态",
                dataIndex:"status",
                render:(item)=>{
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
            },{
                title:"操作",
                render:(item)=>{
                    return(
                        <div>
                            <Tooltip title="取消周会">
                                <Button onClick={()=>{this.cancelOne(item.id)}}><Icon style={{color:"red"}} type="delete" /></Button>
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
                            title={<h2 style={{float:'left',marginBottom:-3}}>每周例会</h2>}
                            extra={
                                <div style={{width:200}} >
                                    <Row>
                                        <Col span={24}>
                                            <Button type="primary" onClick={this.showAddEquip}>申请例会</Button>
                                        </Col>
                                    </Row>
                                </div>
                            }
                        >
                            <Table rowKey={record=>record.id} className={'table'} columns={columns} dataSource={this.state.dataSource} />
                        </Card>
                    </Col>
                </Row>
                <WeekMeetCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    roomList={this.state.roomList}
                    visible={this.state.drawerVisible}
                    onClose={this.onClose}
                    onCreate={this.handleCreate}
                    getOthersList={this.getOthersList}
                >
                </WeekMeetCreateForm>
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

export default WeekMeeting;
