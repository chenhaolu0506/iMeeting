import React, { Component } from 'react';
import {Button, Card, Input, message,Steps} from 'antd';
class Login extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            display_Head:'none',
            display_Forget:'none',
            display_Change:'none',
            display_ChangeSuccess:'none',
            display_Menu:'none',
            display_Login:'block',
            display_GLY:'none',
            display_User:'none',
            display_Visitor:'block',
            display_name: 'block', //此状态机为display的取值
            menu_mode:'inline',//vertical
            width: '200px',
            collapsed:true,
            username: "",
            password: "",
            new_password:"",
            phone:"",
            phone_code:"",
            pwd_code:"!!!",
            visible: false,
            name:"请先登录",
            loading: false,
        }
    }
    //username被修改
    usernameChange=(e)=>{
        this.setState({ username : e.target.value })
    }
    //password被修改
    passwordChange=(e)=>{
        this.setState({ password : e.target.value })
    }
    //手机号被修改
    phoneChange=(e)=>{
        this.setState({ phone : e.target.value })
    }
    //验证码被修改
    phoneCodeChange=(e)=>{
        this.setState({ phone_code : e.target.value })
    }
    //newPassword被修改
    newPasswordChange=(e)=>{
        this.setState({ new_password : e.target.value })
    }
    //显示找回密码
    showForget=()=>{
        this.setState({
            display_ChangeSuccess:'none',
            display_Change:'none',
            display_Head:'none',
            display_Forget:'block',
            display_Login:'none',
        });
    }
    //返回登录页面
    showLogin=()=>{
        this.setState({
            display_ChangeSuccess:'none',
            display_Change:'none',
            display_Head:'none',
            display_Forget:'none',
            display_Login:'block',
        });
        document.getElementById("toLogin").click();
    }
    //更改密码页面
    showChangePwd=()=>{
        this.setState({
            display_ChangeSuccess:'none',
            display_Change:'block',
            display_Head:'none',
            display_Forget:'none',
            display_Login:'none',
        });
    }
    //修改成功页面
    showChangeSuccess=()=>{
        this.setState({
            display_ChangeSuccess:'block',
            display_Change:'none',
            display_Head:'none',
            display_Forget:'none',
            display_Login:'none',
        });
    }
    //登录与加载
    enterLoading = () => {
        this.setState({ loading: true });
        this.sendAjax();
        this.overLoading();
    }
    //点击登录后旋转2秒
    overLoading = () => {
        setInterval(() => {this.setState({ loading: false })}, 2000);
    }


    //验证验证码
    compareCode=()=>{
        if(this.state.phone_code===this.state.pwd_code){
            message.success("验证成功！");
            this.showChangePwd();
        }else {
            message.error("验证失败！");
        }
    }
    //验证验两次密码输入
    comparePassword=()=>{
        if(this.state.password===this.state.new_password){
            this.changePwd();
        }else {
            message.error("两次密码输入不一致！");
        }
    }
    render() {
        return (
            <div >

                {/*找回密码*/}
                <Card title="找回密码" className={"forgetCard"} style={{ width: 600,display:this.state.display_Forget }}>
                    <Steps style={{ width: '440px'}} current={0}>
                        <Steps.Step style={{ margin:0}} title="第一步" description="获取验证码" />
                        <Steps.Step style={{ margin:0}} title="第二步" description="修改密码" />
                        <Steps.Step style={{ marginLeft:30}} title="第三步" description="修改成功" />
                    </Steps>
                    <br/>
                    <Input type='' placeholder='手机号' onKeyUp={this.phoneChange}></Input>
                    <br/>
                    <Input type='' className='phoneCodeInput' placeholder='输入验证码' onKeyUp={this.phoneCodeChange}></Input>
                    <Button className='forgetBtn2' type='default' onClick={this.getPhoneCode}>获取验证码</Button>
                    <Button className='forgetBtn1' type='default' onClick={this.showLogin}>返回登录</Button>
                    <Button className='forgetBtn1' type='primary' onClick={this.compareCode}>下一步</Button>
                </Card>
                {/*修改密码*/}
                <Card title="找回密码" className={"forgetCard"} style={{ width: 600,display:this.state.display_Change }}>
                    <Steps style={{ width: '440px'}} current={1}>
                        <Steps.Step style={{ margin:0}} title="第一步" description="获取验证码" />
                        <Steps.Step style={{ margin:0}} title="第二步" description="修改密码" />
                        <Steps.Step style={{ marginLeft:30}} title="第三步" description="修改成功" />
                    </Steps>
                    <br/>
                    <Input type='' placeholder='输入新密码' onKeyUp={this.passwordChange}></Input>
                    <br/><br/>
                    <Input type='' placeholder='再次输入密码' onKeyUp={this.newPasswordChange}></Input>
                    <Button className='forgetBtn1' type='default' onClick={this.showLogin}>返回登录</Button>
                    <Button className='forgetBtn1' type='primary' onClick={this.comparePassword}>修改密码</Button>
                </Card>
                {/*修改成功*/}
                <Card title="找回密码" className={"forgetCard"} style={{ width: 600,display:this.state.display_ChangeSuccess }}>
                    <Steps style={{ width: '440px'}} current={2}>
                        <Steps.Step style={{ margin:0}} title="第一步" description="获取验证码" />
                        <Steps.Step style={{ margin:0}} title="第二步" description="修改密码" />
                        <Steps.Step style={{ marginLeft:30}} title="第三步" description="修改成功,返回登录" />
                    </Steps>
                    <Button className='forgetBtn1' type='primary' onClick={this.showLogin}>返回登录</Button>
                </Card>
            </div>
        );
    }
}

export default Login;
