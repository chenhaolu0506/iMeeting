import React, { Component } from 'react';
import { Button, Card, Col, Row, Icon, Drawer, Input, Tree, message, Modal, Spin } from "antd";
import global from '@/global';

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
        loading: false,
    };

    /////////////////////////////////////////////////抽屉/////////////////////////////////////////////////
    loading = () => {
        this.setState({ loading: true });
    }
    stopLoading = () => {
        this.setState({ loading: false });
    }
    showModal = (i) => {
        // console.log(i)
        this.setState({
            modalVisible: true,
            groupId: i
        });
    }

    handleOk = (e) => {
        // console.log(e);
        this.deleteGroup(this.state.groupId);
        this.setState({
            modalVisible: false,
        });
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            modalVisible: false,
        });
    }
    showDrawer = () => {
        this.setState({
            newOrUpdate: true,
            visible: true,
            groupUsers: [],
            treeData: [],
            selectedKeys: [],
            searchValue: '',
            groupName: '',
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    showChildrenDrawer = () => {
        this.setState({
            childrenDrawer: true,
            display_display_showUser: 'block',
        });
    };

    onChildrenDrawerClose = () => {
        this.setState({
            childrenDrawer: false,
        });
    };
    /////////////////////////////////////////////////请求/////////////////////////////////////////////////
    //查看用户及其部门
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
        }).then(res => res.json())
            .then(json => {
                const data = json;
                this.setState({
                    groupList: data.data[0],
                    userList: data.data[1],
                })
            }).catch(function (e) {
                console.log(e);
                alert('系统错误');
            })
    }
    //新建群组
    saveGroup = () => {
        let name = this.state.groupName;
        let idList = [];
        this.state.groupUsers.map((item) => {
            idList.push(item.id);
            return null;
        })
        const url = global.localhostUrl + "group/saveGroup";
        // console.log({ "name": name, "userIds": idList })
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include", //跨域携带cookie
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({ name: name, userIds: idList }),
        }).then(res => res.json())
            .then(json => {
                const data = json;
                // console.log(data);
                message.success("群组创建成功");
                this.showGroup();
                this.onClose();
            }).catch(function (e) {
                console.log(e);
                alert('系统错误');
            });
    }
    //更新群组
    updateOneGroup = () => {
        let name = this.state.groupName;
        let groupId = this.state.groupId;
        let idList = [];
        this.state.groupUsers.map((item) => {
            idList.push(item[1].id);
            return null;
        })
        const url = global.localhostUrl + "group/updateOneGroup";
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",//跨域携带cookie
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({ groupId: groupId, name: name, userIds: idList }),
        }).then(res => res.json())
            .then(json => {
                const data = json;
                message.success("群组保存成功");
                this.onClose();
                this.showGroup();
            }).catch(function (e) {
                console.log(e);
                alert('系统错误');
            });
    }
    //群组列表
    showGroup = () => {
        const url = global.localhostUrl + "group/showGroup";
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
                console.log('groups:', data.data)
                this.setState({
                    groupData: data.data
                })
            }).catch(function (e) {
                console.log(e);
                alert('系统错误');
            });
    }

    //查看单个群组
    showOneGroup = (e, event) => {
        this.loading();
        const url = global.localhostUrl + "group/showOneGroup?id=" + e;
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
                let selectedKeys = [];
                data.data[1].map((item, i) => {
                    this.state.groupList.map((item2, j) => {
                        if (item.groupId === item2.id) {
                            selectedKeys.push(1 + "-" + (j + 1) + "-" + item.userId);
                        }
                        return null;
                    });
                    return null;
                })
                this.setState({
                    selectedKeys: selectedKeys,
                    treeData: selectedKeys
                }, function () {
                    const groupUsers = [];
                    this.state.treeData.forEach(treeItem => {
                        let nums = treeItem.split("-");
                        let m = -1;
                        let n = parseInt(nums[1], 10);
                        for (let i = 0; i < this.state.userList.length; i++) {
                            const index = this.state.userList[i].findIndex(item => String(item.id) === String(nums[2]));
                            if (index !== -1) {
                                m = index;
                                break;
                            }
                        }
                        if (n !== 0 && m !== -1) {
                            groupUsers.push([this.state.groupList[n - 1], this.state.userList[n - 1][m]])
                        }
                    });
                    this.setState({
                        groupUsers: groupUsers,
                        groupName: data.data[0].name,
                        newOrUpdate: false,
                        visible: true,
                        groupId: e
                    })
                });
                this.showGroup();
                this.stopLoading();
            }).catch(function (e) {
                console.log(e);
                alert('系统错误');
            });
    }
    //删除群组
    deleteGroup = (id, event) => {
        const url = global.localhostUrl + "group/deleteGroup?id=" + id;
        fetch(url, {
            method: "POST",
            mode: "cors",
            credentials: "include",//跨域携带cookie
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({}),
        }).then(res => res.json())
            .then(json => {
                const data = json;
                message.success("删除成功");
                this.showGroup();
            }).catch(function (e) {
                console.log("fetch fail");
                alert('系统错误');
            });
    }


    /////////////////////////////////////////////////获取树内的信息/////////////////////////////////////////////////
    //输出选中
    loadTree = (e) => {
        console.log(e);
        console.log(this.state.treeData);
    }
    //选中,代码很乱，有空整理一下
    onCheck = (checked, info) => {
        let checkedKey = [...checked, ...info.halfCheckedKeys];
        this.setState({
            treeData: checkedKey
        }, function () {
            const groupUsers = [];
            this.state.treeData.forEach(treeItem => {
                const parts = treeItem.split("-");
                const groupId = parseInt(parts[1], 10);
                const userId = parts[2];
                if (groupId === 0 || isNaN(groupId)) {
                    return;
                }
                const userIndex = this.state.userList[groupId - 1].findIndex(item => String(item.id) === String(userId));
                if (userIndex !== -1) {
                    groupUsers.push([this.state.groupList[groupId - 1], this.state.userList[groupId - 1][userIndex]])
                }
            });
            this.setState({
                groupUsers: groupUsers
            })
        })
    }

    //查找
    onSearch = (e) => {
        const value = e;
        const expandedKeys = ["1"];
        this.state.groupList.forEach((group, i) => {
            if (group.name.indexOf(value) > -1) {
                expandedKeys.push(1 + "-" + group.id);
            }
            this.state.userList[i].forEach(user => {
                if (user.name.indexOf(value) > -1) {
                    expandedKeys.push(1 + "-" + group.id);
                }
            })
        });
        this.setState({
            expandedKeys: expandedKeys,
            searchValue: value,
        });
    }
    //展开树
    onExpand = (expandedKeys) => {
        // console.log(expandedKeys);
        this.setState({
            expandedKeys: expandedKeys,
        });
    }
    /////////////////////////////////////////////////创建群组/////////////////////////////////////////////////
    changeGroupName = (e) => {
        this.setState({
            groupName: e.target.value,
        });
    }
    render() {
        return (
            <div >
                <Row style={{ marginTop: 10, borderRadius: 10 }}>
                    <Col span={18} offset={3} >
                        <Card
                            title={<h1 style={{ float: 'left', marginBottom: -10 }}>我的群组<Spin spinning={this.state.loading} size="large" />
                            </h1>}
                            extra={<Button href="#" type={"primary"} onClick={this.showDrawer}>创建群组</Button>}
                        >
                            {
                                this.state.groupData.map((item, i) => {
                                    return (
                                        <Card key={i}>
                                            <div>
                                                <Col span={4}>{i + 1}</Col>
                                                <Col span={12}><h3>{item.name}</h3></Col>
                                                <Button size={"large"} type='default' onClick={this.showOneGroup.bind(this, item.id)}><Icon type="edit" /></Button>
                                                <Button size={"large"} type='danger' onClick={this.showModal.bind(this, item.id)}><Icon type="delete"></Icon></Button>
                                            </div>
                                        </Card>
                                    )
                                })
                            }
                        </Card>
                    </Col>
                </Row>
                <Drawer
                    title={this.state.newOrUpdate ?
                        <Button href="#" type={"primary"} onClick={this.saveGroup}>创建群组</Button> :
                        <Button href="#" type={"primary"} onClick={this.updateOneGroup}>保存修改</Button>
                    }
                    placement="right"
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.visible}
                    width={"60%"}
                >
                    <h2>群组名称</h2>
                    <Input
                        placeholder="input search text"
                        value={this.state.groupName}
                        onChange={this.changeGroupName}
                        style={{}}
                    />
                    <p></p>
                    <h2>成员<div style={{ color: "#666666" }}>{this.state.groupUsers.length + " "} <Icon type="user" /></div></h2>
                    <Button
                        onClick={this.showChildrenDrawer}
                        style={{ width: "100%", height: 36, color: '#ff5500' }}
                        type="dashed"
                    >修改成员</Button>
                    {/*//////////////////此处存放成员列表//////////////////此处存放成员列表//////////////////此处存放成员列表//////////////////此处存放成员列表*/}
                    {
                        this.state.groupUsers.map((item, i) => {
                            // console.log(this.state.groupUsers)
                            return (
                                <Button
                                    style={{ width: "100%", height: 36 }}
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
                    visible={this.state.childrenDrawer}
                    width={"50%"}
                >
                    <Input.Search
                        placeholder="input search text"
                        onSearch={this.onSearch}
                        style={{ display: this.display_showUser }}
                    />
                    <p></p>
                    <p> 群组成员</p>
                    <Tree
                        checkable
                        defaultExpandAll
                        onSelect={this.onSelect}
                        onCheck={this.onCheck}
                        // loadData={this.loadTree}
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
                                    return (
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
                                                    return (
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
                    visible={this.state.modalVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText={"确定"}
                    cancelText={"取消"}
                >
                    <h2>您确定要删除此群组吗？</h2>
                </Modal>
            </div>
        );
    }
}

export default Group;
