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
import { Row,Col,Button,Layout, Menu, Breadcrumb, Typography, Select, message, List } from 'antd';
const { Header, Content, Footer } = Layout;
const {Title} = Typography;
const { Option } = Select;

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
	    confirmationIsOpen: false,
	    videos: [],
	    movies:[],
	    cost: 0,
	    nit: "",
	    prices: [],
	    days: 1,
	    daysPrice: 0,
	    filter: ""
    };

    componentDidMount = () => {
    	this.getMovies();
    	this.setPrice();
    };

	updateUsed(e,idx,number){
		let me = this;
		me.setState ((prevState) =>{
			let newValue;
			if(number > 0){
				newValue = Math.min(prevState.movies[idx].used + number,prevState.movies[idx].quantity);
				prevState.movies[idx].used = newValue;
				// prevState.movies[idx].used = Math.min(prevState.movies[idx].used + number,prevState.movies);
			}else{
				newValue = Math.max(prevState.movies[idx].used + number,0);
				prevState.movies[idx].used = newValue;
			}

			let sum = 0;
			for(let i = 0; i < prevState.movies.length; i++) {
				sum += prevState.movies[i].used;
			}
			console.log("Total sum: ",sum, " and actualDayPrice: ",prevState.daysPrice);
			prevState.cost = sum * prevState.daysPrice;
			console.log("Updated ",prevState.movies[idx]," and cost eleveated with ",newValue);
			console.log("Prevstate after updating movie used: ",prevState);
			return prevState;
		});
	};

	updateDays = (value) => {
		let me = this;
		me.setState ((prevState) =>{
			//Select the cost for the day selected
			let newDaysPrice = 0;
			console.log("Type of value udpated ",typeof value," ",value);
			for(let i = 0; i < prevState.prices.length; i++) {
				if(prevState.prices[i].day === value) {
					newDaysPrice = prevState.prices[i].price;
				}
			}
			console.log("New days price is ",newDaysPrice);

			let sum = 0;
			for(let i = 0; i < prevState.movies.length; i++) {
				sum += prevState.movies[i].used;
			}
			prevState.cost = sum * newDaysPrice;
			prevState.days = value;
			prevState.daysPrice = newDaysPrice;
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
					 me.setState({
						 prices: res.data,
						 days: res.data[0].day,
						 daysPrice: res.data[0].price
					 });
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
			days: this.state.days,
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
					 me.setState ((prevState) =>{
						 prevState.modalIsOpen = false;
						 prevState.videos = res.data.videos;
						 prevState.confirmationIsOpen = true;
						 return prevState;
					 });
					 me.getMovies();
					 message.success("El préstamo se ha realizado correctamen.");
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

	closeConfirmationModal = () => {
		this.setState({confirmationIsOpen: false});
	};

	setFilter = (e) => {
		console.log("filter value: ",e.target.value);
		this.setState({filter: e.target.value});
	};

	DiasSelect = () => {
		/*
		<select id="cantidad" className="txt2">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
		 */
		let options = this.state.prices.map(x => <Option key={x.id} value={x.day}>{x.day}</Option>);
		return (
			<Select id="cantidad" className="txt2" onChange={this.updateDays} defaultValue={this.state.days}>
				{options}
			</Select>
		);
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
			            <MovieForm
				             movies={this.state.movies} updateUsed={this.updateUsed} complete={false}
				             filter={this.state.filter}
			            />
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
	                    {this.DiasSelect()}
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

	ConfirmationNotification = () => {
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
				  isOpen={this.state.confirmationIsOpen}
				  onRequestClose={this.closeConfirmationModal}
				  style={customStyles}
				  contentLabel="Confirmation"
				  ariaHideApp={false}
			 >
				 <Row>
					 <Col span={24}>
						 <List
							  header={<div>Videos a prestar</div>}
							  bordered
							  dataSource={this.state.videos}
							  renderItem={item => (
								   <List.Item>
									   <Typography.Text mark>{item.id}</Typography.Text> {item.movieName}
								   </List.Item>
							  )}
						 />
					 </Col>
				 </Row>

				 <br/>

				 <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
					 <Col className="gutter-row" span={8}></Col>
					 <Col className="gutter-row" span={8}>
						 <Button className="button2" type={"danger"} onClick={this.closeConfirmationModal}>Aceptar</Button>
					 </Col>
					 <Col className="gutter-row" span={8}></Col>
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
                            <Col  span={8}>
                            <Menu.Item className="button" key="1">Gestionar clientes</Menu.Item>
                            </Col>
                            <Col  span={8}>
                            <Menu.Item className="button" key="2">Gestionar préstamos</Menu.Item>
                            </Col>
                            <Col  span={8}>
                            <Menu.Item className="button" key="3">Gestionar películas</Menu.Item>
                            </Col>
                        </Row>

                    </Menu>

                </Header>
                <br/>
                <br/>
                <Content style={{ padding: '0 50px' }}>
                    <div className="site-layout-content">

                    <Row justify="start">
	                    <Col span={8}></Col>
                        <Col span={8}><input type="text" name="name" className="txt" onChange={this.setFilter}/></Col>
                        <Col span={4}><input className="button2" type="submit" value="buscar" /></Col>
                        <Col span={4}></Col>
                    </Row>

                <br/>
                <MovieForm movies={this.state.movies} updateUsed={this.updateUsed} complete={true}
                           filter={this.state.filter}
                />
                <br/>

                <Row justify="end">
                    <Col span={4}></Col>
                    <Col span={4}><label className="txt">Costo: {this.state.cost} Bs</label></Col>
                    <Col span={4}><label className="txt">Dias: </label>
	                    {this.DiasSelect()}
                    </Col>
                    <Col span={4}><input className="button3" onClick={this.openNotificationModal} type="submit" value="Realizar préstamo" /></Col>
                </Row>

            </div>

            <br/>
            <Footer className="foot">Gonzo Design ©2020 Created by GonzoTeam</Footer>
            {this.NotificationModal()}
            {this.ConfirmationNotification()}
            </Content>

        </Layout>
        );
    }
}

export default withRouter(connect(null,{setIdAppUser,setAppUser,setModules,setClientData,
    setNitIdClientHashMap,setClientBillNameArray,setClientNitArray,setNitClientHashMap,
    setItemQuantityHashMap,setItemQuantityCode, setWarehouse, setShift, setCompany, setCurrency, setMeasure})(AdminLayout));
