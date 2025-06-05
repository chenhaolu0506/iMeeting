import React, { Component } from 'react';
import { Card, Col, Row, Badge, Calendar } from "antd";
import global from '@/global';
import '@/css/meeting.less';
import MyMeetInfo from "@/pages/meeting/tool/MyMeetInfo"
class SearchMeeting extends Component {
    componentDidMount() {
        this.showMyReserve();
    }
    state = {
        meetingInfo: [],
        meetingDateInfo: [],
    };

    dateCellRender = (value) => {
        let time = value.format("YYYY-MM-DD");
        let listData = this.state.meetingDateInfo.filter(item => item.meetDate === time).map(item => ({
            meetDate: item.meetDate,
            type: "warning",
            count: "有" + item.count + "条预定记录",
        }));
        return (
            <ul className="events">
                {
                    listData.map(item => (
                        <li key={item.meetDate}>
                            <Badge status={item.type} text={item.count} />
                        </li>
                    ))
                }
            </ul>
        );
    }
    /////////////////////////////////////////////////////////////////////
    //showMyReserve
    showMyReserve = () => {
        const url = global.localhostUrl + "meeting/showMyReserve";
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
                    meetingDateInfo: data.data[0],
                    meetingInfo: data.data[1],
                })
            }).catch(function (e) {
                console.log(e);
                alert('系统错误');
            });
    }
    //showMyReserve选择某月进行显示
    showMyReserveOneMonth = (yearMonth) => {
        const url = global.localhostUrl + "meeting/specifiedMyReserve?yearMonth=" + yearMonth;
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
                    meetingDateInfo: data.data,
                })
            }).catch(function (e) {
                console.log(e);
                alert('系统错误');
            });
    }
    //showMyReserve选择某天进行显示
    showMyReserveOneDate = (reserveDate) => {
        const url = global.localhostUrl + "meeting/showOneDayReserve?reserveDate=" + reserveDate;
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
                })
            }).catch(function (e) {
                console.log(e);
                alert('系统错误');
            });
    }
    onChange = (e) => {
        this.showMyReserveOneMonth(e.format("YYYY-MM"));
        this.showMyReserveOneDate(e.format("YYYY-MM-DD"));
    }
    render() {
        return (
            <div >
                <Row>
                    <Col span={18} offset={3}>
                        <Card>
                            <Calendar dateCellRender={this.dateCellRender} onChange={this.onChange} />
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col span={18} offset={3}>
                        <Card
                            title={
                                <div>
                                    <h3 style={{ float: 'left', marginBottom: -10 }}>会议情况</h3>
                                </div>
                            }
                        >
                            <MyMeetInfo dataSource={this.state.meetingInfo}></MyMeetInfo>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}
export default SearchMeeting;