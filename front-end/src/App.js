import logo from './logo.svg';
import './App.css';
import 'antd/dist/reset.css';
import React, { useState } from 'react';
import { Button, Card, Input, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined, LockOutlined } from '@ant-design/icons';


function App() {
  let [userName, setUserName] = useState();
  let [password, setPassword] = useState();
  const [messageApi, contextHolder] = message.useMessage();
  let handleLogin = () => {
    console.log(userName);
    if (!userName ) {
      messageApi.open({
        type: 'warning',
        content: 'Please enter your username!',
      });
    }
    if (!password ) {
      messageApi.open({
        type: 'warning',
        content: 'Please enter your password!',
      })
    }

    if (!userName || !password) {
      return;
    }
    let url = "http://localhost:8080/user/login?username=" + userName + "&password=" + password;
    fetch(url, {
      method: 'POST', mode: 'no-cors'})
      .then(res => res.json())
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }
  return (
    <div className="site-card-borderless-wrapper">
      {contextHolder}
      <Card title="Login">
        <Input placeholder="Username" prefix={<UserOutlined />} onChange={e => setUserName(e.target.value)}/>
        <Input.Password
          placeholder="Password"
          prefix={<LockOutlined />}
          iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          onChange={e => setPassword(e.target.value)}
        />

        <Button type="primary" onClick={handleLogin}>Login</Button>
      </Card>
    </div>
  );
}

export default App;
