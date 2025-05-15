import React, { Component } from "react";
import global from "../../../global";
import { Button, Drawer, Modal, Table, Tooltip, Input, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

class OutlineDrawer extends Component {
    componentDidMount() { }
    state = {
        id: "",
        speaker: "",
        content: "",
        outLineVisible: false,
        level: "",
        update: false,
    }

    showAddOutline = () => {
        this.setState({
            speaker: "",
            content: "",
            level: "",
            outLineVisible: true,
            update: false,
        })
    }

    levelChange = (e) => {
        this.setState({
            level: e.target.value,
        })
    }

    speakerChange = (e) => {
        this.setState({
            speaker: e.target.value,
        })
    }

    contentChange = (e) => {
        this.setState({
            content: e.target.value,
        })
    }

    onCancel = () => {
        this.setState({
            outLineVisible: false,
        })
    }

    showUpdate = (id, level, speaker, content) => {
        this.setState({
            id: id,
            speaker: speaker,
            content: content,
            level: level,
            outLineVisible: true,
            update: true,
        })
    }

    insertOne = () => {
        const url = global.localhostUrl + "outline/insertMeetingOutline";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                speaker: this.state.speaker,
                content: this.state.content,
                level: this.state.level,
                meetingId: this.props.meetingId,
            }),
        }).then(res => res.json())
            .then(json => {
                const data = json;
                if (data.status) {
                    message.success(data.message)
                    this.props.findByMeeting("", this.props.meetingId)
                    this.setState({
                        outLineVisible: false,
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
        const url = global.localhostUrl + "outline/updateMeetingOutline";
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
                level: this.state.level,
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
                    outLineVisible: false,
                })
            }).catch(function (e) {
                console.log(e);
                alert('系统错误');
            });
    }

    deleteOne = (id) => {
        const url = global.localhostUrl + "outline/deleteMeetingOutline?outlineId=" + id;
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
                        outLineVisible: false,
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
                title: "level",
                dataIndex: "level",
            }, {
                title: "主讲人",
                dataIndex: "speaker",
            }, {
                title: "主要内容",
                dataIndex: "content",
            }, {
                title: "操作",
                render: (item) => {
                    return (
                        <div>
                            <Tooltip title="修改">
                                <Button onClick={() => { this.showUpdate(item.id, item.level, item.speaker, item.content) }}><EditOutlined /></Button>
                            </Tooltip>
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
                    <Button href="#" type={"primary"} onClick={this.showAddOutline}>添加</Button>
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
                    dataSource={this.props.outLineList} />
                <Modal
                    title={"大纲概要"}
                    open={this.state.outLineVisible}
                    onCancel={this.onCancel}
                    onOk={this.state.update ? this.updateOne : this.insertOne}
                >
                    level：<Input value={this.state.level} onChange={this.levelChange} />
                    主讲人：<Input value={this.state.speaker} onChange={this.speakerChange} />
                    主要内容：<Input.TextArea value={this.state.content} onChange={this.contentChange} />
                </Modal>
            </Drawer>
        );
    }
}

export default OutlineDrawer;