import React, { Component } from 'react';
import { Card, Col, Row, Select, Spin } from "antd";
import global from '@/global';
import MeetInfo from "@/pages/meeting/tool/MeetInfo"

class ShowMeeting extends Component {
    state = {
        roomList: "",
        searchDate: "",
        roomId: 0,
        meetInfo: [],
        loading: false,
    };
    oneRoomReserve = () => {
        const url = global.localhostUrl + "meeting/oneRoomReserve?reserveDate=" + this.props.searchDate + "&roomId=" + this.state.roomId;
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
                    meetingInfo: data.data,
                    loading: false
                }, function () {
                })
            }).catch(function (e) {
                console.log(e);
                alert('系统错误');
            });
    }
    handleChange = (value) => {
        this.setState({
            roomId: value,
            loading: true,
        }, this.oneRoomReserve)
    }

    handleBlur = () => {
        console.log('blur');
    }

    handleFocus = () => {
        console.log('focus');
    }

    render() {
        return (
            <div>
                <Row>
                    <Col span={18} offset={3}>
                        <Card
                            title={
                                <div>
                                    <Row>
                                        <Col span={8}>
                                            <h3 style={{ float: 'left', marginBottom: -10 }}>
                                                会议情况
                                                <Spin size={"large"} spinning={this.state.loading} />
                                            </h3>
                                        </Col>
                                        <Col span={8}>
                                            <h4 style={{ marginTop: 4 }}>查询日期：{this.props.searchDate}</h4>
                                        </Col>
                                        <Col span={8}>
                                            会议室：
                                            <Select
                                                showSearch
                                                style={{ width: 160 }}
                                                optionFilterProp="children"
                                                onChange={this.handleChange}
                                                onFocus={this.handleFocus}
                                                onBlur={this.handleBlur}
                                            >
                                                {
                                                    this.props.roomList.map((item) => {
                                                        return (
                                                            <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </Col>
                                    </Row>
                                </div>
                            }
                        >
                            <MeetInfo dataSource={this.state.meetInfo}></MeetInfo>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ShowMeeting;