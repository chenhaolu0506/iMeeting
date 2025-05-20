import React, { Component } from 'react';
import { Chart, Geom, Axis, Tooltip, Coord, Label } from "bizcharts";
import { DataSet } from "@antv/data-set";
import moment from 'moment';
import { Col, Divider, Row, Tooltip as TooltipAnt, Collapse, message } from 'antd';
import "../../css/graph.less";
import global from "../../../global";
import { CaretDownFilled, CaretUpFilled, ExclamationCircleOutlined } from '@ant-design/icons';

const visitData = [];

const beginDay = new Date().getTime();

const fakeY = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5];
for (let i = 0; i < fakeY.length; i += 1) {
    visitData.push({
        x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
        y: fakeY[i],
    });
}

class BizDemo extends Component {
    componentWillReceiveProps(e) {
        if (e.loginFlag !== this.props.loginFlag) {
            this.indexData();
        }
    }
    componentDidMount() { //初始化
        const resizeEvent = new Event('resize', { bubbles: true, cancelable: true });
        window.dispatchEvent(resizeEvent);
        this.indexData();
    }
    state = {
        meetingList: [],
        autoHideXLabels: false,
        roomPercent: "14%",
        meetingCount: 0,
        data1: [
            {
                year: "2月1日",
                sales: 5
            },
            {
                year: "2月2日",
                sales: 2
            },
            {
                year: "2月3日",
                sales: 6
            },
            {
                year: "2月4日",
                sales: 1
            },
            {
                year: "2月5日",
                sales: 8
            },
            {
                year: "2月6日",
                sales: 3
            },
            {
                year: "2月7日",
                sales: 2
            },
            {
                year: "2月8日",
                sales: 4
            },
            {
                year: "2月9日",
                sales: 9
            },
            {
                year: "2月10日",
                sales: 2
            },
            {
                year: "2月11日",
                sales: 6
            },
            {
                year: "2月12日",
                sales: 5
            },
            {
                year: "2月13日",
                sales: 3
            },
            {
                year: "2月14日",
                sales: 8
            }
        ],
        lineData: [
            {
                country: "空闲会议室",
                population: 78
            }
        ],
        pieData: [
            {
                item: "会议室一",
                count: 40
            },
            {
                item: "会议室二",
                count: 21
            },
            {
                item: "会议室三",
                count: 17
            },
            {
                item: "会议室四",
                count: 13
            },
            {
                item: "会议室五",
                count: 9
            }
        ],
        areaData: [
            {
                year: "6%",
                value: 6
            }, {
                year: "7%",
                value: 7
            }, {
                year: "9%",
                value: 9
            }, {
                year: "7%",
                value: 7
            }, {
                year: "10%",
                value: 10
            }, {
                year: "14%",
                value: 14
            }, {
                year: "15%",
                value: 15
            }, {
                year: "16%",
                value: 16
            }, {
                year: "14%",
                value: 14
            }
        ],
        free: 100

    };

    ////////////////////////////////////////////////
    indexData = () => {
        let data1 = [
            {
                year: "2月1日",
                sales: 5
            }
        ]
        let lineData = [
            {
                country: "空闲会议室",
                population: 78
            }
        ]
        let pieData = [
            {
                item: "会议室一",
                count: 40
            },
            {
                item: "会议室二",
                count: 21
            },
            {
                item: "会议室三",
                count: 17
            },
            {
                item: "会议室四",
                count: 13
            },
            {
                item: "会议室五",
                count: 9
            }
        ]
        let meetingCount = 0
        let meetingList = []
        const url = global.localhostUrl + "meeting/indexData";
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
                    lineData = [
                        {
                            country: "空闲会议室",
                            population: data.data[1],
                        }
                    ];
                    data1 = []
                    data.data[3].map((item, i) => {
                        meetingCount = meetingCount + item
                        data1.push({
                            year: moment().add(-13 + i, 'days').format('MM月DD日'),
                            sales: item,
                        })
                    });

                    pieData = []
                    data.data[6].map(item => {
                        pieData.push({
                            item: item[0],
                            count: item[1]
                        })
                    })

                    meetingList = data.data[0]
                    data.data[4].map(item => {
                        return meetingList.push(item)
                    })

                    this.setState({
                        meetingList: data.data[0],
                        lineData: lineData,
                        pieData: pieData,
                        data1: data1,
                        free: data.data[1],
                        meetingCount: meetingCount,
                    }, () => {
                        const resizeEvent = new Event('resize', { bubbles: true, cancelable: true });
                        window.dispatchEvent(resizeEvent);
                    })
                }
            }).catch(function (e) {
                console.log(e);
                alert('系统错误');
            });
    }
    render() {
        const { DataView } = DataSet;

        const ds = new DataSet();
        //条形图dv
        const lineDv = ds.createView().source(this.state.lineData);
        lineDv.source(this.state.lineData).transform({
            type: "sort",
            callback(a, b) {
                // 排序依据，和原生js的排序callback一致
                return a.population - b.population > 0;
            }
        });
        //饼图dv
        const dv = new DataView();
        dv.source(this.state.pieData).transform({
            type: "percent",
            field: "count",
            dimension: "item",
            as: "percent"
        });

        const mode1 = { //自适应大小1号
            xs: { span: 24, offset: 0 },
            sm: { span: 20, offset: 2 },
            md: { span: 12, offset: 0 },
            lg: { span: 8, offset: 0 },
            xl: { span: 6, offset: 0 },
        }
        const mode2 = { //自适应大小1号
            xs: { span: 24, offset: 0 },
            sm: { span: 24, offset: 0 },
            md: { span: 24, offset: 0 },
            lg: { span: 16, offset: 0 },
            xl: { span: 18, offset: 0 },
        }

        const cols2 = {
            percent: {
                formatter: val => {
                    val = val * 100 + "%";
                    return val;
                }
            }
        };
        return (
            <div style={{ padding: 10 }}>
                <Row gutter={16}>
                    <Col {...mode1}>
                        <CardJGN
                            title={"会议室利用率"}
                            center={this.state.roomPercent}
                            text={"效率"}
                            chart={
                                <Chart
                                    height={50}
                                    data={this.state.areaData}
                                    // scale={cols}
                                    forceFit
                                    padding={'auto'}
                                >
                                    {/*<Axis name="year" />*/}
                                    {/*<Axis*/}
                                    {/*name="value"*/}
                                    {/*label={{*/}
                                    {/*formatter: val => {*/}
                                    {/*return (val / 10000).toFixed(1) + "k";*/}
                                    {/*}*/}
                                    {/*}}*/}
                                    {/*/>*/}
                                    <Tooltip
                                        crosshairs={{
                                            type: "line"
                                        }}
                                    />
                                    <Geom type="area" position="year*value" color={"#8f65dd"} />
                                    <Geom type="line" position="year*value" size={2} color={"#8f65dd"} />
                                </Chart>
                            }
                        />
                    </Col>
                    <Col {...mode1} >
                        <CardJGN
                            title={"近两周的开会总次数"}
                            text={"数量"}
                            center={this.state.meetingCount}
                            chart={
                                <Chart
                                    height={50}
                                    data={this.state.data1}
                                    scale={{
                                        sales: {
                                            formatter: val => {
                                                val = val * 100 + "%";
                                                return val;
                                            }
                                        }
                                    }}
                                    forceFit
                                    padding={'auto'}
                                >
                                    {/*Axis x,y轴*/}
                                    {/*<Axis name="year" />*/}
                                    {/*<Axis name="sales" />*/}
                                    {/*Tooltip 数据详细*/}
                                    <Tooltip
                                        itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
                                    />
                                    {/**/}
                                    <Geom
                                        // type="interval"
                                        position="year*sales"//有效数据
                                        tooltip={[
                                            "year*sales",
                                            (item, percent) => {
                                                // percent = percent * 100 + "%";
                                                return {
                                                    name: "会议次数",
                                                    value: percent
                                                };
                                            }
                                        ]}
                                    />
                                </Chart>
                            }
                        />
                    </Col>
                    <Col {...mode1} >
                        <CardJGN
                            title={"当前时段空闲会议室"}
                            center={this.state.free + "%"}
                            text={"实时"}
                            chart={
                                <Chart
                                    height={50}
                                    data={lineDv}
                                    forceFit
                                    padding={'auto'}
                                    scale={
                                        {
                                            'population': {
                                                type: "linear",
                                                min: 0,
                                                max: 100,
                                            }
                                        }
                                    }
                                >
                                    <Coord transpose />
                                    <Axis
                                        name="country"
                                        visible={false}
                                    />
                                    <Axis name="population" visible={false} />
                                    <Tooltip
                                        showTitle={false}
                                        itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
                                    />
                                    <Geom
                                        type="interval"
                                        position="country*population"
                                        tooltip={[
                                            "country*population",
                                            (item, percent) => {
                                                percent = percent + "%";
                                                return {
                                                    name: item,
                                                    value: percent
                                                };
                                            }
                                        ]}
                                        color={"#a5f465"}
                                    />
                                </Chart>
                            }
                        />
                    </Col>

                    <Col {...mode1} >
                        <CardJGN
                            title={"会议室排名"}
                            center={
                                <div >
                                    1.会议室二<CaretUpFilled style={{ color: "red" }} />
                                </div>
                            }
                            text={"数据"}
                            chart={
                                <div style={{ height: "56px" }}>
                                    <Row>
                                        <Col span={24}>
                                            <div style={{ float: "left", paddingLeft: "20px" }}>
                                                2.会议室一{" 88"}<CaretDownFilled style={{ color: "green" }} />
                                            </div>
                                        </Col>
                                        <Col span={24}>
                                            <div style={{ float: "left", paddingLeft: "20px" }}>
                                                3.会议室三{"  68"}<CaretUpFilled style={{ color: "red" }} />
                                            </div>
                                        </Col>
                                        <Col span={24}>
                                            <div style={{ float: "left", paddingLeft: "20px" }}>
                                                4.会议室四{"  65"}<CaretDownFilled style={{ color: "green" }} />
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            }
                        />
                    </Col>
                    <Col {...mode2} >
                        <CardJGN
                            title={"最近两周受邀请的会议和发起的会议"}
                            center={"我的会议"}
                            text={"数据"}
                            chart={
                                <div style={{ margin: "20px" }}>
                                    <Collapse>
                                        {
                                            this.state.meetingList.map((item, i) => {
                                                return (
                                                    <Collapse.Panel
                                                        header={item.topic + " " + item.meetDate.split("-")[1] + "月" + item.meetDate.split("-")[2] + "日 " + item.begin.split(" ")[1] + "-" + item.over.split(" ")[1] + " " + item.meetroom.name + " 发起人：" + item.userinfo.name}
                                                        key={i}
                                                    >
                                                        <p>{item.content}</p>
                                                    </Collapse.Panel>
                                                )
                                            })
                                        }
                                    </Collapse>
                                </div>
                            }
                        />
                    </Col>
                    <Col {...mode1} >
                        <CardJGN
                            title={"会议室热度"}
                            center={"会议室"}
                            text={"饼图"}
                            chart={
                                <Chart
                                    height={200}
                                    data={dv}
                                    scale={cols2}
                                    padding={'auto'}
                                    forceFit
                                >
                                    <Coord type="theta" radius={1} />
                                    <Axis name="percent" />
                                    <Tooltip
                                        showTitle={false}
                                        itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
                                    />
                                    <Geom
                                        type="intervalStack"
                                        position="percent"//有效数据
                                        color="item"//颜色分类
                                        tooltip={[
                                            "item*percent",
                                            (item, percent) => {
                                                percent = percent * 100 + "%";
                                                return {
                                                    name: item,
                                                    value: percent
                                                };
                                            }
                                        ]}
                                        style={{
                                            lineWidth: 1, //间隔
                                            stroke: "#fff", //间隔颜色
                                        }}
                                    >
                                        <Label
                                            content="item"
                                            offset={-40}
                                            textStyle={{
                                                rotate: 0,
                                                textAlign: "center",
                                                shadowBlur: 2,
                                                shadowColor: "rgba(0, 0, 0, .45)"
                                            }}
                                        />
                                    </Geom>
                                </Chart>
                            }
                        />
                    </Col>
                </Row>

            </div>
        );
    }
}
class CardJGN extends Component {
    render() {
        return (
            <div className={'card'}>
                <div style={{ width: "100%", height: "88px" }}>
                    <Row>
                        <Col>
                            <div style={{ margin: "20px" }}>
                                <div style={{ float: "left" }}>
                                    {this.props.title}
                                </div>
                                <div style={{ float: "right" }}>
                                    <TooltipAnt title="指标说明">
                                        <ExclamationCircleOutlined />
                                    </TooltipAnt>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div style={{ fontSize: "30px", float: "left", marginLeft: "20px" }}>
                                {this.props.center}
                            </div>
                        </Col>
                    </Row>

                </div>
                {this.props.chart}
                <Divider>{this.props.text}</Divider>
            </div>
        )
    }
}

export default BizDemo;