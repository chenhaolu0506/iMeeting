import React, { Component } from "react";
import logo from "../img/logo/logo1024.png";
import { Button, Input, message, Drawer } from "antd";
import { EllipsisOutlined, SearchOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";

class Head extends Component {
    constructor(props, context){
        super(props, context);
        this.state = {
            username: "",
            password: "",
            visible: false,
            name: "登录",
            loading: false
        }
    }

    // 弹出登录界面
    showDrawer = () => {
        this.setState({
            visible: true
        });
    };

    // 关闭登录界面
    onClose = () => {
        this.setState({
            visible: false
        });
    };

    // 修改用户名显示
    nameChange = (e) => {
        this.setState({
            name: e
        })
    }

    // 用户名改变
    usernameChange = (e) => {
        this.setState({
            username: e.target.value
        })
    }

    // 密码改变
    passwordChange = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    // 登录
    enterLoading = () => {
        this.setState({
            loading: true
        })
        this.sendAjax();
        this.overLoading();
        this.onClose();
    }

    // 加载2秒
    overLoading = () => {
        setInterval(() => {
            this.setState({
                loading: false
            })
        }, 2000)
    }

    // 发送ajax请求
    sendAjax = () => {
        const username = this.state.username;
        const password = this.state.password;
        if (username === "" || password === "") {
            message.error("请输入用户名和密码");
        } else {
            fetch("http://localhost:8080/login", {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }).then(res => res.json()) 
            .then(json => {
                const data = json;
                console.log(data);
                if (data.message === "账号或密码错误") {
                    message.error("账号或密码错误");
                } else {
                    this.nameChange(data.data.name);
                    message.success("登录成功");
                    this.onClose();
                }
            }).catch(function (e) {
                console.log(e);
                alert("系统错误");
            });
        }
    }

    render() {
        return (
            <div className={'head'}>
                <img src={logo} className="App-logo logo" alt="logo" />
                <span className={'companyName'}><h2><Link to="/welcome">我的主页</Link></h2></span>
                <Button className={'headBtn1'} type="primary" onClick={this.showDrawer}>{this.state.name}</Button>
                <Button className={'headBtn1'} type='primary' ><EllipsisOutlined /></Button>
                <Input className={'searchText'} suffix={<SearchOutlined />} />

                <Drawer title="用户登录" placement="right" onClose={this.onClose} visible={this.state.visible}>
                    <p>用户</p>
                    <Input type='' placeholder='用户名' onKeyUp={this.usernameChange}></Input>
                    <br/>
                    <br/>
                    <p>密码</p>
                    <Input type='password' placeholder='密码' onKeyUp={this.passwordChange}></Input>
                    <Button className={'headBtn1'} type='default' onClick={this.onClose}>忘记密码</Button>
                    <Button className={'headBtn2'} type='primary' loading={this.state.loading} onClick={this.enterLoading} >登录</Button>
                    <Button className={'headBtn3'} type='default' onClick={this.sendAjax}>还没有账号？点击注册</Button>
                </Drawer>
            </div>
        )
    }
}

export default Head;