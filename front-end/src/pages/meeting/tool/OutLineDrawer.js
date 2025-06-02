import React, { Component } from 'react';
import global from '@/global';
import {Button, Drawer, Icon, Modal, Table, Tooltip, Input, message} from "antd"
class OutLineDrawer extends Component {
    componentDidMount(){
    }
    state={
        id:"",
        speaker:"",
        content:"",
        outLineVisible:false,
        level:"",
        update:false,
    }
    showAddOutline=()=>{
        this.setState({
            speaker:"",
            content:"",
            level:"",
            outLineVisible:true,
            update:false,
        })
    }
    levelChange=(e)=>{
        this.setState({
            level:e.target.value
        })
    }
    speakerChange=(e)=>{
        this.setState({
            speaker:e.target.value
        })
    }
    contentChange=(e)=>{
        this.setState({
            content:e.target.value
        })
    }
    onCancel=()=>{
        this.setState({
            outLineVisible:false,
        })
    }
    showUpdate=(id,level,speaker,content)=>{
        this.setState({
            id:id,
            level:level,
            speaker:speaker,
            content:content,
            outLineVisible:true,
            update:true,
        })
    }
    insertOne=()=>{
        const url=global.localhostUrl+"outline/insertOne";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",//跨域携带cookie
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                speaker:this.state.speaker,
                content:this.state.content,
                level:this.state.level,
                meetingId:this.props.meetingId,
            }),
        }).then(function (res) {//function (res) {} 和 res => {}效果一致
            return res.json()
        }).then(json => {
            // get result
            const data = json;
            console.log(data);
            if(data.status){
                message.success(data.message)
                this.props.findByMeeting("",this.props.meetingId)
                this.setState({
                    outLineVisible:false,
                })
            }else{
                message.error(data.message)
            }
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
    }
    updateOne=()=>{
        const url=global.localhostUrl+"outline/updateOne";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",//跨域携带cookie
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                id:this.state.id,
                speaker:this.state.speaker,
                content:this.state.content,
                level:this.state.level,
                meetingId:this.props.meetingId,
            }),
        }).then(function (res) {//function (res) {} 和 res => {}效果一致
            return res.json()
        }).then(json => {
            // get result
            const data = json;
            console.log(data);
            if(data.status){
                message.success(data.message)
                this.props.findByMeeting("",this.props.meetingId)
            }else{
                message.error(data.message)
            }
            this.setState({
                outLineVisible:false,
            })
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
    }
    deleteOne=(id)=>{
        const url=global.localhostUrl+"outline/deleteOne?outlineId="+id;
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",//跨域携带cookie
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
            }),
        }).then(function (res) {//function (res) {} 和 res => {}效果一致
            return res.json()
        }).then(json => {
            // get result
            const data = json;
            console.log(data);
            if(data.status){
                message.success(data.message)
                this.props.findByMeeting("",this.props.meetingId)
                this.setState({
                    outLineVisible:false,
                })
            }else{
                message.error(data.message)
            }
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
    }

    render() {
        const {
            visible, onClose
        } = this.props;
        const columns=[
            {   title:"序号",
                key:"id",
                render:(item,data,i)=>{
                    return(<div>{i+1}</div>)
                }
            },{
                title:"level",
                dataIndex:"level",
            },{
                title:"主讲人",
                dataIndex:"speaker",
            },{
                title:"主要内容",
                dataIndex:"content",
            },{
                title:"操作",
                render:(item)=>{
                    return(
                        <div>
                            <Tooltip title="修改">
                                <Button onClick={()=>{this.showUpdate(item.id,item.level,item.speaker,item.content)}}><Icon type="edit" /></Button>
                            </Tooltip>
                            <Tooltip title="删除">
                                <Button onClick={()=>{this.deleteOne(item.id)}}><Icon style={{color:"red"}}type={"delete"}></Icon></Button>
                            </Tooltip>
                        </div>
                    )
                }
            }
        ];
        return (
            <Drawer
                title={
                    <Button href="#" type={"primary"} onClick={this.showAddOutline}>添加</Button>
                }
                placement="right"
                closable={false}
                onClose={onClose}
                visible={visible}
                width={"60%"}
            >
                <Table
                    rowKey={record=>record.id}
                    columns={columns}
                    dataSource={this.props.outLineList} />
                <Modal
                    title={"大纲概要"}
                    visible={this.state.outLineVisible}
                    onCancel={this.onCancel}
                    onOk={this.state.update?this.updateOne:this.insertOne}
                >
                    level：<Input value={this.state.level} onChange={this.levelChange}/>
                    主讲人：<Input value={this.state.speaker} onChange={this.speakerChange}/>
                    主要内容：<Input.TextArea value={this.state.content} onChange={this.contentChange}/>
                </Modal>
            </Drawer>
        );
    }
}

export default OutLineDrawer;
