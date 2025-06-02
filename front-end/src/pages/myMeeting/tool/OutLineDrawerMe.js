import React, { Component } from 'react';
import global from '@/global';
import {Button, Drawer, Icon, Modal, Table, Tooltip, Input, message} from "antd"
class OutLineDrawerMe extends Component {
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
            }
        ];
        return (
            <Drawer
                title={"会议大纲"}
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

export default OutLineDrawerMe;
