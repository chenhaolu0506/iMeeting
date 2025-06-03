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
        meetInfo: [],
        meetDateInfo: [],
    };
    //
    dateCellRender = (value) => {
        console.log(value)
        console.log(value.format("YYYY-MM-DD"));
        let time = value.format("YYYY-MM-DD");
        let listData = [];
        this.state.meetDateInfo.map((item) => {
            console.log(item)
            if (time === item.meetDate) {
                listData.push({
                    meetDate: item.meetDate,
                    type: "warning",
                    count: "有" + item.count + "条预定记录",
                });
            }
            return null;
        });
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
            credentials: "include",//跨域携带cookie
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(function (res) {//function (res) {} 和 res => {}效果一致
            return res.json()
        }).then(json => {
            // get result
            const data = json;
            console.log(data);
            this.setState({
                meetDateInfo: data.data[0],
                meetInfo: data.data[1],
            })
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
    }
    //showMyReserve选择某月进行显示
    showMyReserveOneMonth = (yearMonth) => {
        const url = global.localhostUrl + "meeting/specifiedMyReserve?yearMonth=" + yearMonth;
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",//跨域携带cookie
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(function (res) {//function (res) {} 和 res => {}效果一致
            return res.json()
        }).then(json => {
            // get result
            const data = json;
            console.log(data);
            this.setState({
                meetDateInfo: data.data,
            })
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
    }//showMyReserve选择某月进行显示
    showMyReserveOneDate = (reserveDate) => {
        const url = global.localhostUrl + "meeting/showOneDayReserve?reserveDate=" + reserveDate;
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",//跨域携带cookie
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(function (res) {//function (res) {} 和 res => {}效果一致
            return res.json()
        }).then(json => {
            // get result
            const data = json;
            console.log(data);
            this.setState({
                meetInfo: data.data,
            })
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
    }
    //onChange
    onChange = (e) => {
        console.log("onChange:", e);
        console.log(e.format("YYYY-MM"));
        console.log(e.format("YYYY-MM-DD"));
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
                            <MyMeetInfo dataSource={this.state.meetInfo}></MyMeetInfo>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}
export default SearchMeeting;
