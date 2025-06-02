import React, { Component } from 'react';
import { Card, Col, Row, Badge,Calendar} from "antd";
import global from '@/global';
import '@/css/meeting.less';
import MyJoinMeetInfo from "@/pages/myMeeting/tool/MyJoinMeetInfo";
import moment from 'moment';
class MyJoinMeeting extends Component {
    componentDidMount(){
        this.showMyReserve();
    }
    state={
        bookRule:{
            id: 1,
            begin: "07:00",
            over: "18:30",
            dateLimit: "7",
            timeLimit: "120",
            timeInterval: "15",
            tenantId: 1
        },
        bookTool:[],
        roomList:[
            {
                "id": 1,
                "name": "A01会议室",
                "num": "A01",
                "place": "笃行楼一楼A01室",
                "contain": 40,
                "availStatus": 1,
                "nowStatus": 0,
                "tenantId": 1
            },
        ],
        roomTools:[],
        bookVisible: false,
        deleteVisible:false,
        stopVisible:false,
        othersList:[],
        searchDate:"2019-01-17",
        meetingId:"",
        changeAble:false,
        coordinate:false,
        meetInfo:[],
        meetDateInfo:[],

    };
    onClose = () => {
        this.setState({
            bookVisible: false,
        });
    };
    showDrawer = () => {
        this.setState({
            bookVisible: true,
        });
    };

    //
    dateCellRender=(value) =>{
        console.log(value)
        console.log(value.format("YYYY-MM-DD"));
        let time=value.format("YYYY-MM-DD");
        let listData = [];
        this.state.meetDateInfo.map((item)=>{
            console.log(item)
            if(time===item.meetDate){
                listData.push({
                    meetDate:item.meetDate,
                    type:"warning",
                    notStartCount:"有"+item.notStartCount+"个未开始会议",
                    overCount:"有"+item.overCount+"个已结束会议",
                });
            }
            return null;
        });
        return (
            <ul className="events">
                {
                    listData.map(item => (
                        <li key={item.meetDate}>
                            {
                                item.notStartCount==="有0个未开始会议"?"":<Badge status="success" text={item.notStartCount} />
                            }
                            {
                                item.overCount==="有0个已结束会议"?"":<Badge status="default" text={item.overCount} />
                            }

                        </li>
                    ))
                }
            </ul>
        );
    }
    /////////////////////////////////////////////////////////////////////

    //showMyReserve
    showMyReserve = () =>{
        const url=global.localhostUrl+"meeting/toSelectMyJoinMeeting";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",//跨域携带cookie
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
                meetDateInfo:data.data,
            })
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
    }
    //showMyReserve选择某月进行显示
    showMyReserveOneMonth = (yearMonth) =>{
        const url=global.localhostUrl+"meeting/specifiedMyJoinMeeting?yearMonth="+yearMonth;
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",//跨域携带cookie
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
                meetDateInfo:data.data,
            })
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
    }//showMyReserve选择某日进行显示
    showMyReserveOneDate = (reserveDate) =>{
        const url=global.localhostUrl+"meeting/selectMyJoinMeetingByDate?meetDate="+reserveDate;
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",//跨域携带cookie
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
                meetInfo:data.data,
            })
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
    }
    //onChange
    onChange=(e)=>{
        console.log("onChange:",e);
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
                            <Calendar dateCellRender={this.dateCellRender}  onChange={this.onChange}/>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col span={18} offset={3}>
                        <Card
                            title={
                                <div>
                                    <h3 style={{float:'left',marginBottom:-10}}>会议情况</h3>
                                </div>
                            }
                        >
                            <MyJoinMeetInfo dataSource={this.state.meetInfo}></MyJoinMeetInfo>
                        </Card>
                    </Col>
                </Row>


            </div>
        );
    }
}
export default MyJoinMeeting;
