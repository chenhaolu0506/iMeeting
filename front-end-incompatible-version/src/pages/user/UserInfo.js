import React, { Component } from "react";
import { message, Input, Modal, Button, Card, Row, Col } from "antd";
import global from "../../global";
import ChangePassword from "./tools/ChangePassword";

class UserInfo extends Component {
    componentDidMount() {
        this.getUserInfo();
    }

    constructor(props) {
        super(props);
        this.state = {
            resume: "",
            positionName: "",
            newPhone: "",
            phone: "",
            name: "",
            worknum: "",
            departName: "",
            password: "",
            pwd_code: "!!!",
            phone_code: "",
            disabled_getCode: false,
            codeTime: 0,
            disabled_changeBtn: true,
            visible: false,
        }
    }

    /////////////////////////////////////////////////Input输入的及时改变/////////////////////////////////////////////////
    newPhoneChange = (e) => {
        this.setState({ newPhone: e.target.value })
    }
    phoneCodeChange = (e) => {
        this.setState({ phone_code: e.target.value })
    }
    nameChange = (e) => {
        this.setState({ name: e.target.value })
    }
    departNameChange = (e) => {
        this.setState({ departName: e.target.value })
    }
    positionNameChange = (e) => {
        this.setState({ positionName: e.target.value })
    }
    workNumChange = (e) => {
        this.setState({ workNum: e.target.value })
    }
    phoneChange = (e) => {
        this.setState({ phone: e.target.value })
    }
    resumeChange = (e) => {
        this.setState({ resume: e.target.value })
    }

    /////////////////////////////////////////////////找回密码/////////////////////////////////////////////////
    // 验证验证码
    compareCode = () => {
        if (this.state.phone_code === this.state.pwd_code) {
            message.success("验证成功！");
            this.setState({
                visible: false,
            });
            this.changePhone();
        } else {
            message.error("验证失败！");
        }
    }
    //获取验证码60s
    codeTime = () => {
        const timer = setInterval(() => {
            if (this.state.codeTime > 0) {
                this.setState({
                    codeTime: this.state.codeTime - 1
                });
            } else {
                this.setState({
                    disabled_getCode: false,
                });
                clearInterval(timer);
            }
        }, 1000);
    }

    /////////////////////////////////////////////////对话框/////////////////////////////////////////////////
    //弹出对话框
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    //对话框确定
    handleOk = (e) => {
        console.log(e);
        this.compareCode();
    }
    //对话框取消
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    /////////////////////////////////////////////////请求/////////////////////////////////////////////////
    //get用户信息
    getUserInfo = () => {
        const url = global.localhostUrl + "showUserinfo";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(res => res.json())
            .then(json => {
                const data = json;
                console.log(data);
                this.setState(data.data);
            }).catch(function (e) {
                console.log(e);
                alert('系统错误');
            });
    }

    // 修改
    updateResume = () => {
        const url = global.localhostUrl + "updateResume?resume=" + this.state.resume;
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(res => res.json())
            .then(json => {
                const data = json;
                if (data.status) {
                    message.success("修改成功");
                }
                console.log(data);
            }).catch(function (e) {
                console.log(e);
                alert('系统错误');
            });
    }

    // 发送验证码请求
    getPhoneCode = () => {
        const phone = this.state.newPhone;
        const url = global.localhostUrl + "getCode?phone=" + phone;
        if (phone === "") {
            message.warning("手机号不能为空！");
        } else {
            fetch(url, {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify({}),
            }).then(res => res.json())
                .then(json => {
                    const data = json;
                    if (data.status === true) {
                        message.success("请求发送成功");
                        this.setState({
                            pwd_code: data.data,
                            disabled_getCode: true,
                            codeTime: 60,
                        }, this.codeTime);

                    } else if (!data.status) {
                        message.error("手机号码不正确");
                    }
                }).catch(function (e) {
                    console.log(e);
                    alert('系统错误');
                });
        }
    }

    // 修改手机号
    changePhone = () => {
        const phone = this.state.newPhone;
        const url = global.localhostUrl + "recordPhone?phone=" + phone;
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(res => res.json())
            .then(json => {
                const data = json;
                if (data.status === true) {
                    message.success("手机号修改成功");
                    this.setState({
                        phone: this.state.newPhone
                    }, this.codeTime);
                } else {
                    message.error("手机号修改失败！");
                }
            }).catch(function (e) {
                console.log(e);
                alert('系统错误');
            });
    }

    /////////////////////////////////////////////////主函数/////////////////////////////////////////////////
    render() {
        return (
            <div>
                <Row style={{ marginTop: 10, borderRadius: 10 }}>
                    <Col span={18} offset={3} >
                        <Card
                            title={<h1 style={{ float: 'left', marginBottom: -10 }}>个人资料</h1>}
                            extra={
                                <div style={{ width: 200 }} >
                                    <Row>
                                        <Col span={12}>
                                            <ChangePassword />

                                        </Col>
                                        <Col span={12}>
                                            <Button href="#" type={"primary"} onClick={this.updateResume}>保存</Button>
                                        </Col>
                                    </Row>
                                </div>
                            }
                        >
                            <h3 style={{ float: 'left', marginTop: 10 }}>姓名</h3>
                            <Input placeholder='姓名' value={this.state.name} onChange={this.nameChange} disabled />
                            <h3 style={{ float: 'left', marginTop: 10 }}>部门</h3>
                            <Input placeholder='部门' value={this.state.departName} onChange={this.departNameChange} disabled />
                            <h3 style={{ float: 'left', marginTop: 10 }}>职位</h3>
                            <Input placeholder='职位' value={this.state.positionName} onChange={this.positionNameChange} disabled />
                            <h3 style={{ float: 'left', marginTop: 10 }}>工号</h3>
                            <Input placeholder='工号' value={this.state.worknum} onChange={this.workNumChange} disabled />
                            <h3 style={{ float: 'left', marginTop: 10 }}>手机号</h3>
                            <div style={{ float: 'left', width: "100%" }}></div>
                            <Input style={{ float: 'left', width: "70%" }} placeholder='手机号' value={this.state.phone} onChange={this.phoneChange} disabled />
                            <Button style={{ float: 'left', marginLeft: "5%", width: "25%" }} type="primary" onClick={this.showModal}>修改</Button>
                            <div style={{ float: 'left', width: "100%" }}></div>
                            <h3 style={{ float: 'left', marginTop: 10 }}>简介</h3><Input.TextArea rows={4} placeholder='简介' value={this.state.resume} onChange={this.resumeChange} />
                        </Card>
                    </Col>
                </Row>

                <Modal
                    title="修改手机号"
                    visible={this.state.visible}
                    onOk={this.compareCode}
                    onCancel={this.handleCancel}
                    okType={"primary"}
                    okText={"修改"}
                    cancelText={"返回"}
                >

                    <Input style={{ marginTop: 10, borderRadius: 5 }} placeholder='手机号' onKeyUp={this.newPhoneChange}></Input>
                    <Input style={{ marginTop: 10, borderRadius: 5, width: "60%" }} placeholder='输入验证码' onKeyUp={this.phoneCodeChange}></Input>
                    <Button
                        style={{ marginTop: 10, borderRadius: 5, marginLeft: "2%", width: "36%" }}
                        type='default' disabled={this.state.disabled_getCode}
                        onClick={this.getPhoneCode}
                    >
                        {this.state.codeTime > 0 ? "请" + this.state.codeTime + "秒后再试" : "获取验证码"}
                    </Button>
                </Modal>
            </div>
        );
    }
}

export default UserInfo;