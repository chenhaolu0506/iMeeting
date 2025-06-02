import React, { Component } from 'react';
// 引入 ECharts 主模块
import echarts from 'echarts';
import global from '@/global';


class MeetingGraph extends Component {
    componentWillReceiveProps(e){
        console.log("propsChange",e)
        this.props=e
        this.makeDraw();
    }
    componentDidMount = () =>{
        this.showUserinfo();
        let myChart = echarts.init(document.getElementById('main'));
        this.setState({
            myChart:myChart,
        });
    }
    state={
        flag:true,
        myChart:"",
        workNum:0,
    }
    // screenChange() {
    //     window.addEventListener('resize', this.resize);
    // }
    // componentWillUnmount() {
    //     window.removeEventListener('resize',this.resize);
    // }
    // constructor(props) {
    //     super(props);
    //     this.resize.bind(this);
    // }
    makeDraw = ( ) => {
        // this.screenChange();
        // 基于准备好的dom，初始化echarts实例
        let data = [];
        // let dataCount = 10;
        let startTime = this.props.startTime;
        let overTime = this.props.overTime;
        let searchMeetInfo=[];
        this.props.searchMeetInfo.map((item,i)=>{
            if(this.props.roomListShow[i]){//如果可以显示
                return searchMeetInfo.push(item);
            }else {
                return null;
            }
        })
        // let startTime = +new Date();
        let categories = [];
        this.props.roomList.map((item,i)=>{
            if(this.props.roomListShow[i]){//如果可以显示
                return categories.push(item.name);
            }else {
                return null;
            }
        })
        let types = [
            // {name: 'JS Heap', color: '#7b9ce1'},
            // {name: 'Documents', color: '#bd6d6c'},
            {name: 'Nodes', color: '#75d874'},
            // {name: 'Listeners', color: '#e0bc78'},
            {name: 'GPU Memory', color: '#dc77dc'},
            // {name: 'GPU', color: '#72b362'}
        ];
        // // Generate mock data
        // echarts.util.each(categories, function (category, index) {
        //     let baseTime = startTime;
        //     for (let i = 0; i < dataCount; i++) {
        //         let typeItem = types[Math.round(Math.random() * (types.length - 1))];
        //         let duration = Math.round(Math.random() * 10000);
        //         data.push({
        //             name: typeItem.name,
        //             value: [
        //                 index,
        //                 baseTime,
        //                 baseTime += duration,
        //                 duration
        //             ],
        //             itemStyle: {
        //                 normal: {
        //                     color: typeItem.color
        //                 }
        //             }
        //         });
        //         baseTime += Math.round(Math.random() * 2000);
        //     }
        // });
        // Generate mock data

        function renderItem(params, api) {
            let categoryIndex = api.value(0);
            let start = api.coord([api.value(1), categoryIndex]);
            let end = api.coord([api.value(2), categoryIndex]);
            let height = api.size([0, 1])[1] * 0.6;

            let rectShape = echarts.graphic.clipRectByRect({
                x: start[0],
                y: start[1] - height / 2,
                width: end[0] - start[0],
                height: height
            }, {
                x: params.coordSys.x,
                y: params.coordSys.y,
                width: params.coordSys.width,
                height: params.coordSys.height
            });

            return rectShape && {
                type: 'rect',
                shape: rectShape,
                style: api.style()
            };
        }
        let worknum=this.state.workNum;
        console.log(searchMeetInfo);
        echarts.util.each(categories, function (category, index) {
            if(searchMeetInfo!==null){
                searchMeetInfo[index].map(item=>{
                    let same=1;
                    if(item.userinfo.worknum===worknum){
                        same=0;
                    }
                    let typeItem = types[same];
                    // let typeItem = types[Math.round(Math.random() * (types.length - 1))];
                    data.push({
                        name: typeItem.name,
                        value: [
                            index,
                            item.begin,
                            item.over,
                            item.topic,
                            item.userinfo.name,
                        ],
                        itemStyle: {
                            normal: {
                                color: typeItem.color
                            }
                        }
                    });
                })
            }
        });
        this.state.myChart.setOption(  {
            tooltip: {
                formatter: function (params) {
                    return params.marker +
                        '会议时间:' + params.value[1].split(" ")[1] + " ~ " + params.value[2].split(" ")[1] + " \r\n" +
                        '预定人:' + params.value[4] ;
                }
            },
            title: {
                text: '',
                left: 'center'
            },
            dataZoom: [{
                type: 'slider',
                filterMode: 'weakFilter',
                showDataShadow: false,
                top: 400,
                height: 10,
                borderColor: 'transparent',
                backgroundColor: '#e2e2e2',
                handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
                handleSize: 20,
                handleStyle: {
                    shadowBlur: 6,
                    shadowOffsetX: 1,
                    shadowOffsetY: 2,
                    shadowColor: '#aaa'
                },
                labelFormatter: ''
            }, {
                type: 'inside',
                filterMode: 'weakFilter'
            }],
            grid: {
                height:300
            },
            xAxis: {
                type: 'time',
                min: startTime,
                max: overTime,
                scale: true,
            },
            yAxis: {
                data: categories
            },
            series: [{
                type: 'custom',
                renderItem: renderItem,
                smooth:false,
                itemStyle: {
                    normal: {
                        opacity: 0.9
                    }
                },
                encode: {
                    x: [1, 2],
                    y: 0
                },
                data: data
            }]
        });
    }
    //////////////////////////////////////////////////////////////////////////
    //获取用户信息
    showUserinfo = () =>{
        //POST方式,IP为本机IP
        const url=global.localhostUrl+"showUserinfo"
        // const url="http://39.106.56.132:8080/IMeeting/showUserinfo"
        fetch(url, {
            method: "POST",
            //type:"post",
            //url:"http://39.106.56.132:8080/userinfo/tologin",
            mode: "cors",
            credentials:"include",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                "Access-Control-Allow-Origin": "http://39.106.56.132:8082",
            },
            body: JSON.stringify({}),
        }).then(function (res) {//function (res) {} 和 res => {}效果一致
            return res.json()
        }).then(json => {
            // get result
            const data = json;
            console.log(data);
            this.setState({
                workNum:data.data.worknum,
            })
        }).catch( e => {
            console.log("fetch fail");
        });
    }
    render() {
        // if(this.state.flag){
        //     this.setState({
        //         flag:false,
        //     })
        // }
        {/*<div id="main" style={{ width: (document.body.clientWidth*14/24), height: 400 }}></div>*/}
        return (
            <div >
                <div onMouseLeave={this.makeDraw} onMouseOver={this.makeDraw} id="main" style={{ width: (document.body.clientWidth*14/24), height: 400 }}></div>
                {/*<div  style={{ width: (document.body.clientWidth*14/24), height: 400 }}></div>*/}
            </div>
        );
    }
}

export default MeetingGraph;
