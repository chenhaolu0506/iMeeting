import React, { Component } from 'react';
import { Card, Col, Row, Badge, Table, Button, message, Input, Icon } from "antd";
import global from '@/global';
import Highlighter from "react-highlight-words";

class MyMeetLeave extends Component {
    componentDidMount() {
        this.CountLeaveInformation();
    }
    state = {
        meetList: [],
        expandedRowKeys: [],
        leaveInfoId: "",
    }
    //表格查询...this.getColumnSearchProps("name"),
    getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys, selectedKeys, confirm, clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => { this.searchInput = node; }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm)}
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Search
                </Button>
                <Button
                    onClick={() => this.handleReset(clearFilters)}
                    size="small"
                    style={{ width: 90 }}
                >
                    Reset
                </Button>
            </div>
        ),
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: (text) => (
            console.log('Text', text, text == null),
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text == null ? "" : text.toString()}
            />
        ),
    })
    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    }
    handleReset = (clearFilters) => {
        clearFilters();
        this.setState({ searchText: '' });
    }
    //表格查询

    //点击展开/隐藏相应的行
    onExpand = (expanded, record) => {
        console.log(expanded)
        console.log(record)
        this.showOneMeetingLeaveInfo(record.meetingId);
        if (expanded) {
            this.setState({
                expandedRowKeys: [
                    record.meetingId
                ]
            })
        } else {
            this.setState({
                expandedRowKeys: []
            })
        }

    }
    //点击展示会议请假内容
    expandedRowRender = (e) => {
        console.log(e)

        let columns = [{
            title: "姓名",
            dataIndex: "peopleName",
        }, {
            title: "联系电话",
            dataIndex: "peoplePhone",
        }, {
            title: "请假原因",
            dataIndex: "note",
        }, {
            title: <Button type={"primary"}>一键同意</Button>,
            render: (item) => {
                switch (item.status) {
                    case 1:
                        return <div>已同意</div>
                    case 2:
                        return <div>已拒绝</div>
                    default:
                        return (

                            <div>
                                <Button type={"primary"} onClick={(ev) => { this.agreeLeave(ev, item.leaveInfoId) }}>同意</Button>
                                <Button onClick={(ev) => { this.disagreeLeave(ev, item.leaveInfoId) }}>不同意</Button>
                            </div>
                        )
                }

            }
        }];

        return <Table
            rowKey={record => record.leaveInfoId}
            columns={columns}
            dataSource={this.state.dataSource}
        />

    }
    ///////////////////////////////////////////////////////fetch//////////////////////////////////////////////////
    //CountLeaveInformation获取会议列表
    CountLeaveInformation = () => {
        const url = global.localhostUrl + "meeting/CountLeaveInformation";
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
                meetList: data.data,
            })
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
    }
    //showOneMeetingLeaveInfo获取本会议请假信息
    showOneMeetingLeaveInfo = (e) => {
        const url = global.localhostUrl + "meeting/showOneMeetingLeaveInfo?meetingId=" + e;
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
                dataSource: data.data,
            })
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
    }
    //agreeLeave
    agreeLeave = (ev, e) => {
        console.log(e)
        const url = global.localhostUrl + "meeting/agreeLeave?leaveInfoId=" + e;
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
            message.success("操作成功!");
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
    }
    //disagreeLeave
    disagreeLeave = (ev, e) => {
        const url = global.localhostUrl + "meeting/disagreeLeave?leaveInfoId=" + e;
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
            message.success("操作成功!");
        }).catch(function (e) {
            console.log("fetch fail");
            alert('系统错误');
        });
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    render() {
        const columns = [{
            title: "会议名",
            dataIndex: "topic",
            ...this.getColumnSearchProps("topic"),
        }, {
            title: "会议时间",
            dataIndex: "meetTime",
            ...this.getColumnSearchProps("meetTime"),
        }, {
            title: "请假数量",
            render: (item) => {
                return <div>
                    <Badge status="warning" text={"请假信息:" + item.allCount} />
                    <Badge count={item.notDealCount} />
                </div>
            }
        }];
        return (
            <div >
                <Row>
                    <Col span={18} offset={3}>
                        <Card>
                            {/*<Collapse  onChange={callback}>*/}
                            {/*{*/}
                            {/*this.state.meetList.map((item)=>{*/}

                            {/*return(*/}
                            {/*<Collapse.Panel header={*/}
                            {/*<div>*/}
                            {/*<Row>*/}
                            {/*<Col span={6}>*/}
                            {/*<h3>{item.topic}</h3>*/}
                            {/*</Col>*/}
                            {/*<Col span={6}>*/}
                            {/*{item.meetTime}*/}
                            {/*</Col>*/}
                            {/*<Col span={6}>*/}
                            {/*<Badge status="warning" text={"请假信息:"+item.allCount}/>*/}
                            {/*<Badge count={item.notDealCount}/>*/}
                            {/*</Col>*/}
                            {/*</Row>*/}


                            {/*</div>*/}
                            {/*} key={item.meetingId}>*/}
                            {/*<p>{text}</p>*/}
                            {/*</Collapse.Panel>*/}
                            {/*)*/}

                            {/*})*/}
                            {/*}*/}
                            {/*</Collapse>*/}

                            <Table
                                rowKey={record => record.meetingId}
                                columns={columns}
                                // expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
                                expandedRowKeys={this.state.expandedRowKeys}
                                expandedRowRender={this.expandedRowRender}
                                onExpand={this.onExpand}
                                dataSource={this.state.meetList}
                            />

                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default MyMeetLeave;
