import React, { Component } from 'react';
import { Button, Card, Col, Row, Table, Tooltip, message } from 'antd'
import global from '../../global'
import VideoCreateForm from './tools/VideoCreateForm'

class MyVideoMeeting extends Component {
    //任务：
    //2。添加视频会议
    //3。结束视频会议
    //4。创建者只显示一个视频会议
    componentDidMount() {
        this.selectMyVideoRoom();
    }
    state = {
        userId: "12321",
        userSig: "eJw1j1FPgzAURv8LrxpTSgto4kNdptkCycjWMPbSNLSbFwYiu1bR*N*djL2e8-Cd78fbJOs73XVglEYV9MZ78Ih3O2L71UFvld6j7c-Y55xTQq4WjG0R9nBxNKD*JE5wOJN0LmeLF5kXwrbL4w747PTknj8zti1Ncp-jshgyKYM1pmZTV2EjYC5eaz8-YuYc4KpqWLzzY7p1onE3q*9kUekC0kFwmR-ey8frmKnVmP8fwQihJGacTRKhsZfwKGJhRMKJ67J8*2hR4dDZ8e-vH-sAUEs_",
        roomid: "11",
        dataSource: [],
        visible: false,
    }
    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }
    joinMeeting = (id) => {
        const url = global.localhostUrl + "video/joinVideoMeeting";
        this.setState({
            roomid: id,
        }, () => {
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
                    this.setState({
                        userId: data.data[0],
                        userSig: data.data[2],
                    }, () => {
                        window.open("https://www.jglo.top:8091/RTC/index.html?userId=" + this.state.userId + "&userSig=" + this.state.userSig + "&roomid=" + this.state.roomid)
                    })
                }).catch(function (e) {
                    console.log("fetch fail");
                    alert('系统错误');
                })
        });
    }
    //查找我参加的视频会议
    selectMyVideoRoom = () => {
        const url = global.localhostUrl + "video/selectMyVideoRoom";
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
                this.setState({
                    dataSource: data.data,
                })
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
    }
    //结束视频会议
    endVideoMeeting = (id) => {
        const url = global.localhostUrl + "video/endVideoMeeting?id=" + id;
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
                    message.success(data.message);
                    this.selectMyVideoRoom();
                } else {
                    message.error(data.message);
                }
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
            const url = global.localhostUrl + "video/createVideoMeeting";
            fetch(url, {
                method: "POST",
                mode: "cors",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                },
                body: JSON.stringify({
                    videoRoomName: values.title,
                    userId: values.guests,
                }),
            }).then(res => res.json())
                .then(json => {
                    const data = json;
                    if (data.status) {
                        message.success("预定信息提交成功！")
                        this.setState({
                            bookVisible: false,
                        })
                        form.resetFields();
                        this.selectMyVideoRoom();
                    } else {
                        message.error(data.message);
                    }
                }).catch(function (e) {
                    console.log("fetch fail");
                    alert('系统错误');
                });
        });
    }
    render() {
        const columns = [
            {
                title: "序号",
                key: "id",
                render: (item, data, i) => {
                    return (<div>{i + 1}</div>)
                }
            }, {
                title: "视频会议名",
                dataIndex: "videoRoomName",
            }, {
                title: "创建人",
                dataIndex: "userinfo",
                render: (item) => {
                    return item.name
                }
            }, {
                title: "创建时间",
                dataIndex: "createTime",
            }, {
                title: "操作",
                render: (item) => {
                    return (
                        <div>
                            <Tooltip title="加入视频会议">
                                <Button onClick={() => this.joinMeeting(item.id, item.videoRoomName)}><LoginOutlined /></Button>
                            </Tooltip>
                            <Tooltip title="结束会议">
                                <Button onClick={() => this.endVideoMeeting(item.id)}><CloseOutlined style={{ color: "red" }} /></Button>
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
                            title={<h2 style={{ float: 'left', marginBottom: -3 }}>视频会议</h2>}
                            extra={
                                <div style={{ width: 200 }} >
                                    <Row>
                                        <Col span={24}>
                                            <Button type="primary" onClick={() => {
                                                this.setState({
                                                    visible: true
                                                })
                                            }
                                            }>创建视频会议</Button>
                                        </Col>
                                    </Row>
                                </div>
                            }
                        >
                            <Table rowKey={record => record.id} columns={columns} dataSource={this.state.dataSource} />
                        </Card>
                    </Col>
                </Row>
                <VideoCreateForm
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.visible}
                    onClose={() => {
                        this.setState({
                            visible: false
                        })
                    }}
                    onCreate={this.handleCreate}
                >
                </VideoCreateForm>
            </div>
        );
    }
}
export default MyVideoMeeting;