import React, { Component } from "react";
import { Button, Card, Col, Row, Drawer, Input, Tree, message, Modal, Spin } from "antd";
import { EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import global from "../../global";

class Group extends Component {
    componentDidMount() {
        this.showUser();
        this.showGroup();
    }
    state = {
        groupId: -1,
        modalVisible: false,
        visible: false,
        childrenDrawer: false,
        display_showUser: 'none',
        groupList: [],
        userList: [],
        groupUsers: [],
        treeData: [],
        groupData: [],
        expandedKeys: ["1"],
        selectedKeys: [],
        searchValue: '',
        groupName: '',
        newOrUpdate: true,
        loading: false
    };

    loading = () => {
        this.setState({
            loading: true
        })
    }
    stopLoading = () => {
        this.setState({
            loading: false
        })
    }
    showModal = (i) => {
        console.log(i);
        this.setState({
            modalVisible: true,
            groupId: i
        });
    }
    handleOk = e => {
        console.log(e);
        this.deleteGroup(this.state.groupId);
        this.setState({
            modalVisible: false,
        });
    }
    handleCancel = e => {
        console.log(e);
        this.setState({
            modalVisible: false,
        });
    }
    showDrawer = () => {
        this.setState({
            newOrUpdate:true,
            visible: true,
            groupUsers:[],
            treeData: [],
            selectedKeys:[],
            searchValue: '',
            groupName:'',
        });
    }
    onClose = () => {
        this.setState({
            visible: false,
        });
    }
    showChildrenDrawer = () => {
        this.setState({
            childrenDrawer: true,
            display_showUser:'block',
        });
    }
    onChildrenDrawerClose = () => {
        this.setState({
            childrenDrawer: false,
        })
    }

    // 显示用户
    showUser = () => {
        const url = global.localhostUrl + "group/showUser";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(function (res) {
            return res.json()
        }).then(json => {
            const data = json;
            console.log(data);
            console.log(data.data);
            this.setState({
                groupList:data.data[0],
                userList:data.data[1],
            })
        }).catch(function (e) {
            console.log(e);
            alert('系统错误');
        })
    }

    saveGroup = () => {
        let name = this.state.groupName;
        let idList = [];
        this.state.groupUsers.map((item) => {
            idList.push(item.id);
            return null;
        })
        const url = global.localhostUrl + "group/saveGroup";
        console.log({"name":name,"userIds":idList})
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include", //跨域携带cookie
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({name:name,userIds: idList}),
        }).then(res => res.json())
        .then(json => {
            const data = json;
            console.log(data);
            message.success("群组创建成功");
            this.showGroup();
            this.onClose();
        }).catch(function (e) {
            console.log(e);
            alert('系统错误');
        });
    }

    updateOneGroup = () =>{
        let name=this.state.groupName;
        let groupId=this.state.groupId;
        let idList=[];
        this.state.groupUsers.map((item)=>{
            idList.push(item[1].id);
            return null;
        })
        const url = global.localhostUrl + "group/updateOneGroup";
        console.log({"groupId":groupId,"name":name,"userIds":idList})
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",//跨域携带cookie
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({groupId: groupId, name: name, userIds: idList}),
        }).then(res => res.json())
        .then(json => {
            const data = json;
            console.log(data);
            message.success("群组保存成功");
            this.onClose();
            this.showGroup();
        }).catch(function (e) {
            console.log(e);
            alert('系统错误');
        });
    }

    showGroup = () =>{
        const url = global.localhostUrl + "group/showGroup";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(res => res.json())
        .then(json => {
            const data = json;
            console.log(data);
            this.setState({
                groupData:data.data
            })
        }).catch(function (e) {
            console.log(e);
            alert('系统错误');
        });
    }

    // 显示一个群组
    showOneGroup = (e, event) =>{
        this.loading();
        const url = global.localhostUrl + "group/showOneGroup?id=" + e;
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(res => res.json())
        .then(json => {
            const data = json;
            console.log(data);
            let selectedKeys = [];
            data.data[1].map((item, i)=>{
                console.log(item)
                this.state.groupList.map((item2, j)=>{
                    if (item.groupId === item2.id){
                        selectedKeys.push(1 + "-" + (j + 1) + "-" + item.userId);
                    }
                    return null;
                });
                return null;
            })

            console.log(selectedKeys)
            this.setState({
                selectedKeys: selectedKeys,
                treeData: selectedKeys
            }, function () {
                const groupUsers = [];
                let n = 0;
                this.state.treeData.map((item0) => {
                    console.log(item0)
                    let nums = item0.split("-");
                    let m = "";
                    if(nums[1] !== "0"){
                        n = nums[1];
                    }
                    this.state.userList.map((item, j) => {
                        this.state.userList[j].map((item2, i) => {
                            if (String(item2.id) === String(nums[2])) {
                                m = i;
                            }
                            return null;
                        });
                        // let i = m;
                        // return m = i;
                    })
                    if(n !== 0 && m !== ""){
                        return groupUsers.push([this.state.groupList[n - 1],this.state.userList[n - 1][parseInt(m)]])
                    }
                    return null;
                });
                this.setState({
                    groupUsers:groupUsers,
                    groupName:data.data[0].name,
                    newOrUpdate:false,
                    visible: true,
                    groupId:e
                })

            });
            this.showGroup();
            this.overLoading();
        }).catch(function (e) {
            console.log(e);
            alert('系统错误');
        });
    }

    // 删除群组
    deleteGroup = (id, event) => {
        const url= global.localhostUrl + "group/deleteGroup?id=" + id;
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials:"include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(res => res.json())
        .then(json => {
            const data = json;
            console.log(data);
            message.success("删除成功");
            this.showGroup();
        }).catch(function (e) {
            console.log(e);
            alert('系统错误');
        });
    }

    loadTree = (e) =>{
        console.log(e);
        console.log(this.state.treeData);
    }

    onCheck = (checked, info) => {
        let checkedKey=[...checked, ...info.halfCheckedKeys];
        console.log(checkedKey);
        this.setState({
            treeData:checkedKey
        }, function () {
            const groupUsers = [];
            let n = 0;
            this.state.treeData.forEach((item) => {
                let nums = item.split("-");
                let m = "";
                if(nums[1] !== "0"){
                    n = nums[1];
                }
                this.state.userList.forEach((item, j) => {
                    this.state.userList[j].forEach((item2, i) => {
                        if (String(item2.id) === String(nums[2])) {
                            m = i;
                        }
                    });
                })
                if(n !==0 && m !== ""){
                    console.log(n - 1)
                    console.log(this.state.groupList[n - 1]);
                    // console.log(this.state.groupList[6]);
                    console.log(this.state.userList[n - 1]);
                    return groupUsers.push([this.state.groupList[n - 1],this.state.userList[n - 1][parseInt(m)]])
                }
            });
            this.setState({
                groupUsers:groupUsers
            })
        })
    }

    // 查找
    onSearch = (e) => {
        console.log(e)
        const value = e;
        const expandedKeys = ["1"];
        this.state.groupList.forEach((item, i) => {
            if (item.name.indexOf(value) > -1) {
                expandedKeys.push(1 + "-" + item.id);
            }
            this.state.userList[i].forEach((item2) => {
                if (item2.name.indexOf(value) > -1) {
                    expandedKeys.push(1 + "-" + item.id);
                }
            });
        });
        console.log(expandedKeys)
        this.setState({
            expandedKeys:expandedKeys,
            searchValue: value,
        });
    }

    // 展开树
    onExpand = (expandedKeys) => {
        console.log(expandedKeys);
        this.setState({
            expandedKeys: expandedKeys,
        });
    }

    changeGroupName = (e) => {
        this.setState({
            groupName: e.target.value,
        });
    }

    render() {
        return (
            <div>
                <Row style={{marginTop: 10, borderRadius: 10}}>
                    <Col span={18} offset={3}>
                        <Card
                            title={<h1 style={{float:'left', marginBottom:-10}}>我的群组<Spin spinning={this.state.loading} size="large"/></h1>}
                            extra={<Button href="#" type="primary" onClick={this.showDrawer}>创建群组</Button>}
                        >
                            {
                                this.state.groupData.map((item,i)=>{
                                    return(
                                        <Card key={i}>
                                            <div>
                                                <Col span={4}>{i+1}</Col>
                                                <Col span={12}><h3>{item.name}</h3></Col>
                                                <Button size={"large"} type='default' onClick={this.showOneGroup.bind(this,item.id)}><EditOutlined /></Button>
                                                <Button size={"large"} type='danger' onClick={this.showModal.bind(this,item.id)}><DeleteOutlined /></Button>
                                            </div>
                                        </Card>
                                    )
                                })
                            }
                        </Card>
                    </Col>
                </Row>
                <Drawer
                    title={this.state.newOrUpdate?
                        <Button href="#" type={"primary"} onClick={this.saveGroup}>创建群组</Button>:
                        <Button href="#" type={"primary"} onClick={this.updateOneGroup}>保存修改</Button>
                    }
                    placement="right"
                    closable={false}
                    onClose={this.onClose}
                    open={this.state.visible}
                    width={"60%"}
                >
                    <h2>群组名称</h2>
                    <Input
                        placeholder="input search text"
                        value={this.state.groupName}
                        onChange={this.changeGroupName}
                        style={{  }}
                    />
                    <p></p>
                    <h2>成员<div style={{color:"#666666"}}>{this.state.groupUsers.length+" "} <UserOutlined /></div></h2>
                    <Button
                        onClick={this.showChildrenDrawer}
                        style={{ width:"100%",height:36,color:'#ff5500'}}
                        type="dashed"
                    >修改成员</Button>
                    {/* //////////////////此处存放成员列表//////////////////此处存放成员列表//////////////////此处存放成员列表//////////////////此处存放成员列表 */}
                    {
                        this.state.groupUsers.map((item, i) => {
                            console.log(this.state.groupUsers)
                            return(
                                <Button
                                    style={{ width:"100%",height:36 }}
                                    type="default"
                                    key={i}
                                ><h4>{item[0].name + "---" + item[1].name}</h4></Button>
                            )
                        })
                    }
                </Drawer>
                <Drawer
                    title="添加成员"
                    placement="right"
                    closable={false}
                    onClose={this.onChildrenDrawerClose}
                    open={this.state.childrenDrawer}
                    width={"50%"}
                >
                    <Input.Search
                        placeholder="input search text"
                        onSearch={this.onSearch}
                        style={{display:this.display_showUser}}
                    />
                    <p></p>
                    <p>群组成员</p>
                    <Tree
                        checkable
                        defaultExpandAll
                        onSelect={this.onSelect}
                        onCheck={this.onCheck}
                        onExpand={this.onExpand}
                        expandedKeys={this.state.expandedKeys}
                        defaultCheckedKeys={this.state.selectedKeys}
                    >
                        <Tree.TreeNode title="所有部门" key={1}>
                        {
                            this.state.groupList.map((item, i) => {
                                const index = item.name.indexOf(this.state.searchValue);
                                const beforeStr = item.name.substr(0, index);
                                const afterStr = item.name.substr(index + this.state.searchValue.length);
                                const title = index > -1 ? (
                                    <span>
                                        {beforeStr}
                                        <span style={{ color: '#ff5500' }}>{this.state.searchValue}</span>
                                        {afterStr}
                                     </span>
                                ) : <span>{item.name}</span>;
                                return(
                                    <Tree.TreeNode
                                        title={title}
                                        key={1 + "-" + (i + 1)}
                                    >{
                                        this.state.userList[i].map((item2, j) => {
                                            const index = item2.name.indexOf(this.state.searchValue);
                                            const beforeStr = item2.name.substr(0, index);
                                            const afterStr = item2.name.substr(index + this.state.searchValue.length);
                                            const title = index > -1 ? (
                                                <span>
                                                    {beforeStr}
                                                    <span style={{ color: '#ff5500' }}>{this.state.searchValue}</span>
                                                    {afterStr}
                                                </span>
                                            ) : <span>{item2.name}</span>;
                                            return(
                                                <Tree.TreeNode
                                                    title={title}
                                                    key={1 + "-" + (i + 1) + "-" + item2.id}
                                                >
                                                </Tree.TreeNode>
                                            )
                                        })
                                    }
                                    </Tree.TreeNode>
                                )
                            })
                        }
                        </Tree.TreeNode>

                    </Tree>
                </Drawer>

                <Modal
                    open={this.state.modalVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText={"确定"}
                    cancelText={"取消"}
                >
                    <h2>您确定要删除此群组吗？</h2>
                </Modal>
            </div>
        )
    }
}

export default Group;