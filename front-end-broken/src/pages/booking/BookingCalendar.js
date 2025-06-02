import React, { Component } from "react";
import { Card, Col, Row, Calendar } from "antd";

// Renders the booking calendar
class BookingCalendar extends Component {
    onPanelChange = (value, mode) => {
        console.log(value, mode);
    }

    render() {
        return (
            <div>
                <Row style={{marginTop: 10, borderRadius: 10}}>
                    <Col span={8} offset={15}>
                        <Calendar fullscreen={false} onPanelChange={this.onPanelChange} locale={{"lang": {"month": "月"}}}/>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default BookingCalendar;