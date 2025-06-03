import React, { Component } from "react";
import { Button, message } from "antd";
import Password from "antd/es/input/Password";

class AddBooking extends Component {
    sendAjax() {
        fetch("http://localhost:8080/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({ username: 'temp_username', password: 'temp_password' }),
        }).then(res => res.json())
            .then(json => {
                const data = json;
                console.log(data);
                message.info(data.message);
                message.info(data.data.username);
                message.info(data.data.name);
                // message.info(data.data.email);
                message.info(data.data.phone);
            }).catch(function (e) {
                console.log(e);
                alert('系统错误');
            });
    }

    render() {
        return (
            <div>
                <Button onClick={this.sendAjax}>登录</Button>
            </div>
        )
    }
}

export default AddBooking;