import React, { Component } from 'react';
import { Button, Card, Col, DatePicker, Drawer, Input, Modal, Row, TimePicker, Form, Select } from "antd";
import global from "../../../global";

const WeeklyMeetingCreateForm = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line

    class extends Component {
        componentDidMount() {
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
            selectedGroup: [], //已经被选中的群组
            selectedUsers: [], //已经被选中的用户
            departList: [],
            userList: [],
            userGroup: [],
            groupList: [],
            othersDisplay: false,
            othersName: "",
            othersPhone: "",
            othersList: [],
        };

        render() {
            const { visible, onClose, onCreate, form } = this.props;
            const { getFieldDecorator } = form;
            const formItemLayout = {
                labelCol: { span: 6 },
                wrapperCol: { span: 12 },
            };

            let weekList = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
            return (
                <Drawer
                    title={
                        <Button href="#" type={"primary"} onClick={onCreate}>申请周会</Button>
                    }
                    placement="right"
                    closable={false}
                    onClose={onClose}
                    visible={visible}
                    width={"60%"}
                >
                    <Card>
                        <Form layout="vertical">
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        {...formItemLayout}
                                        label="会议室"
                                        name="meetRoomId"
                                        rules={[{ required: true, message: '请选择会议室！' }]}
                                    >
                                        <Select style={{ width: 120 }} placeholder="请选择会议室">
                                            {this.props.roomList.map((item, i) => {
                                                return (
                                                    <Select.Option value={item.id} key={i}>
                                                        {item.name}
                                                    </Select.Option>
                                                )
                                            })}

                                        </Select>

                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        {...formItemLayout}
                                        label="星期"
                                        name="week"
                                        rules={[{ required: true, message: '请选择星期！' }]}
                                    >
                                        <Select style={{ width: 120 }} placeholder="请选择星期">
                                            {weekList.map((item, i) => {
                                                return (
                                                    <Select.Option value={i} key={i}>
                                                        {item}
                                                    </Select.Option>
                                                )
                                            })}

                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={6} >
                                    <Form.Item
                                        label="例会开始日期"
                                        name="beginTime"
                                        rules={[{ type: 'object', required: true, message: '请输入日期！' }]}
                                    >
                                        <DatePicker
                                            placeholder="选择日期"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6} >
                                    <Form.Item
                                        label="例会结束日期"
                                        name="overTime"
                                        rules={[{ type: 'object', required: true, message: '请输入日期！' }]}
                                    >
                                        <DatePicker
                                            placeholder="选择日期"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6} >
                                    <Form.Item
                                        label="开始时间"
                                        name="meetBegin"
                                        rules={[{ type: 'object', required: true, message: '请输入开始时间！' }]}
                                    >
                                        <TimePicker
                                            placeholder="选择时间"
                                            minuteStep={15}
                                            format={'HH:mm'}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6} >
                                    <Form.Item
                                        label="结束时间"
                                        name="meetOver"
                                        rules={[{ type: 'object', required: true, message: '请输入结束时间！' }]}
                                    >
                                        <TimePicker
                                            placeholder="选择时间"
                                            minuteStep={15}
                                            format={'HH:mm'}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                {...formItemLayout}
                                label="说明"
                                name="note"
                                rules={[{ required: true, message: '请介绍一下你的会议！' }]}
                            >
                                <Input.TextArea
                                    rows={5}
                                >
                                </Input.TextArea>
                            </Form.Item>
                        </Form>
                    </Card>
                </Drawer>
            );
        }
    }
);

export default WeeklyMeetingCreateForm;