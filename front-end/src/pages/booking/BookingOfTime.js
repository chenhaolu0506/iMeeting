import React, { Component  } from 'react';
import { Card, Col, Row,Calendar} from "antd";

class BookingOfTime extends Component {

     //修改日历日期
     onPanelChange =(value, mode)=> {
        console.log(value, mode);
    }

    render() {
        return (
            <div >

                <Row style={{marginTop:10,borderRadius:10}}>
                    <Col span={8} offset={15} >
                        <Card>
                            <Calendar fullscreen={false} onPanelChange={this.onPanelChange} locale={{"lang":{
                                    "month": "月",
                            }
                            }}/>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default BookingOfTime;
