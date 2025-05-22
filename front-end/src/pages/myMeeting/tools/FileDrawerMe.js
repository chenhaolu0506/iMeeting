import React, { Component } from 'react';
import { Button, Drawer, Table, Tooltip } from "antd"
import { DownloadOutlined } from "@ant-design/icons";

class FileDrawerMe extends Component {
    componentDidMount() { }
    state = {}

    render() {
        const {
            visible, onClose
        } = this.props;
        const columns = [
            {
                title: "序号",
                key: "id",
                render: (item, data, i) => {
                    return (<div>{i + 1}</div>)
                }
            }, {
                title: "文件名",
                dataIndex: "fileName",
            }, {
                title: "状态",
                dataIndex: "status",
                render: (item) => {
                    switch (item) {
                        case 1:
                            return "允许下载"
                        case 2:
                            return "禁止下载"
                        default:
                            return item
                    }
                }
            }, {
                title: "操作",
                render: (item) => {
                    return (
                        <div>
                            {
                                item.status === 1 ? <Tooltip title="下载">
                                    <Button
                                        onClick={() => {
                                            window.location.href = item.fileUrl + "/" + item.fileName
                                        }}
                                    >
                                        <DownloadOutlined />
                                    </Button>
                                </Tooltip> : ""
                            }
                        </div>
                    )
                }
            }
        ];
        return (
            <Drawer
                title={"会议文件"}
                placement="right"
                closable={false}
                onClose={onClose}
                open={visible}
                width={"60%"}
            >
                <Table
                    rowKey={record => record.id}
                    columns={columns}
                    dataSource={this.props.fileList}
                />
            </Drawer>
        );
    }
}

export default FileDrawerMe;