// import React, { Component } from 'react';
// import {Chart, Tooltip, Axis, Line, Point, Coord, Sector} from 'viser-react';
// import {Col, Divider, Row} from "antd";
// const data = [
//     { year: '1991', value: 3 },
//     { year: '1992', value: 4 },
//     { year: '1993', value: 3.5 },
//     { year: '1994', value: 5 },
//     { year: '1995', value: 4.9 },
//     { year: '1996', value: 6 },
//     { year: '1997', value: 7 },
//     { year: '1998', value: 9 },
//     { year: '1999', value: 13 },
// ];
// const scale = [{
//     dataKey: 'value',
//     min: 0,
// },{
//     dataKey: 'year',
//     min: 0,
//     max: 1,
// }];
//
//
// class ViserDemo1 extends Component {
//     componentDidMount() { //初始化
//         const e = document.createEvent("Event");
//         e.initEvent('resize', true, true);
//         window.dispatchEvent(e);
//     }
//     state={
//         data:[
//             { year: '2001', population: 41.8 },
//             { year: '2002', population: 38 },
//             { year: '2003', population: 33.7 },
//             { year: '2004', population: 30.7 },
//             { year: '2005', population: 25.8 },
//             { year: '2006', population: 31.7 },
//             { year: '2007', population: 33 },
//             { year: '2008', population: 46 },
//             { year: '2009', population: 38.3 },
//             { year: '2010', population: 28 },
//             { year: '2011', population: 42.5 },
//             { year: '2012', population: 30.3 },
//         ]
//     }
//     render() {
//         const mode1={//自适应大小1号
//             xs:{span:24,offset:0},
//             sm:{span:20,offset:2},
//             md:{span:12,offset:0},
//             lg:{span:8,offset:0},
//             xl:{span:6,offset:0},
//         }
//         // const mode2={//自适应大小2号
//         //     xs:{span:24,offset:0},
//         //     sm:{span:24,offset:0},
//         //     md:{span:24,offset:0},
//         //     lg:{span:16,offset:0},
//         //     xl:{span:18,offset:0},
//         // }
//         return (
//             <div >
//                 <Row gutter={16}>
//                     <Col {...mode1} >
//                         <div className={'card2'}>
//                             <Chart forceFit height={400} data={this.state.data}>
//                                 <Tooltip />
//                                 <Coord type="polar" innerRadius={0.2} />
//                                 {/*<Legend position="right" dataKey="year" offsetX={-140} />*/}
//                                 <Sector position="year*population" color="year" style={{ stroke: '#fff', lineWidth: 1 }} />
//                             </Chart>
//                             <Divider>line</Divider>
//                         </div>
//                     </Col>
//                     <Col {...mode1} >
//                         <div className={'card2'}>
//                             <Chart forceFit height={400} width={400} data={data} scale={scale}>
//                                 <Tooltip />
//                                 <Axis />
//                                 <Line position="year*value" />
//                                 <Point position="year*value" shape="circle"/>
//                             </Chart>
//                             <Divider>line</Divider>
//                         </div>
//                     </Col>
//                     <Col {...mode1} >
//                         <div className={'card2'}>
//                             <Chart forceFit height={400} width={400} data={data} scale={scale}>
//                                 <Tooltip />
//                                 <Axis />
//                                 <Line position="year*value" />
//                                 <Point position="year*value" shape="circle"/>
//                             </Chart>
//                             <Divider>line</Divider>
//                         </div>
//                     </Col>
//                     {/*<Col {...mode1} >*/}
//                         {/*<div className={'card2'}>*/}
//                             {/*<Chart forceFit height={400} width={400} data={data} scale={scale}>*/}
//                                 {/*<Tooltip />*/}
//                                 {/*<Axis />*/}
//                                 {/*<Line position="year*value" />*/}
//                                 {/*<Point position="year*value" shape="circle"/>*/}
//                             {/*</Chart>*/}
//                             {/*<Divider>line</Divider>*/}
//                         {/*</div>*/}
//                     {/*</Col>*/}
//                     {/*<Col {...mode1} >*/}
//                         {/*<div className={'card2'}>*/}
//                             {/*<Chart forceFit height={200}  data={data} scale={scale}>*/}
//                                 {/*<Tooltip />*/}
//                                 {/*<Axis />*/}
//                                 {/*<Line position="year*value" />*/}
//                                 {/*<Point position="year*value" shape="circle"/>*/}
//                             {/*</Chart>*/}
//                             {/*<Divider>line</Divider>*/}
//                         {/*</div>*/}
//                     {/*</Col>*/}
//
//                 </Row>
//
//             </div>
//         );
//     }
// }
//
// export default ViserDemo1;
