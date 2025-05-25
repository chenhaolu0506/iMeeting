import { Button, Input, Layout, Menu, message, Select, Card, Popover, Modal, Steps, Col, Row } from 'antd';
import { BrowserRouter as HashRouter, Route, Link } from 'react-router-dom';
import global from './global';
import './css/Layout.css';
import './css/LoginCard.css';
import './App.css';
import React, { Component } from 'react';
import logo from './img/logo/logo1024.png';


import Welcome from './pages/Welcome';
import B_O_Add from './pages/booking/AddBooking';
import B_O_Meeting from './pages/booking/BookingOfMeeting';
import B_O_Time from './pages/booking/BookingCalendar';
import BookMeeting from './pages/meeting/BookMeeting';
import SearchMeeting from './pages/meeting/SearchMeeting';
import MeetingManage from './pages/manage/MeetingManage';
import FindMeeting from './pages/user/FindMeeting';
import UserInfo from './pages/user/UserInfo';
import Group from './pages/user/Group';
import MyJoinMeeting from './pages/meeting/myJoinMeeting';
import RoleManage from './pages/manage/RoleManage';
import MyLeave from './pages/myMeeting/MyLeave';
import DepartmentManage from './pages/manage/DepartmentManage';
import EquipmentManage from './pages/manage/EquipmentManage';
import MeetingRoomManage from './pages/manage/MeetingRoomManage';
import MeetingParamManage from './pages/manage/MeetingParamManage';
import PersonManage from './pages/manage/PersonManage';
import FaceManage from './pages/manage/FaceManage';
import JoinPersonManage from './pages/manage/JoinPersonManage';
import MeetingInfoManage from './pages/manage/MeetingInfoManage';

import BizDemo from './pages/graph/BizDemo';

import ManageIndex from './pages/manage/ManageIndex';
import EquipmentRepairManage from './pages/manage/EquipmentRepairManage';
import OthersFaceManage from './pages/myMeeting/OthersFaceManage';
import DoorManage from './pages/manage/DoorManage';
import FileManage from './pages/manage/FileManage';
import WeeklyMeetingManage from './pages/manage/WeeklyMeetingManage';
import DetailManage from './pages/manage/DetailManage';
import WeeklyMeeting from './pages/meeting/WeeklyMeeting';
import DoorApply from './pages/others/DoorApply';
import EquipRepair from './pages/others/EquipRepair';
import BookMeetingManage from './pages/manage/BookMeetingManage';
import MyVideoMeeting from './pages/myMeeting/MyVideoMeeting';
import { AppstoreOutlined, BankOutlined, BarChartOutlined, ClusterOutlined, HomeOutlined, LockOutlined, SmileOutlined, TagsOutlined, TeamOutlined, ToolOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';

class App extends Component {
  componentDidMount() {
    this.isLoggedIn();
    this.toManager();
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      mode: "用户模式",
      admin_mode: false,
      display_Head: 'none',
      display_Forget: 'none',
      display_Change: 'none',
      display_ChangeSuccess: 'none',
      display_Menu: 'none',
      display_Login: 'none',
      display_admin: 'none',
      display_User: 'none',
      display_Visitor: 'block',
      display_name: 'block', //此状态机为display的取值
      disabled_getCode: false,
      menu_mode: 'inline',//vertical
      width: '200px',
      collapsed: false,//左侧菜单收缩
      username: "",
      password: "",
      new_password: "",
      phone: "",
      phone_code: "",
      pwd_code: "!!!",
      codeTime: 0,
      visible: false,
      name: "请先登录",
      loading: false,
      roleList: [],
      loginFlag: 0,
    }
  }

  /////////////////////////////////////////////////Input输入的及时改变/////////////////////////////////////////////////

  //username被修改
  usernameChange = (e) => {
    this.setState({ username: e.target.value })
  }
  //password被修改
  passwordChange = (e) => {
    this.setState({ password: e.target.value })
  }
  //手机号被修改
  phoneChange = (e) => {
    this.setState({ phone: e.target.value })
  }
  //验证码被修改
  phoneCodeChange = (e) => {
    this.setState({ phone_code: e.target.value })
  }
  //newPassword被修改
  newPasswordChange = (e) => {
    this.setState({ new_password: e.target.value })
  }
  /////////////////////////////////////////////////找回密码/////////////////////////////////////////////////
  //验证验证码
  compareCode = () => {
    if (this.state.phone_code === this.state.pwd_code) {
      message.success("验证成功！");
      this.showChangePwd();
    } else {
      message.error("验证失败！");
    }
  }
  //验证验两次密码输入
  comparePassword = () => {
    if (this.state.password === this.state.new_password) {
      this.changePwd();
    } else {
      message.error("两次密码输入不一致！");
    }
  }
  //获取验证码60s
  codeTime = () => {
    const timer = setInterval(() => {
      if (this.state.codeTime > 0) {
        this.setState({
          codeTime: this.state.codeTime - 1
        });
      } else {
        this.setState({
          disabled_getCode: false,
        });
        clearInterval(timer);
      }
    }, 1000);
  }
  /////////////////////////////////////////////////找回密码/////////////////////////////////////////////////
  //显示找回密码
  showForget = () => {
    this.setState({
      display_ChangeSuccess: 'none',
      display_Change: 'none',
      display_Head: 'none',
      display_Forget: 'block',
      display_Login: 'none',
    });
  }
  //更改密码页面
  showChangePwd = () => {
    this.setState({
      display_ChangeSuccess: 'none',
      display_Change: 'block',
      display_Head: 'none',
      display_Forget: 'none',
      display_Login: 'none',
    });
  }
  //修改成功页面
  showChangeSuccess = () => {
    this.setState({
      display_ChangeSuccess: 'block',
      display_Change: 'none',
      display_Head: 'none',
      display_Forget: 'none',
      display_Login: 'none',
    });
  }
  //返回登录页面
  showLogin = () => {
    this.setState({
      display_ChangeSuccess: 'none',
      display_Change: 'none',
      display_Head: 'none',
      display_Forget: 'none',
      display_Login: 'block',
    });
  }
  /////////////////////////////////////////////////登录/////////////////////////////////////////////////
  //注册
  signUp = () => {
    message.warn("对不起，注册系统还未开放，请联系管理员申请账号，谢谢");
  }
  //登录与加载
  enterLoading = () => {
    this.setState({ loading: true });
    this.sendAjax();
    this.overLoading();
  }
  //点击登录后旋转2秒
  overLoading = () => {
    setInterval(() => { this.setState({ loading: false }) }, 2000);
  }
  /////////////////////////////////////////////////头部栏/////////////////////////////////////////////////
  //修改用户名显示
  changeUsernameDisplay = (e) => {
    this.setState({ name: e })
  }
  //退出登录
  logout = () => {
    this.setState({
      admin_mode: false,
      display_Head: 'none',
      display_Forget: 'none',
      display_Menu: 'none',
      display_Login: 'block',
      name: "请先登录",
    });
  }
  /////////////////////////////////////////////////4个fetch请求/////////////////////////////////////////////////
  //发送验证码请求
  getPhoneCode = () => {
    const phone = this.state.phone;
    const url = global.localhostUrl + "pwdCode?phone=" + phone;
    if (phone === "") {
      message.warning("手机号不能为空！");
    } else {
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
          if (data.status === true) {
            message.success("请求发送成功！");
            this.setState({
              pwd_code: data.data,
              disabled_getCode: true,
              codeTime: 60,
            }, this.codeTime);
          } else if (!data.status) {
            message.error("手机号码不正确！");
          }
        }).catch(function (e) {
          console.log("fetch fail");
          alert('系统错误');
        });
    }
  }
  //修改密码
  changePwd = () => {
    const phone = this.state.phone;
    const password = this.state.password;
    const url = global.localhostUrl + "forgetPwd?phone=" + phone + "&password=" + password;
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
        if (data.status === true) {
          message.success("密码修改成功！");
          this.showChangeSuccess();
        } else {
          message.error("非法的密码修改！");
        }
      }).catch(function (e) {
        console.log("fetch fail");
        alert('系统错误');
      });
  }
  //获取管理员权限列表
  toManager = () => {
    const url = global.localhostUrl + "manager/toManager";
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
        if (data.data !== undefined) {
          this.setState({
            roleList: data.data,
          })
        }
      }).catch(function (e) {
        console.log("fetch fail");
        alert('系统错误');
      });
  }
  //发送登录请求
  sendAjax = () => {
    //POST方式,IP为本机IP
    const username = this.state.username;
    const password = this.state.password;
    const url = global.localhostUrl + "login?username=" + username + "&password=" + password;
    if (username === "" || password === "") {
      message.warning("用户名或密码不能为空！");
    } else {
      fetch(url, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ username: username, password: password }),
      }).then(res => res.json())
        .then(json => {
          const data = json;
          if (data.status === true) {
            this.changeUsernameDisplay(data.data.name);
            message.success("登录成功！");
            this.toManager();
            this.setState({
              mode: "用户模式",
              display_Head: 'block',
              display_Menu: 'block',
              display_Login: 'none',
              loginFlag: this.state.loginFlag + 1
            });
            if (data.message === "no") {
              this.changeMode("用户模式")
            } else {
              // TODO: what is this doing
              this.changeMode("管理员模式");
              // this.changeMode("用户模式");
            }
            document.getElementById("toIndex").click(); //返回首页的Link
          } else if (data.status === false) {
            message.error("用户名或密码错误！");
          } else {
            message.error("未知错误");
          }
        }).catch(function (e) {
          console.log("fetch fail");
          alert('系统错误');
        });
    }
  }
  //判断是否已经登录
  isLoggedIn = () => {
    console.log("判断是否已经登录")
    //POST方式,IP为本机IP
    const url = global.localhostUrl + "showUserinfo"
    fetch(url, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "http://39.106.56.132:8082",
      },
      body: JSON.stringify({}),
    }).then(res => res.json())
      .then(json => {
        const data = json;
        if (data.status) {
          // TODO: what is this doing?
          if (data.data.roleId !== null) {
            this.changeMode("管理员模式");
            this.changeMode("用户模式");
          }
          this.setState({
            mode: "用户模式",
            display_Head: 'block',
            display_Menu: 'block',
            display_Login: 'none',
            name: data.data.name,
          }, function () { });
        } else {
          this.setState({
            display_Login: 'block',
          }, function () { });
        }
      }).catch(e => {
        console.log("fetch fail");
        // hashHistory.push('跳转路径');
        // createHashHistory().replace(global.webUrl)//失败例子1
        document.getElementById("toIndex").click();//返回首页的Link
        if (this.state.display_Head === 'block') {
          alert("登录超时，请重新登录");
          // window.location.href = global.webUrl;//失败例子2
        }
        this.setState({
          mode: "用户模式",
          display_Head: 'none',
          display_Menu: 'none',
          display_Login: 'block',
        }, function () { });
      });
  }

  /////////////////////////////////////////////////侧边栏/////////////////////////////////////////////////
  //改变模式
  changeMode = (msg) => {
    if (msg === "管理员模式") {
      this.setState({
        mode: "管理员模式",
        admin_mode: true,
        display_admin: 'block',
        display_User: 'none',
        display_Visitor: 'none',
      });
    } else if (msg === "游客模式") {
      this.setState({
        mode: "游客模式",
        display_admin: 'none',
        display_User: 'none',
        display_Visitor: 'block',
      });
    } else if (msg === "用户模式") {
      this.setState({
        mode: "用户模式",
        display_admin: 'none',
        display_User: 'block',
        display_Visitor: 'none',
      });
    } else {
      console.log("错误！未监测到身份");
      this.setState({
        display_admin: 'none',
        display_User: 'none',
        display_Visitor: 'block',
      });
    }
  }
  //菜单显示与隐藏
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  // 主函数
  render() {
    return (
      <div className='App'>
        <HashRouter>
          <Layout>
            <Layout.Header className={'Head'} style={{ display: this.state.display_Head }}>
              <Head changeMode={msg => this.changeMode(msg)} logout={() => this.logout()} name={this.state.name} admin_mode={this.state.admin_mode} mode={this.state.mode} />
            </Layout.Header>
            <Layout>
              {/* 左侧菜单栏 */}
              <Layout.Sider trigger={null} collapsible collapsed={this.state.collapsed} style={{ color: '#fff', backgroundColor: '#fff', display: this.state.display_Menu }}>
                <Menu className='leftSider' mode={this.state.menu_mode} theme='light' style={{ color: '#000' }}>
                  <Menu.Item onClick={this.toggle}>
                    <HomeOutlined />
                    <span>菜单</span>
                  </Menu.Item>

                  {/* 管理员功能 */}
                  <Menu.SubMenu title={<span><ClusterOutlined /><span>用户管理</span></span>} style={{ display: this.state.display_admin }}>
                    {
                      this.state.roleList.filter(item => item.menuName === "部门管理").map(item => {
                        return (
                          <Menu.Item key={item.id} >
                            <Link to='/manage/department'>{item.menuName}</Link>
                          </Menu.Item>
                        )
                      })
                    }
                    {
                      this.state.roleList.filter(item => item.menuName === "角色管理").map(item => {
                        return (
                          <Menu.Item key={item.id} >
                            <Link to='/manage/role'>{item.menuName}</Link>
                          </Menu.Item>
                        )
                      })
                    }
                    {
                      this.state.roleList.filter(item => item.menuName === "员工管理").map(item => {
                        return (
                          <Menu.Item key={item.id} >
                            <Link to='/manage/person'>{item.menuName}</Link>
                          </Menu.Item>
                        )
                      })
                    }
                  </Menu.SubMenu>
                  <Menu.SubMenu title={<span><BankOutlined /><span>会议室管理</span></span>} style={{ display: this.state.display_admin }}>
                    {
                      this.state.roleList.filter(item => item.menuName === "设备管理").map(item => {
                        return (
                          <Menu.Item key={item.id} >
                            <Link to='/manage/equipment'>{item.menuName}</Link>
                          </Menu.Item>
                        )
                      })
                    }
                    {
                      this.state.roleList.filter(item => item.menuName === "会议室管理").map(item => {
                        return (
                          <Menu.Item key={item.id} >
                            <Link to='/manage/meetingRoom'>{item.menuName}</Link>
                          </Menu.Item>
                        )
                      })
                    }
                    {
                      this.state.roleList.filter(item => item.menuName === "参数管理").map(item => {
                        return (
                          <Menu.Item key={item.id} >
                            <Link to='/manage/meetingRoomParam'>{item.menuName}</Link>
                          </Menu.Item>
                        )
                      })
                    }
                    <Menu.Item ><Link to='/manage/equipmentRepair'>设备报修管理</Link></Menu.Item>
                    <Menu.Item ><Link to='/manage/doorAccess'>门禁权限管理</Link></Menu.Item>
                    <Menu.Item ><Link to='/manage/file'>文件管理</Link></Menu.Item>
                  </Menu.SubMenu>
                  <Menu.SubMenu title={<span><SmileOutlined /><span>面部信息管理</span></span>} style={{ display: this.state.display_admin }}>
                    {
                      this.state.roleList.filter(item => item.menuName === "人脸管理").map(item => {
                        return (
                          <Menu.Item key={item.id} >
                            <Link to='/manage/face'>{item.menuName}</Link>
                          </Menu.Item>
                        )
                      })
                    }
                  </Menu.SubMenu>
                  <Menu.SubMenu title={<span><TeamOutlined /><span>会议管理</span></span>} style={{ display: this.state.display_admin }}>
                    {
                      this.state.roleList.filter(item => item.menuName === "会议管理").map(item => {
                        return (
                          <Menu.Item key={item.id} >
                            <Link to='/manage/meetingInfo'>{item.menuName}</Link>
                          </Menu.Item>
                        )
                      })
                    }
                    <Menu.Item ><Link to='/manage/weeklyMeeting'>每周例会管理</Link></Menu.Item>
                    <Menu.Item ><Link to='/manage/booking'>预定会议</Link></Menu.Item>
                  </Menu.SubMenu>
                  <Menu.SubMenu title={<span><BarChartOutlined /><span>数据分析</span></span>} style={{ display: this.state.display_admin }}>
                    {
                      this.state.roleList.filter(item => item.menuName === "参数管理").map(item => {
                        return (
                          <Menu.Item key={item.id} >
                            <Link to='/manage/param'>数据分析</Link>
                          </Menu.Item>
                        )
                      })
                    }
                  </Menu.SubMenu>
                  <Menu.SubMenu title={<span><AppstoreOutlined /><span>其他</span></span>} style={{ display: this.state.display_admin }}>
                    <Menu.Item><Link to='/manage/detail'>日志管理</Link></Menu.Item>
                  </Menu.SubMenu>

                  {/* 开会者预定端功能 */}
                  <Menu.SubMenu title={<span><ToolOutlined /><span>会议管理</span></span>} style={{ display: this.state.display_User }}>
                    <Menu.Item><Link to='/meeting/booking'>预订会议</Link></Menu.Item>
                    <Menu.Item><Link to='/meeting/myMeeting'>我的预订</Link></Menu.Item>
                    <Menu.Item><Link to='/myMeeting/myLeave'>请假审批</Link></Menu.Item>
                    <Menu.Item><Link to='/meeting/weeklyMeeting'>每周例会</Link></Menu.Item>
                  </Menu.SubMenu>

                  <Menu.SubMenu title={<span><TeamOutlined /><span>我的会议</span></span>} style={{ display: this.state.display_User }}>
                    <Menu.Item><Link to='/myMeeting/myJoin'>会议安排</Link></Menu.Item>
                    <Menu.Item><Link to='/myMeeting/myVideoMeeting'>视频会议</Link></Menu.Item>
                  </Menu.SubMenu>

                  <Menu.SubMenu title={<span><VideoCameraOutlined /><span>会议监控</span></span>} style={{ display: this.state.display_User }}>
                    <Menu.Item><Link to='/manage/joinPerson'>签到记录</Link></Menu.Item>
                    <Menu.Item><Link to='/manage/others'>异常人员</Link></Menu.Item>
                  </Menu.SubMenu>

                  <Menu.SubMenu title={<span><UserOutlined /><span>个人中心</span></span>} style={{ display: this.state.display_User }}>
                    <Menu.Item><Link to='/user/userInfo'>我的资料</Link></Menu.Item>
                  </Menu.SubMenu>

                  <Menu.SubMenu title={<span><TagsOutlined /><span>群组管理</span></span>} style={{ display: this.state.display_User }}>
                    <Menu.Item><Link to='/user/myGroups'>我的群组</Link></Menu.Item>
                  </Menu.SubMenu>

                  <Menu.SubMenu title={<span><AppstoreOutlined /><span>其他</span></span>} style={{ display: this.state.display_User }}>
                    <Menu.Item><Link to='/others/equipmentRepair'>设备报修</Link></Menu.Item>
                    <Menu.Item><Link to='/others/doorApply'>开门申请</Link></Menu.Item>
                  </Menu.SubMenu>

                  {/*用户预订功能模块*/}
                  <Menu.SubMenu title={<span><ToolOutlined /><span>会议管理</span></span>} style={{ display: this.state.display_Visitor }}>
                    <Menu.Item><Link to='/meeting/booking'>预订会议</Link></Menu.Item>
                    <Menu.Item><Link to='/meeting/myMeeting'>我的预订</Link></Menu.Item>
                    <Menu.Item><Link to='/myMeeting/myLeave'>请假审批</Link></Menu.Item>
                  </Menu.SubMenu>
                  <Menu.SubMenu title={<span><TeamOutlined /><span>我的会议</span></span>} style={{ display: this.state.display_Visitor }}>
                    <Menu.Item><Link to='/myMeeting/myJoin'>会议安排</Link></Menu.Item>
                  </Menu.SubMenu>
                  <Menu.SubMenu title={<span><VideoCameraOutlined /><span>会议监控</span></span>} style={{ display: this.state.display_Visitor }}>
                    <Menu.Item><Link to='/manage/joinPerson'>签到记录</Link></Menu.Item>
                    <Menu.Item><Link to='/booking/address'>到会人员信息</Link></Menu.Item>
                  </Menu.SubMenu>
                  <Menu.SubMenu title={<span><UserOutlined /><span>我的信息</span></span>} style={{ display: this.state.display_Visitor }}>
                    <Menu.Item><Link to='/user/userInfo'>个人资料</Link></Menu.Item>
                  </Menu.SubMenu>
                  <Menu.SubMenu title={<span><TagsOutlined /><span>群组管理</span></span>} style={{ display: this.state.display_Visitor }}>
                    <Menu.Item><Link to='/user/myGroups'>我的群组</Link></Menu.Item>
                  </Menu.SubMenu>
                  <Menu.SubMenu title={<span><AppstoreOutlined /><span>其它</span></span>} style={{ display: this.state.display_Visitor }}>
                    <Menu.Item><Link to='/others/equipmentRepair'>设备报修</Link></Menu.Item>
                    <Menu.Item><Link to='/others/doorApply'>开门申请</Link></Menu.Item>
                  </Menu.SubMenu>
                </Menu>
              </Layout.Sider>

              {/* 核心页面 */}
              <Layout.Content className='contentLayout'>
                {/* 登录与找回密码 */}
                <Row style={{ marginTop: 10, borderRadius: 10 }}>
                  <Col span={10} offset={7} >
                    {/*登录*/}
                    <Card title="登录" className="loginCard" style={{ display: this.state.display_Login }}>
                      <Input prefix={<UserOutlined />} type='' placeholder='用户名' onKeyUp={this.usernameChange}></Input>
                      <br /><br />
                      <Input prefix={<LockOutlined />} type='password' placeholder='密码' onKeyUp={this.passwordChange}></Input>
                      <Button className={'headBtn1'} type='default' onClick={this.showForget}>忘记密码</Button>
                      <Button className={'headBtn2'} type='primary' loading={this.state.loading} onClick={this.enterLoading} >登录</Button>
                      <Button className={'headBtn3'} type='default' onClick={this.signUp}>还没有账号？点击注册</Button>
                    </Card>

                    {/*找回密码*/}
                    <Card title="找回密码" className={"forgetCard"} style={{ display: this.state.display_Forget }}>
                      <Steps style={{ width: '100%' }} current={0}>
                        <Steps.Step style={{ margin: 0 }} title="第一步" description="获取验证码" />
                        <Steps.Step style={{ margin: 0, marginRight: 30 }} title="第二步" description="修改密码" />
                        <Steps.Step style={{ margin: 0 }} title="第三步" description="修改成功" />
                      </Steps>
                      <br />
                      <Input type='' placeholder='手机号' onKeyUp={this.phoneChange}></Input>
                      <br />
                      <Input type='' className='phoneCodeInput' placeholder='输入验证码' onKeyUp={this.phoneCodeChange}></Input>
                      <Button className='forgetBtn2' type='default' disabled={this.state.disabled_getCode} onClick={this.getPhoneCode}>{this.state.codeTime > 0 ? "请" + this.state.codeTime + "秒后再试" : "获取验证码"}</Button>
                      <Button className='forgetBtn1' type='default' onClick={this.showLogin}>返回登录</Button>
                      <Button className='forgetBtn1' type='primary' onClick={this.compareCode}>下一步</Button>
                    </Card>

                    {/*修改密码*/}
                    <Card title="找回密码" className={"forgetCard"} style={{ display: this.state.display_Change }}>
                      <Steps style={{ width: '440px' }} current={1}>
                        <Steps.Step style={{ margin: 0 }} title="第一步" description="获取验证码" />
                        <Steps.Step style={{ margin: 0, marginRight: 30 }} title="第二步" description="修改密码" />
                        <Steps.Step style={{ margin: 0 }} title="第三步" description="修改成功" />
                      </Steps>
                      <br />
                      <Input type='' placeholder='输入新密码' onKeyUp={this.passwordChange}></Input>
                      <br /><br />
                      <Input type='' placeholder='再次输入密码' onKeyUp={this.newPasswordChange}></Input>
                      <Button className='forgetBtn1' type='default' onClick={this.showLogin}>返回登录</Button>
                      <Button className='forgetBtn1' type='primary' onClick={this.comparePassword}>修改密码</Button>
                    </Card>

                    {/*修改成功*/}
                    <Card title="找回密码" className={"forgetCard"} style={{ display: this.state.display_ChangeSuccess }}>
                      <Steps style={{ width: '440px' }} current={2}>
                        <Steps.Step style={{ margin: 0 }} title="第一步" description="获取验证码" />
                        <Steps.Step style={{ margin: 0, marginRight: 30 }} title="第二步" description="修改密码" />
                        <Steps.Step style={{ margin: 0 }} title="第三步" description="修改成功,返回登录" />
                      </Steps>
                      <Button className='forgetBtn1' type='primary' onClick={this.showLogin}>返回登录</Button>
                    </Card>
                  </Col>
                </Row>

                {/*************************************页面路由**************************************/}
                {/*登录后内部页面链接*/}
                <div style={{ display: this.state.display_Head }}>
                  <Route path={"/booking/address"} component={B_O_Add} />
                  <Route path={"/booking/time"} component={B_O_Time} />
                  <Route path={"/booking/meeting"} component={B_O_Meeting} />
                  <Route path={"/user/myGroups"} component={Group} />
                  <Route path={"/user/findMeeting"} component={FindMeeting} />
                  <Route path={"/user/userInfo"} component={UserInfo} />
                  <Route path={"/welcome"} component={Welcome} />
                  <Route path={"/meeting/booking"} component={BookMeeting} />
                  <Route path={"/meeting/search"} component={SearchMeeting} />
                  <Route path={"/meeting/myMeeting"} component={SearchMeeting} />
                  <Route path={"/meeting/weeklyMeeting"} component={WeeklyMeeting} />
                  <Route path={"/others/doorApply"} component={DoorApply} />
                  <Route path={"/others/equipmentRepair"} component={EquipRepair} />
                  <Route path={"/manage/booking"} component={BookMeetingManage} />
                  <Route path={"/manage/meeting"} component={MeetingManage} />
                  <Route path={"/manage/role"} component={RoleManage} />
                  <Route path={"/manage/department"} component={DepartmentManage} />
                  <Route path={"/manage/equipment"} component={EquipmentManage} />
                  <Route path={"/manage/equipmentRepair"} component={EquipmentRepairManage} />
                  <Route path={"/manage/doorAccess"} component={DoorManage} />
                  <Route path={"/manage/file"} component={FileManage} />
                  <Route path={"/manage/weeklyMeeting"} component={WeeklyMeetingManage} />
                  <Route path={"/manage/detail"} component={DetailManage} />
                  <Route path={"/manage/meetingRoom"} component={MeetingRoomManage} />
                  <Route path={"/manage/meetingRoomParam"} component={MeetingParamManage} />
                  <Route path={"/manage/person"} component={PersonManage} />
                  <Route path={"/manage/face"} component={FaceManage} />
                  <Route path={"/manage/others"} component={OthersFaceManage} />
                  <Route path={"/manage/joinPerson"} component={JoinPersonManage} />
                  <Route path={"/manage/meetingInfo"} component={MeetingInfoManage} />
                  <Route path={"/manage/param"} component={ManageIndex} />
                  <Route path={"/myMeeting/myJoin"} component={MyJoinMeeting} />
                  <Route path={"/myMeeting/myVideoMeeting"} component={MyVideoMeeting} />
                  <Route path={"/index"}
                    render={() => {
                      return <BizDemo
                        loginFlag={this.state.loginFlag}
                      />
                    }}
                  />
                  <Route path={"/myMeeting/myLeave"} component={MyLeave} />
                  {/*隐藏的Link接口*/}
                  <Link to={"/index"} id="toIndex" />
                </div>
              </Layout.Content>
            </Layout>
          </Layout>
        </HashRouter>
      </div >
    )
  }
}

export default App;

///////////////////////////////////////////////////头部菜单栏页面/////////////////////////////////////////////////
class Head extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      username: "",
      password: "",
      visible: false,
      name: "登录",
      loading: false,
    }
  }
  //模块选择
  handleChange = (msg) => {
    this.props.changeMode(msg);
    document.getElementById("toIndex").click();//返回首页的Link
  }
  //登录身份
  loginRole = (msg) => {
    this.props.changeMode(msg);
  }
  //弹出登录框
  showDrawer = () => {
    this.setState({
      visible: true,
    });
  }
  //关闭登录框
  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  //修改用户名显示
  nameChange = (e) => {
    this.setState({ name: e })
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    this.props.logout();
    this.setState({
      visible: false,
    });
    this.logout();
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }

  //发送退出登录请求
  logout = () => {
    //POST方式,IP为本机IP
    const url = global.localhostUrl + "logout"
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
        if (data.status) {
          message.success("安全退出！");
        } else {
          message.error("未知错误");
        }
      }).catch(function (e) {
        console.log("fetch fail");
        alert('系统错误');
      });
  }

  //主函数
  render() {
    const logout = (<div onClick={this.showDrawer}>{"退出登录"}</div>);
    return (
      <div className={'head'} style={this.props.style}>
        <img src={logo} className="App-logo logo" alt="logo" onClick={function () { }} />
        <span className={'companyName'}><h2><Link to='/index'>智能会议室管理系统</Link></h2></span>

        {/*测试区 登录模式*/}
        <div style={this.props.admin_mode ? { display: "block" } : { display: "none" }}>
          <Select className={'headBtn1'} defaultValue={this.props.mode} style={{ width: 120 }} onChange={this.handleChange}>
            {/*<Select.Option value="游客模式">游客模式</Select.Option>*/}
            <Select.Option value="管理员模式">管理员模式</Select.Option>
            <Select.Option value="用户模式">用户模式</Select.Option>
          </Select>
        </div>

        {/*测试区 登录模式*/}

        {/*退出登录*/}
        <Popover title="" content={logout} >
          <Button className={'headBtn1'} type="primary" >{this.props.name}</Button>
        </Popover>
        {/*。。。按钮*/}
        {/*<Button className={'headBtn1'} type='primary' onClick={this.loginRole}><Icon type="ellipsis" /></Button>*/}
        {/*搜索框*/}
        {/*<Input className={'searchText'} suffix={<Icon type="search"  />} />*/}
        {/*抽屉式登录页面*/}
        {/*<Drawer title="用户登录" placement="right" onClose={this.onClose} visible={this.state.visible}>*/}
        {/*<p>用户</p>*/}
        {/*<Input type='' placeholder='用户名' onKeyUp={this.usernameChange}></Input>*/}
        {/*<br/>*/}
        {/*<br/>*/}
        {/*<p>密码</p>*/}
        {/*<Input type='password' placeholder='密码' onKeyUp={this.passwordChange}></Input>*/}
        {/*<Button className={'headBtn1'} type='default' onClick={this.onClose}>忘记密码</Button>*/}
        {/*<Button className={'headBtn2'} type='primary' loading={this.state.loading} onClick={this.enterLoading} >登录</Button>*/}
        {/*<Button className={'headBtn3'} type='default' onClick={this.sendAjax}>还没有账号？点击注册</Button>*/}
        {/*</Drawer>*/}
        {/*退出登录*/}
        <Modal
          open={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText={"确定"}
          cancelText={"取消"}
        >
          <h2>您确定要退出吗？</h2>
        </Modal>
      </div>
    );
  }
}