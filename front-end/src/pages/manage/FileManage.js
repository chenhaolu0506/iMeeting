import React, { Component } from 'react';
import {Table, Card, Col, Row, Button, Tooltip, Icon, message, Input, Drawer, Modal} from "antd";
import global from '@/global';
import Highlighter from 'react-highlight-words';
class FileManage extends Component {
    componentDidMount(){
        this.findAllOnManage();
    }
    state={
        dataSource:[],
        drawerVisible:false,
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


    /////////////////////////////////////////////////////////////////////
    //
    findAllOnManage=()=>{
        const url=global.localhostUrl+"file/findAllOnManage";
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
    //updateOne
    updateOne = (id,status) =>{
        const url=global.localhostUrl+"file/editOne?fileId="+id+"&status="+status;
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
                message.success(data.message)
            }
            this.findAllOnManage();
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
    }
    //deleteOne
    deleteOne = (id) =>{
        const url=global.localhostUrl+"file/deleteOne?fileId="+id;
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
            this.findAllOnManage();
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
    }
    download=(id)=>{
        const url=global.localhostUrl+"file/downLoad?fileId="+id;
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
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
    }
    // //selectAll
    // selectAll = () =>{
    //     const url=global.localhostUrl+"equip/selectAll";
    //     fetch(url, {
    //         method: "POST",
    //         mode: "cors",
    //         credentials:"include",//跨域携带cookie
    //         headers: {
    //             "Content-Type": "application/json;charset=utf-8",
    //         },
    //         body: JSON.stringify({}),
    //     }).then(function (res) {//function (res) {} 和 res => {}效果一致
    //         return res.json()
    //     }).then(json => {
    //         // get result
    //         const data = json;
    //         console.log(data);
    //         this.setState({
    //             dataSource:data.data,
    //             drawerVisible:false,
    //             addOrChange:false,
    //             modalVisible: false,
    //         })
    //     }).catch(function (e) {
    //         console.log("fetch fail");
    //         alert('系统错误');
    //     });
    // }
    render() {
        const columns=[
            {
                title:"序号",
                key:"id",
                render:(item,data,i)=>{
                    return(<div>{i+1}</div>)
                }
            },{
                title:"文件名",
                dataIndex:"fileName",
                key:"fileName",
                ...this.getColumnSearchProps("fileName")
            },{
                title:"会议室名",
                dataIndex:"meetroom",
                render:(item)=>{
                    return item.name
                }
            },{
                title:"会议名",
                dataIndex:"meeting",
                render:(item)=>{
                    return item.topic
                }
            },{
                title:"状态",
                dataIndex:"status",
                render:(item)=>{
                    switch (item) {
                        case 1:
                            return "允许下载"
                        case 2:
                            return "禁止下载"
                        default:
                            return item
                    }
                }
            },{
                title:"操作",
                render:(item)=>{
                    return(
                        <div>
                            <Tooltip title="允许下载">
                                <Button onClick={()=>{this.updateOne(item.id,1)}}><Icon type="check" /></Button>
                            </Tooltip>
                            <Tooltip title="禁止下载">
                                <Button onClick={()=>{this.updateOne(item.id,2)}}><Icon style={{color:"red"}} type="close" /></Button>
                            </Tooltip>
                            <Tooltip title="下载">
                                {/*<Button onClick={()=>{this.download(item.id)}}><Icon type="download" /></Button>*/}
                                <Button
                                    onClick={()=>{
                                        window.location.href = item.fileUrl+"/"+item.fileName
                                    }}
                                >
                                    <Icon type="download" />
                                </Button>
                            </Tooltip>
                            <Tooltip title="删除">
                                <Button onClick={()=>{this.deleteOne(item.id)}}><Icon style={{color:"red"}} type="delete" /></Button>
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
                            title={<h2 style={{float:'left',marginBottom:-3}}>文件管理</h2>}
                            extra={
                                <div style={{width:200}} >
                                    <Row>
                                        <Col span={24}>
                                        </Col>
                                    </Row>
                                </div>
                            }
                        >
                            <Table rowKey={record=>record.id} className={'table'} columns={columns} dataSource={this.state.dataSource} />
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default FileManage;
