import React, { Component } from 'react';
import {Table, Card, Col, Row, Button, Tooltip, Icon, message, Input, Drawer, Modal} from "antd";
import global from '@/global';
import Highlighter from "react-highlight-words";

class DepartManage extends Component {
    componentDidMount(){
        this.selectAll();
        this.selectPosition();
    }
    state={

        dataSource:[],
        departName:"",
        departId:0,
        positionList:[],
        positionId:0,
        positionName:"",
        positionVisible:false,
        drawerVisible:false,
        addOrChange:false,
        addPositionVisible:false,
        modalVisible: false,
        positionModalVisible:false,
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

    showPosition = (ev,id,name) => {
        this.setState({
            positionVisible:true,
            positionId:id,
            positionName:name,
        })
    }
    positionNameChange=(e)=>{
        this.setState({
            positionName:e.target.value,
        })
    }
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            modalVisible: false,
            positionVisible: false,
            positionModalVisible:false,
            addPositionVisible:false,
        });
    }
    onClose = (e) => {
        console.log(e);
        this.setState({
            drawerVisible: false,
        });
    }
    showDeletePosition=(ev,id)=>{
        this.setState({
            positionModalVisible: true,
            positionId:id,
        });
    }
    showDelete=(ev,id)=>{
        this.setState({
            modalVisible: true,
            departId:id,
        });
    }
    showUpdate=(ev,id,name)=>{
        this.setState({
            addOrChange:false,
            drawerVisible: true,
            departName:name,
            departId:id,
        });
    }
    showAddPosition=()=>{
        this.setState({
            addPositionVisible: true,
        });
    }
    showAddDepart=()=>{
        this.setState({
            addOrChange:true,
            drawerVisible: true,
            departName:"",
        });
    }
    departNameChange=(e)=>{
        this.setState({
            departName: e.target.value,
        });
    }

    /////////////////////////////////////////////////////////////////////
    //positionEditOne
    positionEditOne = () =>{
        const url=global.localhostUrl+"position/editOne";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",//跨域携带cookie
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                id:this.state.positionId,
                name:this.state.positionName,
                departId:this.state.departId,
            }),
        }).then(function (res) {//function (res) {} 和 res => {}效果一致
            return res.json()
        }).then(json => {
            // get result
            const data = json;
            console.log(data);
            if(data.status){
                message.success("操作成功！");
            }
            this.selectAll();
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
    }

    //positionInsertOne
    positionInsertOne = () =>{
        const url=global.localhostUrl+"position/insertOne?departId="+this.state.departId+"&positionName="+this.state.positionName;
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
                message.success("操作成功！");
                this.handleCancel();
            }
            this.selectPosition();
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
    }
    //insertOne
    insertOne = () =>{
        const url=global.localhostUrl+"depart/insertOne?departName="+this.state.departName;
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
                message.success("操作成功！");
            }
            this.selectAll();
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
    }
    //updateOne
    updateOne = () =>{
        const url=global.localhostUrl+"depart/editOne?departName="+this.state.departName+"&departId="+this.state.departId;
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
                message.success("操作成功！")
            }
            this.selectAll();
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
    }
    //deleteOnePosition
    deleteOnePosition = () =>{
        const url=global.localhostUrl+"position/deleteOne?positionId="+this.state.positionId;
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
                this.handleCancel();
            }else{
                message.error(data.message);
            }
            this.selectPosition();
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
    }
    //deleteOne
    deleteOne = () =>{
        const url=global.localhostUrl+"depart/deleteOne?departId="+this.state.departId;
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
            this.selectAll();
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
    }
    //selectPosition
    selectPosition = () =>{
        const url=global.localhostUrl+"position/selectAll";
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
                positionList:data.data[0],
            })
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
    }
    //selectAll
    selectAll = () =>{
        const url=global.localhostUrl+"depart/selectAll";
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
                dataSource:data.data,
                drawerVisible:false,
                addOrChange:false,
                modalVisible: false,
            })
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
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
                title:"名称",
                dataIndex:"name",
                key:"name",
                ...this.getColumnSearchProps("name"),
            },{
                title:"操作",
                render:(item)=>{
                    return(
                        <div>
                            <Tooltip title="修改">
                                <Button onClick={(ev)=>{this.showUpdate(ev,item.id,item.name)}}><Icon type="edit" /></Button>
                            </Tooltip>
                            <Tooltip title="删除">
                                <Button onClick={(ev)=>{this.showDelete(ev,item.id)}}><Icon style={{color:"red"}}type={"delete"}></Icon></Button>
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
                            title={<h2 style={{float:'left',marginBottom:-3}}>部门管理</h2>}
                            extra={
                                <div style={{width:200}} >
                                    <Row>
                                        <Col span={24}>
                                            <Button type="primary" onClick={this.showAddDepart}>添加部门</Button>
                                        </Col>
                                    </Row>
                                </div>
                            }
                        >
                            <Table rowKey={record=>record.id} className={'table'} columns={columns} dataSource={this.state.dataSource} />
                        </Card>
                    </Col>
                </Row>
                <Drawer
                    title={
                        this.state.addOrChange?
                            <Button href="#" type={"primary"} onClick={this.insertOne}>添加</Button>
                            :
                            <Button href="#" type={"primary"} onClick={this.updateOne}>保存修改</Button>
                    }
                    placement="right"
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.drawerVisible}
                    width={"60%"}
                >
                    <Card>
                        部门名称：
                        <Input value={this.state.departName} onChange={this.departNameChange}/>
                        <br/>
                        <div style={{display:this.state.addOrChange?"none":"block"}}>
                            所属职位：
                            <Button type="primary" onClick={this.showAddPosition}>添加职位</Button>
                            {
                                this.state.positionList.map((item)=>{
                                    if(item.departId===this.state.departId){
                                        return (
                                            <div key={item.id}>
                                                <Button  onClick={ev=>{this.showPosition(ev,item.id,item.name)}}>
                                                    {item.name}
                                                </Button>
                                                <Tooltip title="删除">
                                                    <Button onClick={(ev)=>{this.showDeletePosition(ev,item.id)}}><Icon style={{color:"red"}}type={"delete"}></Icon></Button>
                                                </Tooltip>
                                                <br/>
                                            </div>
                                        )
                                    }else{
                                        return null;
                                    }

                                })
                            }
                        </div>

                    </Card>
                </Drawer>
                <Modal
                    visible={this.state.modalVisible}
                    onOk={this.deleteOne}
                    onCancel={this.handleCancel}
                    okText={"确定"}
                    cancelText={"我再想想"}
                >
                    <h3>您确定要删除此部门吗</h3>
                </Modal>
                <Modal
                    visible={this.state.positionModalVisible}
                    onOk={this.deleteOnePosition}
                    onCancel={this.handleCancel}
                    okText={"确定"}
                    cancelText={"我再想想"}
                >
                    <h3>您确定要删除此职位吗</h3>
                </Modal>
                <Modal
                    title={"职位信息"}
                    visible={this.state.positionVisible}
                    onOk={this.positionEditOne}
                    onCancel={this.handleCancel}
                    okText={"保存"}
                    cancelText={"取消"}
                >
                    <Input value={this.state.positionName} onChange={this.positionNameChange}/>
                </Modal>
                <Modal
                    title={"添加职位"}
                    visible={this.state.addPositionVisible}
                    onOk={this.positionInsertOne}
                    onCancel={this.handleCancel}
                    okText={"添加"}
                    cancelText={"取消"}
                >
                    <Input value={this.state.positionName} onChange={this.positionNameChange}/>
                </Modal>
            </div>
        );
    }
}

export default DepartManage;
