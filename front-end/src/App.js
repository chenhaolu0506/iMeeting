import logo from './img/logo/logo1024.png';
import './App.css';
import 'antd/dist/reset.css';
import React, { useState, Component } from 'react';
import { Button, Card, Input, message, Select, Popover, Modal, Drawer } from 'antd';
import { EllipsisOutlined, SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Head from './pages/Head';
import LeftSider from './pages/LeftSider';
import BasicPage from './pages/basicPage';
import Login from './pages/Login';
import Demo from './pages/Demo';
import Welcome from './pages/Welcome';


// import Head from './pages/Head';

function App() {
  return (
    <div className="App">
        <Welcome/>
    </div>
  );
}

export default App;

// class Head extends Component {

//   constructor(props, context) {
//       super(props, context);

//       this.state = {
//           username: "",
//           password: "",
//           visible: false,
//           name:"登录",
//           loading: false,
//       }
//   }
//   //模块选择
//   handleChange = (msg) =>{
//       this.props.changeMode(msg);
//       console.log(`selected ${msg}`);
//       document.getElementById("toIndex").click();//返回首页的Link
//   }
//   //登录身份
//   loginRole = (msg) => {
//       this.props.changeMode(msg);
//   }
//   //弹出登录框
//   showDrawer = () => {
//       this.setState({
//           visible: true,
//       });
//   }
//   //关闭登录框
//   onClose = () => {
//       this.setState({
//           visible: false,
//       });
//   };

//   //修改用户名显示
//   nameChange=(e)=>{
//       this.setState({ name : e })
//   }

//   showModal = () => {
//       this.setState({
//           visible: true,
//       });
//   }

//   handleOk = (e) => {
//       console.log(e);
//       this.props.loginOut();
//       this.setState({
//           visible: false,
//       });
//       this.logout();
//   }

//   handleCancel = (e) => {
//       console.log(e);
//       this.setState({
//           visible: false,
//       });
//   }

//   //发送退出登录请求
//   logout = () =>{
//       //POST方式,IP为本机IP
//       // const url="http://39.106.56.132:8080/IMeeting/logout"
//       const url=global.localhostUrl+"IMeeting/logout"
//       fetch(url, {
//           method: "POST",
//           //type:"post",
//           //url:"http://39.106.56.132:8080/userinfo/tologin",
//           mode: "cors",
//           credentials:"include",
//           headers: {
//               "Content-Type": "application/json;charset=utf-8",
//           },
//           body: JSON.stringify({}),
//       }).then(function (res) {//function (res) {} 和 res => {}效果一致
//           return res.json()
//       }).then(json => {
//           // get result
//           const data = json;
//           console.log(data);
//           if(data.status){
//               message.success("安全退出！");
//           }else {
//               message.error("未知错误");
//           }

//       }).catch(function (e) {
//           console.log(e);
//           alert('系统错误');
//       });

//   }

//   //主函数
//   render() {
//       const loginOut=(<div onClick={this.showDrawer}>{"退出登录"}</div>);
//       return (
//           <div className={'head'} style={this.props.style}>
//               {/*right*/}
//               {/*<div>{this.props.name}</div>*/}
//               <img src={logo} className="App-logo logo" alt="logo" onClick={function () {}} />
//               <span className={'companyName'}><h2><Link to='/index'>智能会议室管理系统</Link></h2></span>
//               {/*left*/}
//               {/*<Input className={'searchText'} suffix={(*/}
//               {/*<Button className="search-btn"  type="primary">*/}
//               {/*<Icon type="search" />*/}
//               {/*</Button>*/}
//               {/*)}*/}
//               {/*/>*/}

//               {/*测试区 登录模式*/}
//               <div style={this.props.GLY_Mode?{ display: "block" }:{ display: "none" }}>
//                   <Select className={'headBtn1'} defaultValue={this.props.mode} style={{ width: 120 }} onChange={this.handleChange}>
//                       {/*<Select.Option value="游客模式">游客模式</Select.Option>*/}
//                       <Select.Option value="管理员模式">管理员模式</Select.Option>
//                       <Select.Option value="用户模式">用户模式</Select.Option>
//                   </Select>
//               </div>

//               {/*测试区 登录模式*/}

//               {/*退出登录*/}
//               <Popover title="" content={loginOut} >
//                   <Button className={'headBtn1'} type="primary" >{this.props.name}</Button>
//               </Popover>
//               {/*。。。按钮*/}
//                 <Button className={'headBtn1'} type='primary' onClick={this.loginRole}><EllipsisOutlined /></Button>
//                 {/*搜索框*/}
//                 <Input className={'searchText'} suffix={<SearchOutlined />} />
//                 {/*抽屉式登录页面*/}
//                 <Drawer title="用户登录" placement="right" onClose={this.onClose} visible={this.state.visible}>
//                     <p>用户</p>
//                     <Input type='' placeholder='用户名' onKeyUp={this.usernameChange}></Input>
//                     <br/>
//                     <br/>
//                     <p>密码</p>
//                     <Input type='password' placeholder='密码' onKeyUp={this.passwordChange}></Input>
//                     <Button className={'headBtn1'} type='default' onClick={this.onClose}>忘记密码</Button>
//                     <Button className={'headBtn2'} type='primary' loading={this.state.loading} onClick={this.enterLoading} >登录</Button>
//                     <Button className={'headBtn3'} type='default' onClick={this.sendAjax}>还没有账号？点击注册</Button>
//                 </Drawer>
//                 {/*退出登录*/}
//               <Modal
//                   visible={this.state.visible}
//                   onOk={this.handleOk}
//                   onCancel={this.handleCancel}
//                   okText={"确定"}
//                   cancelText={"取消"}
//               >
//                   <h2>您确定要退出吗？</h2>
//               </Modal>

//           </div>
//       );
//   }
// }