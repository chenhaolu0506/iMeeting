import React, { Component } from 'react';
import {Button, Input, Modal,message,Row,Col} from "antd";
import global from '@/global';
class ChangePassword extends Component {
    state = {
        visible: false,
        oldPassword:"",
        newPassword:"",
        newConfig:"",
    }

    showModal = () => {
        this.setState({
            visible: true,
            oldPassword:"",
            newPassword:"",
            newConfig:"",
        });
    }

    handleOk = (e) => {
        console.log(e);
        if(this.state.oldPassword===""){
            message.error("旧密码不能为空！");
        }else
        if(this.state.newPassword===""){
            message.error("新密码不能为空！");
        }else
        if(this.state.newConfig===this.state.newPassword){
            this.changePassword();
        }else{
            message.error("新密码校验不一致！")
        }
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    oldPasswordChange=(e)=>{
        this.setState({
            oldPassword: e.target.value,
        });
    }

    newPasswordChange=(e)=>{
        this.setState({
            newPassword: e.target.value,
        });
    }

    newConfigChange=(e)=>{
        this.setState({
            newConfig: e.target.value,
        });
    }
    ///////////////////////////////////////////////////////////////////////////
    //changePassword
    changePassword = () =>{
        const url=global.localhostUrl+"changePwd?newPassword="+this.state.newPassword+"&oldPassword="+this.state.oldPassword;
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
                this.setState({
                    visible: false,
                });
                message.success("密码修改成功！");
            }else{
                message.error(data.message);
            }

        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
    }

    render() {
        return (
            <div style={this.props.style}>
                <Button type="primary" onClick={this.showModal}>修改密码</Button>
                <Modal
                    title="修改密码"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okType={"primary"}
                    okText={"修改"}
                    cancelText={"返回"}
                >
                    <Row >
                        <Col span={24}>
                            <Input.Password  style={{marginTop:10}} value={this.state.oldPassword} placeholder='输入旧密码' onChange={this.oldPasswordChange}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Input.Password style={{marginTop:10}} value={this.state.newPassword} placeholder='输入新密码' onChange={this.newPasswordChange}/>

                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Input.Password style={{marginTop:10}} value={this.state.newConfig} placeholder='再次输入新密码' onChange={this.newConfigChange}/>
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}
export default ChangePassword;
