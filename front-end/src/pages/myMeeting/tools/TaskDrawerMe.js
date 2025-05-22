import React, { Component } from 'react';
import global from "../../../global";
import { Drawer, Table, message } from "antd"
class TaskDrawerMe extends Component {
    componentDidMount() {
    }
    state = {
        id: "",
        name: "",
        content: "",
        taskVisible: false,
        update: false,
    }
    levelChange = (e) => {
        this.setState({
            level: e.target.value
        })
    }
    nameChange = (e) => {
        this.setState({
            name: e.target.value
        })
    }
    contentChange = (e) => {
        this.setState({
            content: e.target.value
        })
    }
    onCancel = () => {
        this.setState({
            taskVisible: false,
        })
    }
    showUpdate = (id, name, content) => {
        this.setState({
            id: id,
            name: name,
            content: content,
            taskVisible: true,
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
                name: this.state.name,
                content: this.state.content,
                meetingId: this.props.meetingId,
            }),
        }).then(res => res.json())
            .then(json => {
                const data = json;
                if (data.status) {
                    message.success(data.message)
                    this.props.findByMeeting("", this.props.meetingId)
                    this.setState({
                        taskVisible: false,
                    })
                } else {
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
            }
        ];
        return (
            <Drawer
                title={"会议任务"}
                placement="right"
                closable={false}
                onClose={onClose}
                open={visible}
                width={"60%"}
            >
                <Table
                    rowKey={record => record.id}
                    columns={columns}
                    dataSource={this.props.taskList}
                />
            </Drawer>
        );
    }
}

export default TaskDrawerMe;