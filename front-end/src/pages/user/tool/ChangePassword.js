import React, { Component } from "react";
import { Button, message, Input, Modal, Row, Col } from "antd";
import global from '../../../global';

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
        console.log(e);
        if (this.state.oldPassword === "") {
            message.error("旧密码不能为空");
        } else if (this.state.newPassword === "") {
            message.error("新密码不能为空");
        } else if (this,this.state.newConfig === this.state.newPassword) {
            this.changePassword();
        } else {
            message.error("两次密码不一致");
        }
    }

    // 取消
    handleCancel = e => {
        console.log(e);
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

    changePassword = () => {
        
    }
}