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
	    this.updateUsed = this.updateUsed.bind(this);
    }

    state = {
        collapsed: false,
        activeSubmenu: "NewsFeed",
        userData:{},
        successfulLoad:true,
        servicesToLoad: 2,
        loadedServices: 0,
        modalIsOpen:false,
	    movies:[],
	    cost: 0,
	    nit: "",
	    prices: []
    };

    componentDidMount = () => {
    	this.getMovies();
    	this.setPrice();
    };

	updateUsed(e,idx,number){
		let me = this;
		me.setState ((prevState) =>{
			console.log("prevstate: ",prevState.movies);
			if(number > 0){
				//prevState.movies[idx].used = Math.min(prevState.movies[idx].used + number,prevState.movies[idx].quantity);
				prevState.movies[idx].used = Math.min(prevState.movies[idx].used + number,10);
			}else{
				prevState.movies[idx].used = Math.max(prevState.movies[idx].used + number,0);
			}
			prevState.cost = Math.max(0,prevState.cost + number*4);
			return prevState;
		});
	};

	setPrice = () => {
		let me = this;
		//console.log("Received values of form: ", values);
		var user = this.state.username;
		var password = this.state.password;
		// Default options are marked with *
		var data = JSON.stringify({

		});
		var url = constants.BACKEND_URL+"/price";
		fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json; charset=utf-8"
			}
		}).then(res => res.json())
			 .then(function (res) {
				 if (res.success === true) {
					 console.log("Success");
					 me.setState({prices: res.data});
					 console.log("Actual prices: ",res.data);
				 } else {
					 console.log("The servuce failed: ",res.message);
				 }
			 }).catch(error => {
			me.setState({displayAlert:2});
			console.log("Error: ", error);
		} );
	};

	getMovies = () => {
		let me = this;
		//console.log("Received values of form: ", values);
		var user = this.state.username;
		var password = this.state.password;
		// Default options are marked with *
		var data = JSON.stringify({

		});
		var url = constants.BACKEND_URL+"/movie";
		fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json; charset=utf-8"
			}
		}).then(res => res.json())
			 .then(function (res) {
				 if (res.success === true) {
					 console.log("Success");
					 let movies = res.data.movies;
					 me.setState ((prevState) =>{
						 for(let i=0;i<movies.length;i++){
							 movies[i].used = 0;
						 }
						 prevState.movies = movies;
						 console.log("New state:",prevState);
						 return prevState;
					 });
				 } else {
					 console.log("The servuce failed: ",res.message);
				 }
			 }).catch(error => {
			me.setState({displayAlert:2});
			console.log("Error: ", error);
		} );
	};

	makeLoan = () => {
		let me = this;
		//console.log("Received values of form: ", values);
		var user = this.state.username;
		var password = this.state.password;
		// Default options are marked with *
		var data = JSON.stringify({
			userId: 1,
			clientId: 1,
			cost: this.state.cost,
			nit: "123232332",
			expirationTime: moment().add(5,"d"),
			movieQuantities: this.state.movies
		});
		var url = constants.BACKEND_URL+"/loan";
		fetch(url, {
			method: "POST",
			body: data,
			headers: {
				"Content-Type": "application/json; charset=utf-8"
			}
		}).then(res => res.json())
			 .then(function (res) {
				 if (res.success === true) {
					 console.log("Success");
					 me.setState({modalIsOpen: false})
				 } else {
					 console.log("The servuce failed: ",res.message);
				 }
			 }).catch(error => {
			me.setState({displayAlert:2});
			console.log("Error: ", error);
		} );
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
	            <Row>
		            <Col span={24}>
			            <MovieForm movies={this.state.movies} updateUsed={this.updateUsed} complete={false}/>
		            </Col>
	            </Row>

                <br/>

                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className="gutter-row" span={6}></Col>
                    <Col className="gutter-row" span={6}>
                        <label className="txt2">Costo: {this.state.cost} Bs</label>
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
                    <Button className="button2" type={"primary"} onClick={this.makeLoan}>Prestar Películas</Button>
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
                <MovieForm movies={this.state.movies} updateUsed={this.updateUsed} complete={true}/>
                <br/>

                <Row justify="end">
                    <Col span={4}></Col>
                    <Col span={4}><label className="txt">Costo: {this.state.cost} Bs</label></Col>
                    <Col span={4}><label className="txt">Dias: </label>
                        <select id="cantidad" className="txt">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                    </Col>
                    <Col span={10}><input className="button3" onClick={this.openNotificationModal} type="submit" value="Realizar préstamo" /></Col>
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
