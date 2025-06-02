import React, { Component } from 'react';
import {Icon, Menu,Button,Layout} from "antd";

class LeftSider extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {

            display_name: 'block', //此状态机为display的取值
            menu_mode:'inline',//vertical
            width: '200px',
        }
    }

    display_name() { //编辑按钮的单击事件，修改状态机display_name的取值
        if (this.state.display_name === 'none') {
            this.setState({
                menu_mode: 'inline',
                display_name: 'block',
                width: '200px',
            })
        }
        else if (this.state.display_name === 'block') {
            this.setState({
                menu_mode: 'vertical',
                display_name: 'none',
                width: '60px',
            })

        }
    }
    menu_mode() { //编辑按钮的单击事件，修改状态机display_name的取值
        if (this.state.menu_mode === 'inline') {
            this.setState({
                menu_mode: 'vertical',
            })
        }
        else if (this.state.menu_mode === 'vertical') {
            this.setState({
                menu_mode: 'inline',
            })

        }
    }

    render() {
        const tit1=
            <div >
                <Icon type={'user'}/><span ><span style={{display:this.state.display_name}}>User</span></span>
            </div>
        return (
            <Layout >

            </Layout>
        );
    }
}

export default LeftSider;
