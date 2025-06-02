import React, { Component } from "react";
import global from "../../../global";
import { Button, Drawer, Table, Tooltip, message } from "antd";
import { CheckOutlined, CloseOutlined, DeleteOutlined, DownloadOutlined } from "@ant-design/icons";

const Anchor = props => {
    return (
        <a {...props}>{props.children}</a>
    );
};

class FileDrawer extends Component {
    componentDidMount() {}
    state = {
        fileList: [],
    }

    findAllOnManage = () => {
        const url = global.localhostUrl + "file/findAllOnManage";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(res => res.json()).then(json => {
            const data = json;
            console.log(data);
            if (data.status) {
                this.setState({
                    fileList: data.data,
                })
            }
        }).catch(e =>{
            console.log(e);
            alert('系统错误');
        });
    }

    updateOne = (id, status) => {
        const url = global.localhostUrl + "file/editOne?fileId=" + id + "&status=" + status;
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(res => res.json()).then(json => {
            const data = json;
            console.log(data);
            if(data.status){
                message.success(data.message)
            }
            this.findAllOnManage();
        }).catch(function (e) {
            console.log(e);
            alert('系统错误');
        });
    }

    deleteOne = (id) => {
        const url = global.localhostUrl + "file/deleteOne?fileId=" + id;
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(res => res.json()).then(json => {
            const data = json;
            console.log(data);
            if(data.status){
                message.success(data.message);
            }else{
                message.error(data.message);
            }
            this.findAllOnManage();
        }).catch(function (e) {
            console.log(e);
            alert('系统错误');
        });
    }

    download = (id) => {
        const url = global.localhostUrl + "file/download?fileId="+id;
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(res => res.json()).then(json => {
            const data = json;
            console.log(data);
            if(data.status){
                message.success("操作成功！")
            }
        }).catch(function (e) {
            console.log(e);
            alert('系统错误');
        });
    }

    render() {
        const { visible, onClose } = this.props;
        const columns = [
            {
                title: '序号',
                key: 'id',
                render: (item, data, i) => {
                    return (<div>{ i + 1 }</div>)
                }
            },
            {
                title: '文件名',
                dataIndex: 'fileName',
            },
            {
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
            },
            {
                title:"操作",
                render: (item) => {
                    return(
                        <div>
                            <Tooltip title="允许下载">
                                <Button onClick={()=>{this.updateOne(item.id,1)}}><CheckOutlined /></Button>
                            </Tooltip>
                            <Tooltip title="禁止下载">
                                <Button onClick={()=>{this.updateOne(item.id,2)}}><CloseOutlined style={{color:"red"}}/></Button>
                            </Tooltip>
                            <Tooltip title="下载">
                                <Button onClick={() => { window.location.href = item.fileUrl + "/" + item.fileName }}>
                                    <DownloadOutlined />
                                </Button>
                            </Tooltip>
                            <Tooltip title="删除">
                                <Button onClick={() => {this.deleteOne(item.id)}}><DeleteOutlined style={{color:"red"}}/></Button>
                            </Tooltip>
                        </div>
                    )
                }
            }
        ];
        return (
            <div>
                <Drawer title="会议文件" placement="right" width={'60%'} onClose={onClose} closable={false} open={visible}>
                    <Table columns={columns} dataSource={this.state.fileList} rowKey={record => record.id} />
                    <Anchor id="downloadDiv" style={{display: 'none'}}></Anchor>
                </Drawer>
            </div>
        )
    }
}

export default FileDrawer;