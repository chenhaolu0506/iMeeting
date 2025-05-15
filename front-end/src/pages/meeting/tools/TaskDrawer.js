import React, { Component } from 'react';
import global from "../../../global";
import { Button, Drawer, Modal, Table, Tooltip, Input, message } from "antd"
import { DeleteOutlined } from "@ant-design/icons";

class TaskDrawer extends Component {
    componentDidMount() { }
    state = {
        id: "",
        speaker: "",
        content: "",
        visible: false,
        update: false,
    }
    showAddTask = () => {
        this.setState({
            speaker: "",
            content: "",
            visible: true,
            update: false,
        })
    }
    speakerChange = (e) => {
        this.setState({
            speaker: e.target.value
        })
    }
    contentChange = (e) => {
        this.setState({
            content: e.target.value
        })
    }
    onCancel = () => {
        this.setState({
            visible: false,
        })
    }
    showUpdate = (id, speaker, content) => {
        this.setState({
            id: id,
            speaker: speaker,
            content: content,
            visible: true,
            update: true,
        })
    }
    insertOne = () => {
        const url = global.localhostUrl + "task/insertTask";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                name: this.state.speaker,
                content: this.state.content,
                meetingId: this.props.meetingId,
            }),
        }).then(res => res.json())
            .then(json => {
                // get result
                const data = json;
                if (data.status) {
                    message.success(data.message)
                    this.props.findByMeeting("", this.props.meetingId)
                    this.setState({
                        visible: false,
                    })
                } else {
                    message.error(data.message)
                }
            }).catch(function (e) {
                console.log(e);
                alert('系统错误');
            });
    }
    updateOne = () => {
        const url = global.localhostUrl + "task/updateTask";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                id: this.state.id,
                speaker: this.state.speaker,
                content: this.state.content,
                meetingId: this.props.meetingId,
            }),
        }).then(res => res.json())
            .then(json => {
                const data = json;
                if (data.status) {
                    message.success(data.message)
                    this.props.findByMeeting("", this.props.meetingId)
                } else {
                    message.error(data.message)
                }
                this.setState({
                    visible: false,
                })
            }).catch(function (e) {
                console.log(e);
                alert('系统错误');
            });
    }

    deleteOne = (id) => {
        const url = global.localhostUrl + "task/deleteTask?taskId=" + id;
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
            }),
        }).then(res => res.json())
            .then(json => {
                const data = json;
                if (data.status) {
                    message.success(data.message)
                    this.props.findByMeeting("", this.props.meetingId)
                    this.setState({
                        visible: false,
                    })
                } else {
                    message.error(data.message)
                }
            }).catch(function (e) {
                console.log(e);
                alert('系统错误');
            });
    }

    render() {
        const { visible, onClose } = this.props;
        const columns = [
            {
                title: "序号",
                key: "id",
                render: (item, data, i) => {
                    return (<div>{i + 1}</div>)
                }
            }, {
                title: "会议任务",
                dataIndex: "name",
            }, {
                title: "任务要求",
                dataIndex: "content",
            }, {
                title: "操作",
                render: (item) => {
                    return (
                        <div>
                            <Tooltip title="删除">
                                <Button onClick={() => { this.deleteOne(item.id) }}><DeleteOutlined style={{ color: "red" }} /></Button>
                            </Tooltip>
                        </div>
                    )
                }
            }
        ];
        return (
            <Drawer
                title={
                    <Button href="#" type={"primary"} onClick={this.showAddTask}>添加</Button>
                }
                placement="right"
                closable={false}
                onClose={onClose}
                open={visible}
                width={"60%"}
            >
                <Table
                    rowKey={record => record.id}
                    columns={columns}
                    dataSource={this.props.taskList} />
                <Modal
                    title={"会议任务"}
                    open={this.state.visible}
                    onCancel={this.onCancel}
                    onOk={this.state.update ? this.updateOne : this.insertOne}
                >
                    任务名：<Input value={this.state.speaker} onChange={this.speakerChange} />
                    任务要求：<Input.TextArea value={this.state.content} onChange={this.contentChange} />
                </Modal>
            </Drawer>
        );
    }
}

export default TaskDrawer;