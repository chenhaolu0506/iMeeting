import React, { Component } from 'react';
import { Button, Card, Col, Input, message, Row, } from "antd";
import global from '@/global';

class MeetParaManage extends Component {
    componentDidMount() {
        this.toMeetingRoomParam();
    }
    state = {
        id: "",
        begin: "",
        over: "",
        dateLimit: "",
        timeLimit: "",
        timeInterval: "",
    }
    beginChange = (e) => {
        this.setState({
            begin: e.target.value,
        });
    }
    overChange = (e) => {
        this.setState({
            over: e.target.value,
        });
    }
    dateLimitChange = (e) => {
        this.setState({
            dateLimit: e.target.value,
        });
    }
    timeLimitChange = (e) => {
        this.setState({
            timeLimit: e.target.value,
        });
    }
    timeIntervalChange = (e) => {
        this.setState({
            timeInterval: e.target.value,
        });
    }
    /////////////////////////////////////////////////////////////////////////////////
    //toMeetingRoomParam显示全部数据
    toMeetingRoomParam = () => {
        const url = global.localhostUrl + "meetingRoomParam/toMeetingRoomParam";
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
                    id: data.data.id,
                    begin: data.data.begin,
                    over: data.data.over,
                    dateLimit: data.data.dateLimit,
                    timeLimit: data.data.timeLimit,
                    timeInterval: data.data.timeInterval,
                })
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
    }
    //updateMeetingRoomParam
    updateMeetingRoomParam = () => {
        const url = global.localhostUrl + "meetingRoomParam/updateMeetingRoomParam";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({
                id: this.state.id,
                begin: this.state.begin,
                over: this.state.over,
                dateLimit: this.state.dateLimit,
                timeLimit: this.state.timeLimit,
                timeInterval: this.state.timeInterval,
            }),
        }).then(res => res.json())
            .then(json => {
                const data = json;
                if (data.status) {
                    message.success("保存成功！")
                } else {
                    message.warning("请检查网络连接！")
                }
                this.toMeetingRoomParam();
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
    }
    //resetMeetingRoomParam 恢复出厂设置
    resetMeetingRoomParam = () => {
        const url = global.localhostUrl + "meetingRoomParam/resetMeetingRoomParam?id=" + this.state.id;
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
                    message.success("保存成功！")
                } else {
                    message.warning("请检查网络连接！")
                }
                this.toMeetingRoomParam();
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
    }

    render() {
        return (
            <div >
                <Row>
                    <Col span={18} offset={3}>
                        <Card
                            title={<h2 style={{ float: 'left', marginBottom: -3 }}>参数管理</h2>}
                            extra={
                                <div style={{ width: 200 }} >
                                    <Row>
                                        <Col span={12}>
                                            <Button href="#" type={"primary"} onClick={this.updateMeetingRoomParam} >保存修改</Button>
                                        </Col>
                                        <Col span={12}>
                                            <Button href="#" onClick={this.resetMeetingRoomParam} >恢复出厂设置</Button>
                                        </Col>
                                    </Row>
                                </div>
                            }>
                            每日会议最早开始时间：
                            <Input value={this.state.begin} onChange={this.beginChange} />
                            每日会议最晚结束时间：
                            <Input value={this.state.over} onChange={this.overChange} />
                            预定周期：
                            <Input value={this.state.dateLimit} onChange={this.dateLimitChange} />
                            最长会议时间：
                            <Input value={this.state.timeLimit} onChange={this.timeLimitChange} />
                            时间间隔：
                            <Input value={this.state.timeInterval} onChange={this.timeIntervalChange} />
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default MeetParaManage;
