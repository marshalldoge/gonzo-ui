import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Modal from 'react-modal';
import "antd/dist/antd.css";
import "./_adminLayout.scss";
import {deleteCookie, getCookie, getJWtProperty, withParams} from "../../utils";
import {setIdAppUser,setAppUser,setModules,setClientData,setNitIdClientHashMap,
    setClientBillNameArray,setClientNitArray,setNitClientHashMap,setItemQuantityHashMap,
    setItemQuantityCode, setWarehouse, setShift, setCompany, setCurrency, setMeasure} from "../../redux/actions";
import moment from "moment";
import {connect} from "react-redux";
import * as constants from "../../constants";
import LoadingGif from'../../assets/gif/loading.gif';
import { Row,Col,Button,Layout, Menu, Breadcrumb, Typography } from 'antd';
const { Header, Content, Footer } = Layout;
const {Title} = Typography;

const MovieForm = React.lazy(() => import("../../components/MovieForm/MovieForm"));

class AdminLayout extends Component {
    constructor(props) {
        //console.log("PROPS comming in ADMINLAYOUT: ",props);
        super(props);
    }

    state = {
        collapsed: false,
        activeSubmenu: "NewsFeed",
        userData:{},
        successfulLoad:true,
        servicesToLoad: 2,
        loadedServices: 0,
        modalIsOpen:false
    };

    componentDidMount = () => {

    };


    logout = () => {
        deleteCookie("JWT");
        this.props.history.push("/login");
    };

    Loading = () => {
        return (
             <div style={{width:"100%",height:"100%",verticalAlign:"middle",textAlign:"center"}}>
                <img src={LoadingGif} alt={"Cargando..."}/>
             </div>
        );
    };

    openNotificationModal = () => {
        this.setState({modalIsOpen:true})
    };

    closeNotificationModal = () => {
        this.setState({modalIsOpen: false});
    };

    NotificationModal = () => {
        let me = this;
        function afterOpenModal() {
            // references are now sync'd and can be accessed.
            console.log("AFTER MODAL IS OPEN");
        }

        const customStyles = {
            content : {
                top                   : '50%',
                left                  : '50%',
                right                 : 'auto',
                bottom                : 'auto',
                marginRight           : '-50%',
                transform             : 'translate(-50%, -50%)',
                width                 : '500px'
            }
        };
        return (
            <Modal
                isOpen={this.state.modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={this.closeNotificationModal}
                style={customStyles}
                contentLabel="Noticiación"
                ariaHideApp={false}
            >
                <Row>
                    <Col span={12} offset={6}>
                        <Title level={4}>Préstamo de Películas</Title>
                    </Col>
                </Row>

                <br/>

                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row" span={6}></Col>
                    <Col className="gutter-row" span={6}>
                        <label className="txt2">Costo: 30 Bs</label>
                    </Col>
                    <Col className="gutter-row" span={6}>
                        <label className="txt2">Dias: </label>
                        <select id="cantidad" className="txt2">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                    </Col>
                    <Col className="gutter-row" span={6}></Col>
                </Row>

                <br/>

                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row" span={6}></Col>
                    <Col className="gutter-row" span={6}>
                    <Button className="button2" type={"danger"} onClick={this.closeNotificationModal}>Cancelar</Button>
                    </Col>
                    <Col className="gutter-row" span={6}>
                    <Button className="button2" type={"primary"} >Prestar Películas</Button>
                    </Col>
                    <Col className="gutter-row" span={6}></Col>
                </Row>

            </Modal>
        );
    };

    render() {
        //console.log("LOADING: ",this.state.loadedServices);
        return (
            <Layout className="layout" style = {{height:"100vh"}}>

                <br/>
                <Header className="header-container-wrapper">
                    <div className="logo" />
                    <Menu className="nav"
                        //theme="dark"
                        align= 'center'
                        mode="horizontal"
                        defaultSelectedKeys={['2']}
                        style={{ lineHeight: '64px' }}
                    >

                        <Row justify="space-around">
                            <Col span={7}><Menu.Item className="button" key="1">Gestionar clientes</Menu.Item></Col>
                            <Col span={7}><Menu.Item className="button" key="2">Gestionar préstamos</Menu.Item></Col>
                            <Col span={7}><Menu.Item className="button" key="3">Gestionar películas</Menu.Item></Col>
                        </Row>

                    </Menu>

                </Header>

                <br/>
                <Content style={{ padding: '0 50px' }}>
                    <div className="site-layout-content">

                    <Row justify="start">
                        <Col span={3}>
                            <select id="categorias" className="txt">
                                <option value="comedia">comedia</option>
                                <option value="terror">terror</option>
                                <option value="drama">drama</option>
                            </select>
                        </Col>
                        <Col span={7}>   <input type="text" name="name" className="txt"/></Col>
                        <Col span={4}><input className="button2" type="submit" value="buscar" /></Col>
                        <Col span={4}></Col>
                    </Row>

                <br/>
                <MovieForm/>
                <br/>

                <Row justify="end">
                    <Col span={4}></Col>
                    <Col span={4}><label className="txt">Costo: 30 Bs</label></Col>
                    <Col span={4}><label className="txt">Dias: </label>
                        <select id="cantidad" className="txt">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                    </Col>
                    <Col span={10}><input className="button3" type="submit" value="Realizar préstamo" /></Col>
                </Row>

            </div>

            <br/>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
            {this.NotificationModal()}

            </Content>

        </Layout>
        );
    }
}

export default withRouter(connect(null,{setIdAppUser,setAppUser,setModules,setClientData,
    setNitIdClientHashMap,setClientBillNameArray,setClientNitArray,setNitClientHashMap,
    setItemQuantityHashMap,setItemQuantityCode, setWarehouse, setShift, setCompany, setCurrency, setMeasure})(AdminLayout));
