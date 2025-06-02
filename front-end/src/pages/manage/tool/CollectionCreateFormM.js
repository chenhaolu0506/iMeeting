import React, { Component } from 'react';
import { Button, Card, Col, DatePicker, Drawer, Input, Modal, Row, TimePicker, Form, Select } from "antd";
import global from '@/global';

const CollectionCreateFormM = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line

    class extends Component {
        componentDidMount() {
            this.getGroupList();
            this.selectPeople();
            this.props.form.setFieldsValue({
                continuedTime: [],
                description: [],
                groups: [],
                guests: [],
                meetingRoom: [],
                others: [],
                prepareTime: [],
                title: [],
            })
        }
        state = {
            selectedGroup: [],//已经被选中的群组
            selectedUsers: [],//已经被选中的人
            departList: [],
            userList: [],
            peopleList: [],
            userGroup: [],
            groupList: [],
            othersDisplay: false,
            othersName: "",
            othersPhone: "",
            othersList: [],
        };
        showOthers = () => {
            this.setState({
                othersName: "",
                othersPhone: "",
                othersDisplay: true
            })
        }
        handleOk = (e) => {
            const othersList = this.state.othersList;
            othersList.push({
                name: this.state.othersName,
                phone: this.state.othersPhone,
            })
            console.log(othersList)
            //内存中添加名字与信息
            this.setState({
                othersList: othersList
            }, function () {
                this.props.getOthersList(this.state.othersList)
            })
            //列表中添加名字
            const form = this.props.form.getFieldsValue();
            console.log(form)
            const others = form.others;
            others.push(this.state.othersName)
            this.props.form.setFieldsValue({
                others: others
            })
            this.setState({
                othersDisplay: false,
            });
        }
        handleCancel = (e) => {
            this.setState({
                othersDisplay: false,
            });
        }
        changeName = (e) => {
            this.setState({
                othersName: e.target.value,
            })
        }
        changePhone = (e) => {
            this.setState({
                othersPhone: e.target.value,
            })
        }
        //////////////////////////////////////////////////fetch接口////////////////////////////////////////////////////////////
        //获取群组列表
        getGroupList = () => {
            const url = global.localhostUrl + "meeting/getGroupList";
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
                    groupList: data.data,
                })
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
        }
        //selectPeople
        selectPeople = () => {
            const url = global.localhostUrl + "meeting/selectPeople";
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
                    departList: data.data[0],
                    userList: data.data[1],
                })
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
        }
        //this.handleChange
        groupChange = (e) => {
            console.log(e)
            this.setState({
                selectedGroup: e
            }, () => {
                const selectedUsers = [];
                this.state.selectedGroup.map((item, i) => {
                    const url = global.localhostUrl + "meeting/showOneGroup?groupId=" + item;
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
                        // const selectedUsers = data.data[1].filter(o => !this.state.selectedUsers.includes(o.userId));
                        data.data[1].map((item) => {
                            selectedUsers.includes(item.userId) ? selectedUsers.push() : selectedUsers.push(item.userId)
                            // selectedUsers.includes(item.userId)?null:selectedUsers.push(item.userId)
                            return null;
                        })
                        console.log(selectedUsers)
                        //跟新数据
                        this.props.form.setFieldsValue({
                            guests: selectedUsers
                        })
                    }).catch(function (e) {
                        console.log("fetch fail");
                        alert('系统错误');
                    });
                    return null;
                })
                //刷新
                this.props.form.setFieldsValue({
                    guests: selectedUsers
                })
            })


        }

        userChange = (e) => {
            console.log(e)
            this.props.form.setFieldsValue({
                guests: e
            })
        }
        othersChange = (e) => {
            console.log("第e步", e)
            const L = this.state.othersList.filter((item, i) => {
                let flag = false
                e.map(item2 => item.name === item2 ? flag = true : null)
                console.log(i + ":" + flag)
                return flag;
            })
            console.log("L=", L)
            this.setState({
                othersList: L
            }, function () {
                this.props.getOthersList(this.state.othersList);
            })
            this.props.form.setFieldsValue({
                others: e
            })
        }
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        render() {
            const {
                visible, onClose, onCreate, form,
            } = this.props;
            const { getFieldDecorator } = form;
            const formItemLayout = {
                labelCol: { span: 6 },
                wrapperCol: { span: 12 },
            };
            const formItemLayout2 = {
                labelCol: { span: 8 },
                wrapperCol: { span: 16 },
            };
            const timeList = [];
            let i = 0;
            for (i = -15; i <= 1440;) {
                i += 15;
                timeList.push(i)
            }

            return (
                <Drawer
                    title={
                        <Button href="#" type={"primary"} onClick={onCreate}>预定会议</Button>
                    }
                    placement="right"
                    closable={false}
                    onClose={onClose}
                    visible={visible}
                    width={"60%"}
                >
                    <Card>
                        <Form layout="vertical">
                            <Form.Item
                                {...formItemLayout}
                                label="标题"
                            >
                                {getFieldDecorator('title', {
                                    rules: [{ required: true, message: '请输入会议主题!' }],
                                })(
                                    <Input />
                                )}
                            </Form.Item>
                            <Row>
                                <Col span={18} >
                                    <Form.Item
                                        {...formItemLayout}
                                        label="会议负责人"

                                    >
                                        <Row>
                                            <Col span={12}>
                                                <Select
                                                    style={{ width: 120 }}
                                                    onChange={(value) => {
                                                        let userList = [];
                                                        this.props.userList[3].map((item) => {
                                                            if (item.departId === value) {
                                                                userList.push(item)
                                                            }
                                                        })
                                                        this.setState({
                                                            peopleList: userList
                                                        })
                                                    }}
                                                >
                                                    {this.props.userList[0].map((item, i) => {//roomList是后台数据列表
                                                        return (
                                                            <Select.Option value={item.id} key={i}>{item.name}</Select.Option>
                                                        )
                                                    })}

                                                </Select>
                                            </Col>
                                            <Col span={12}>
                                                {getFieldDecorator('userId', {
                                                    rules: [{ required: true, message: '请选择会议负责人！' }],
                                                }
                                                )(
                                                    <Select style={{ width: 120 }} onChange={() => { }}>
                                                        {this.state.peopleList.map((item, i) => {//roomList是后台数据列表
                                                            return (
                                                                <Select.Option value={item.id} key={i}>{item.name}</Select.Option>
                                                            )
                                                        })}

                                                    </Select>
                                                )}
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12} >
                                    <Form.Item
                                        {...formItemLayout}
                                        label="会议室"

                                    >
                                        {getFieldDecorator('meetingRoom', {
                                            rules: [{ required: true, message: '请选择会议室！' }],
                                        }
                                        )(
                                            <Select style={{ width: 120 }} onChange={() => { }}>
                                                {this.props.roomList.map((item, i) => {//roomList是后台数据列表
                                                    return (
                                                        <Select.Option value={item.id} key={i}>{item.name}</Select.Option>
                                                    )
                                                })}

                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row>
                                <Col span={6} >
                                    <Form.Item
                                        label="日期"
                                    >
                                        {getFieldDecorator('dateTime', {
                                            rules: [{ type: 'object', required: true, message: '请输入日期！' }],
                                        })(
                                            <DatePicker
                                                placeholder="选择日期"
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={6} >
                                    <Form.Item
                                        label="开始时间"
                                    >
                                        {getFieldDecorator('startTime', {
                                            rules: [{ type: 'object', required: true, message: '请输入开始时间！' }],
                                        })(
                                            <TimePicker
                                                placeholder="选择时间"
                                                minuteStep={15}
                                                format={'HH:mm'}
                                            />
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={6} >
                                    <Form.Item
                                        label="准备时间"
                                    >
                                        {getFieldDecorator('prepareTime', {
                                            rules: [{ required: true, message: '请输入准备时间！' }],
                                        })(
                                            <Select style={{ width: 140 }} onChange={() => { }}>
                                                {timeList.map((item, i) => {//roomList是后台数据列表
                                                    let T = "";
                                                    if (item < 60) {
                                                        T = (item + "分钟")
                                                    } else {
                                                        if (item % 60 === 0) {
                                                            T = (item / 60 + "小时 ")
                                                        } else {
                                                            T = (item / 60 - item / 60 % 1 + "小时 " + item % 60 + "分钟")
                                                        }
                                                    }
                                                    return (
                                                        <Select.Option value={item} key={i}>{T}</Select.Option>
                                                    )
                                                })}

                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={6} >
                                    <Form.Item
                                        label="持续时间"
                                    >
                                        {getFieldDecorator('continuedTime', {
                                            rules: [{ required: true, message: '请输入会议持续时间！' }],
                                        })(
                                            <Select style={{ width: 140 }} onChange={() => { }}>
                                                {timeList.map((item, i) => {//roomList是后台数据列表
                                                    let T = "";
                                                    if (item < 60) {
                                                        T = (item + "分钟")
                                                    } else {
                                                        if (item % 60 === 0) {
                                                            T = (item / 60 + "小时 ")
                                                        } else {
                                                            T = (item / 60 - item / 60 % 1 + "小时 " + item % 60 + "分钟")
                                                        }
                                                    }
                                                    return (
                                                        <Select.Option value={item} key={i}>{T}</Select.Option>
                                                    )
                                                })}

                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                {...formItemLayout}
                                label="说明"
                            >
                                {getFieldDecorator('description',
                                    {
                                        rules: [{ required: true, message: '请介绍一下你的会议！' }],
                                    }
                                )(
                                    <Input.TextArea
                                        rows={5}
                                    >
                                    </Input.TextArea>
                                )}
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                label="快速添加群组人员"
                            >
                                {getFieldDecorator('groups', {
                                    value: this.state.selectedGroup
                                })(

                                    <Select
                                        mode="multiple"
                                        onChange={this.groupChange}
                                        style={{ width: '100%' }}
                                    >
                                        {this.state.groupList.map((item) => (
                                            <Select.Option key={item.id} value={item.id}>
                                                {item.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                )}
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                label="参会人员"
                            >
                                {getFieldDecorator('guests', {
                                    rules: [{ required: true, message: '请填写参会人员！' }],
                                })(

                                    <Select
                                        mode="multiple"
                                        placeholder="参会人员列表"
                                        onChange={this.userChange}
                                        style={{ width: '100%' }}
                                    >
                                        {
                                            this.state.departList.map((item, i) => (
                                                <Select.OptGroup key={i} label={item.name}>
                                                    {this.state.userList[i].map((item2) => (
                                                        <Select.Option key={item2.id} value={item2.id}>
                                                            {item2.name}
                                                        </Select.Option>
                                                    ))}
                                                </Select.OptGroup>
                                            ))
                                        }
                                    </Select>
                                )}
                            </Form.Item>
                            <Row>
                                <Col span={18}>
                                    <Form.Item
                                        {...formItemLayout2}
                                        label="其它人员列表"
                                    >
                                        {getFieldDecorator('others', {
                                        })(

                                            <Select
                                                mode="multiple"
                                                placeholder="外来参会人员列表"
                                                onChange={this.othersChange}
                                                style={{ width: '100%' }}
                                            >
                                                {
                                                    this.state.othersList.map((item, i) => (
                                                        <Select.Option key={item.name} Option={item}>
                                                            {item.name}
                                                        </Select.Option>
                                                    ))
                                                }
                                            </Select>
                                        )}
                                    </Form.Item>
                                </Col>
                                <Col span={4} offset={2}>
                                    <Button type={"primary"} onClick={this.showOthers}>快速添加</Button>
                                </Col>
                            </Row>
                        </Form>
                        <Row style={{ display: this.state.othersDisplay }}>

                        </Row>
                        <Modal
                            title="快速添加参会人员"
                            visible={this.state.othersDisplay}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                        >
                            姓名：<Input value={this.state.othersName} onChange={this.changeName}></Input>
                            手机号码：<Input value={this.state.othersPhone} onChange={this.changePhone}></Input>
                        </Modal>
                    </Card>
                </Drawer>
            );
        }
    }
);
export default CollectionCreateFormM;
