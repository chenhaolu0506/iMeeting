import React, { Component } from 'react';
import { Button, Popover } from "antd";
import global from '@/global';


class FreeTimePopover extends Component {
    componentDidMount() {
        this.findFreeTime();
    }
    state = {
        freeTimeData: [],
    }
    findFreeTime = () => {
        const url = global.localhostUrl + "meeting/findFreeTime?meetRoomId=" + this.props.meetRoomId + "&meetDate=" + this.props.searchDate;
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",//跨域携带cookie
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(res => res.json())
            .then(json => {
                const data = json;
                this.setState({
                    freeTimeData: data.data
                })
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
    }
    render() {
        return (
            <div >
                <Popover
                    content={
                        <div>
                            空闲时间段：
                            <br />
                            {this.state.freeTimeData.map((item, i) => {
                                return <div key={i}>{item}<br /></div>
                            })}
                        </div>
                    }
                    title={this.props.meetRoomName}
                >
                    <Button onClick={this.findFreeTime}>查看</Button>
                </Popover>
            </div>
        );
    }
}

export default FreeTimePopover;