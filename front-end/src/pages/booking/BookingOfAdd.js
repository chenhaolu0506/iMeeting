import React, { Component } from 'react';
import {Button, message} from 'antd';
class BookingOfAdd extends Component {


    //发送Ajax请求
    sendAjax(){
        //POST方式,IP为本机IP

        fetch("http://39.106.56.132:8080/userinfo/tologin", {

            method: "POST",
            //type:"post",
            //url:"http://39.106.56.132:8080/userinfo/tologin",
            mode: "cors",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({username:'17905318',password:'1'}),
        }).then(function (res) {//function (res) {} 和 res => {}效果一致
            return res.json()
        }).then(json => {
            // get result
            const data = json;
            console.log(data);
            message.info(data.message);
            message.info(data.data.username);
            message.info(data.data.name);
            message.info(data.data.email);
            message.info(data.data.phone);
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
    }

    render() {
        return (
            <div >
                BookingOfAdd
                <Button onClick={this.sendAjax}>登录</Button>
            </div>
        );
    }
}

export default BookingOfAdd;
