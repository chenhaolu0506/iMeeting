import React, { Component } from 'react';
import { Button, Input, Modal, message, Row, Col } from "antd";
import global from '@/global';
class ChangePassword extends Component {
    state = {
        visible: false,
        oldPassword: "",
        newPassword: "",
        newConfig: "",
    }

    // 弹出框
    showModal = () => {
        this.setState({
            visible: true,
            oldPassword: "",
            newPassword: "",
            newConfig: "",
        });
    }

    // 修改密码
    handleOk = e => {
        if (this.state.oldPassword === "") {
            message.error("旧密码不能为空");
        } else if (this.state.newPassword === "") {
            message.error("新密码不能为空");
        } else if (this, this.state.newConfig === this.state.newPassword) {
            this.changePassword();
        } else {
            message.error("两次密码不一致");
        }
    }

    // 取消
    handleCancel = e => {
        this.setState({
            visible: false,
        });
    }

    oldPasswordChange = (e) => {
        this.setState({
            oldPassword: e.target.value,
        });
    }

    newPasswordChange = (e) => {
        this.setState({
            newPassword: e.target.value,
        });
    }

    newConfigChange = (e) => {
        this.setState({
            newConfig: e.target.value,
        });
    }
    ///////////////////////////////////////////////////////////////////////////
    changePassword = () => {
        const url = global.localhostUrl + "changePwd?newPassword=" + this.state.newPassword + "&oldPassword=" + this.state.oldPassword;
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include", // 跨域携带cookie
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(res => res.json())
            .then(json => {
                const data = json;
                if (data.status) {
                    message.success("密码修改成功");
                    this.setState({
                        visible: false,
                    });
                } else {
                    message.error(data.message);
                }
            }).catch(function (e) {
                console.log(e);
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
                            <Input.Password style={{ marginTop: 10 }} value={this.state.oldPassword} placeholder='输入旧密码' onChange={this.oldPasswordChange} />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Input.Password style={{ marginTop: 10 }} value={this.state.newPassword} placeholder='输入新密码' onChange={this.newPasswordChange} />

                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Input.Password style={{ marginTop: 10 }} value={this.state.newConfig} placeholder='再次输入新密码' onChange={this.newConfigChange} />
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}
export default ChangePassword;
