import React, { Component } from "react"; 
import { Button, Popover } from "antd";
import global from "../../../global";

class FreeTimePopover extends Component {
    componentDidMount() {
        this.findFreeTime();
    }

    state = {
        freeTime: [],
    }

    findFreeTime = () => {
        const url = global.localhostUrl + "meeting/findFreeTime?meetRoomId=" + this.props.meetRoomId + "&meetDate=" + this.props.searchDate;
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(res => res.json())
        .then(json => {
            const data = json;
            console.log(data);
            this.setState({
                freeTime: data.data
            })
        }).catch(function (e) {
            console.log(e);
            alert('系统错误');
        });
    }
    render() {
        return (
            <div>
                <Popover
                    content={
                        <div>
                            空闲时间段：<br/>
                            {this.state.freeTime.map((item, i) => {
                                return <div key={i}>{item}<br/></div>
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