import React, { Component } from 'react';
// import {Layout} from "antd/lib/layout";
import { Carousel, Button} from 'antd';
import '@/css/Welcome.css';
import Img1 from '@/img/welcome/outDoor.png';
import Img2 from '@/img/welcome/ArcSoft.png';
import Img3 from '@/img/welcome/room1.png';
import Img4 from '@/img/welcome/ArcSoft.png';
import Img5 from '@/img/welcome/room1.png';
import {Link} from "react-router-dom";


class Welcome extends Component {

    toDemo1 = () =>{
        document.getElementById("demo1").click();
    }
    render() {
        return (
            <div className='welPage'>
                <br/>
                <h1>Welcome</h1>
                {/*轮播图*/}
                <Carousel autoplay='true' className='welCar'>
                    <img src={Img1} className='welImg' alt={1}/>
                    <img src={Img2} className='welImg' alt={2}/>
                    <img src={Img3} className='welImg' alt={3}/>
                    <img src={Img4} className='welImg' alt={4}/>
                    <img src={Img5} className='welImg' alt={5}/>
                </Carousel>
                <Button onClick={this.toDemo1}/>
                <Link to={"/graph/demo1"} id={"demo1"}/>
            </div>
        );
    }
}

export default Welcome;

