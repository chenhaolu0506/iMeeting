import React, { Component } from 'react';
import {Button, Card, Drawer, Input, Form} from "antd";

const LeaveDrawer = Form.create({ name: 'form_in_modal' })(
    // eslint-disable-next-line

    class extends Component {
        componentDidMount(){
            this.props.form.setFieldsValue({
                description: [],
            })
        }
        state={
        };
        //////////////////////////////////////////////////fetch接口////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        render() {
            const {
                visible, onClose,onCreate, form,
            } = this.props;
            const { getFieldDecorator } = form;
            const formItemLayout = {
                labelCol: { span: 3 },
                wrapperCol: { span: 18 },
            };
            return (
                <Drawer
                    title={
                        <Button type={"primary"} onClick={onCreate}>请假</Button>
                    }
                    placement="right"

                    onClose={onClose}
                    visible={visible}
                    width={"60%"}
                >
                    <Card>
                            <Form.Item
                                {...formItemLayout}
                                label="请假原因"
                            >
                                {getFieldDecorator('description')(
                                    <Input.TextArea
                                        rows={5}
                                    >
                                    </Input.TextArea>
                                )}
                            </Form.Item>
                    </Card>
                </Drawer>
            );
        }
    }
);
export default LeaveDrawer;
