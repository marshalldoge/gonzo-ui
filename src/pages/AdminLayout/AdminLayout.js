import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Modal from 'react-modal';
import "antd/dist/antd.css";
import "./_adminLayout.scss";
import {deleteCookie, getCookie, getJWtProperty, withParams,isTokenValid, tokenTimeLeft, getRoles} from "../../utils";
import moment from "moment";
import {connect} from "react-redux";
import * as constants from "../../constants";
import LoadingGif from'../../assets/gif/loading.gif';
import { Row,Col,Button,Layout, Menu, Breadcrumb, Typography, Select, Tabs, Card, Input } from 'antd';
import Logo from "../../assets/logos/piratebayLogo.png";
import * as columns from './TableColumns';
const { Header, Content, Footer } = Layout;
const {Title} = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { Search } = Input;


const UserTable = React.lazy(() => import("../../views/UserTable/UserTable"));
const ReactTable = React.lazy(() => import("../../components/ReactTable/ReactTable"));
const OrderProfile = React.lazy(() => import("../../components/OrderProfile/OrderProfile"));

class AdminLayout extends Component {
    constructor(props) {
        //console.log("PROPS comming in ADMINLAYOUT: ",props);
        super(props);
	    this.setHomeBody = this.setHomeBody.bind(this);
	    this.refreshJWT = this.refreshJWT.bind(this);
	    this.canMakeRequest = this.canMakeRequest.bind(this);
	    this.setOrderProfileDisplay = this.setOrderProfileDisplay.bind(this);
	    this.setTabsDisplay = this.setTabsDisplay.bind(this);
	    this.getUpdateOrderStatus = this.getUpdateOrderStatus.bind(this);
	    this.updatePreparedCopies = this.updatePreparedCopies.bind(this);
	    this.createProblem = this.createProblem.bind(this);
    }

    state = {
        collapsed: false,
	    display: "HOME",
	    rolesArray: [],
	    rolesMap: {},
	    paidOrderData: [],
	    preparedOrderData: [],
	    dispatchedOrderData: [],
	    deliveredOrderData: [],
	    orderData: [],
	    orderMovieData: {},
	    orderProblemData: {},
	    recordDisplayed: {},
	    nextStatusMessage: "",
	    activeKey: "1",
	    searchValue: ""
    };

	getOrderProblems = () => {
		let me = this;
		var url = constants.BACKEND_URL+"/api/v1/orders/problems";
		fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"Authorization": "bearer " + localStorage.getItem("authJWT")
			}
		}).then(response => {
			const status = response['status'];
			//console.log("Response: ",response, " status: ",status," - ",typeof status);
			if(status === 200){
				return response.json();
			} else {
				throw new Error('Something went wrong');
			}
		}).then(res => {
			//console.log("Success Getting MOVIES info", res);
			me.setState ((prevState) =>{
				prevState.orderProblemData = {};
				for(let i = 0; i < res.length; i++) {
					if(prevState.orderProblemData[res[i]['orderId']] === undefined) {
						prevState.orderProblemData[res[i]['orderId']] = [];
					}
					prevState.orderProblemData[res[i]['orderId']].push(
						 {
							 problemId: res[i]['problemId'],
							 orderStatus: res[i]['orderStatus'],
							 problemDescription: res[i]['problemDescription'],
							 date: res[i]['date'],
							 title: res[i]['title']
						 }
					);
				}
				//console.log("Problem Info: ",prevState.orderProblemData);
				return prevState;
			});
		}).catch(error => {
			console.log("Hubo el error: ",error);
		});
	};

	createProblem = (title, description, orderStatus, orderId) => {

		let me = this;
		let params = {
			orderId: orderId
		};
		let url = withParams(constants.BACKEND_URL+"/api/v1/problems",params);
		let date = moment().format('YYYY-MM-DD HH:mm:ss');
		let body = JSON.stringify({
			title: title,
			problemDescription: description,
			orderStatus: orderStatus,
			date: date
		});
		fetch(url, {
			method: "POST",
			body: body,
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"Authorization": "bearer " + localStorage.getItem("authJWT")
			}
		}).then(response => {
			const status = response['status'];
			//console.log("Response: ",response, " status: ",status," - ",typeof status);
			if(status === 200){
				return response.json();
			} else {
				throw new Error('Something went wrong');
			}
		}).then(res => {
			//console.log("Success Getting MOVIES info", res);
			me.setState ((prevState) =>{
				me.getOrderProblems();
				return prevState;
			});
		}).catch(error => {
			console.log("Hubo el error: ",error);
		});
	};


	getOrderMovies = () => {
		let me = this;
		var url = constants.BACKEND_URL+"/api/v1/orders/movies";
		fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"Authorization": "bearer " + localStorage.getItem("authJWT")
			}
		}).then(response => {
			const status = response['status'];
			//console.log("Response: ",response, " status: ",status," - ",typeof status);
			if(status === 200){
				return response.json();
			} else {
				throw new Error('Something went wrong');
			}
		}).then(res => {
			//console.log("Success Getting MOVIES info", res);
			me.setState ((prevState) =>{
				prevState.orderMovieData = {};
				for(let i = 0; i < res.length; i++) {
					if(prevState.orderMovieData[res[i]['orderId']] === undefined) {
						prevState.orderMovieData[res[i]['orderId']] = [];
					}
					prevState.orderMovieData[res[i]['orderId']].push(
						 {
							 name: res[i]['name'],
							 image: res[i]['image'],
							 quantity: res[i]['quantity'],
							 warehouseId: res[i]['warehouseId'],
							 preparedQuantity: res[i]['preparedQuantity'],
							 movieId: res[i]['movieId'],
							 cost: res[i]['cost']
						 }
					);
				}
				//console.log("Movie Info: ",prevState.orderMovieData);
				return prevState;
			});
		}).catch(error => {
			console.log("Hubo el error: ",error);
		});
	};

	getUpdateOrderStatus = (orderId, orderStatus) => {
		//console.log("Updating order ",orderId," to status ",orderStatus);
		let date = moment().format('YYYY-MM-DD HH:mm:ss');
		let me = this;
		let params = {
			orderStatus: orderStatus,
			date: date
		};
		var url = withParams(constants.BACKEND_URL+"/api/v1/orders/"+orderId.toString(),params);
		fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"Authorization": "bearer " + localStorage.getItem("authJWT")
			}
		}).then(response => {
			const status = response['status'];
			//console.log("Response: ",response, " status: ",status," - ",typeof status);
			if(status === 200){
				return response.json();
			} else {
				throw new Error('Something went wrong');
			}
		}).then(res => {
			//console.log("Success Updating status info", res);
			this.setState ((prevState) =>{
				prevState.display = 'ORDER_TABS';
				prevState.orderData = [];
				prevState.paidOrderData = [];
				prevState.preparedOrderData = [];
				prevState.dispatchedOrderData = [];
				prevState.deliveredOrderData = [];
				prevState.activeKey = (orderStatus-1).toString();
				me.getOrders();
				return prevState;
			});

		}).catch(error => {
			console.log("Hubo el error: ",error);
		});
	};

	updatePreparedCopies = (orderId, preparedCopies) => {
		//console.log("Updating order ",orderId," to UPDATE COPIES:  ",preparedCopies);
		let date = moment().format('YYYY-MM-DD HH:mm:ss');
		let me = this;
		var body = JSON.stringify(preparedCopies);
		var url = constants.BACKEND_URL+"/api/v1/orders/updatePreparedQuantities/"+orderId.toString();
		fetch(url, {
			method: "POST",
			body: body,
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"Authorization": "bearer " + localStorage.getItem("authJWT")
			}
		}).then(response => {
			const status = response['status'];
			//console.log("Response: ",response, " status: ",status," - ",typeof status);
			if(status === 200){
				return response.json();
			} else {
				throw new Error('Something went wrong');
			}
		}).then(res => {
			//console.log("Success Updating status info", res);
			this.setState ((prevState) =>{
				me.getOrderMovies();
				prevState.display = 'ORDER_TABS';
				return prevState;
			});

		}).catch(error => {
			console.log("Hubo el error: ",error);
		});
	};

    getOrders = () => {
	    let me = this;
	    var url = constants.BACKEND_URL+"/api/v1/orders";
	    fetch(url, {
		    method: "GET",
		    headers: {
			    "Content-Type": "application/json; charset=utf-8",
			    "Authorization": "bearer " + localStorage.getItem("authJWT")
		    }
	    }).then(response => {
		    const status = response['status'];
		    //console.log("Response: ",response, " status: ",status," - ",typeof status);
		    if(status === 200){
			    return response.json();
		    } else {
			    throw new Error('Something went wrong');
		    }
	    }).then(res => {
		    me.setState ((prevState) =>{
		    	prevState.orderData = res;
		    	for(let i = 0; i < res.length; i++) {
		    		switch(res[i]['orderStatus']){
					    case 1:
							prevState.paidOrderData.push(
								 {
									 ...res[i],
									 key: i
								 });
					    	break;
					    case 2:
						    prevState.preparedOrderData.push(
						     {
							     ...res[i],
							     key: i
						     });
					    	break;
					    case 3:
						    prevState.dispatchedOrderData.push(
							     {
								     ...res[i],
								     key: i
							     });
					    	break;
					    case 4:
						    prevState.deliveredOrderData.push(
							     {
								     ...res[i],
								     key: i
							     });
					    	break;
				    }
			    }
			    return prevState;
		    });
	    }).catch(error => {
		    console.log("Hubo el error: ",error);
	    });
    };

	refreshJWT = () => {
		let me = this;
		var data = JSON.stringify({
			refreshToken: localStorage.getItem('refreshJWT')
		});
		var url = constants.BACKEND_URL+"/api/v1/security/refresh";
		fetch(url, {
			method: "POST",
			body: data,
			headers: {
				"Content-Type": "application/json; charset=utf-8"
			}
		}).then(response => {
			const status = response['status'];
			//console.log("Response: ",response, " status: ",status," - ",typeof status);
			if(status === 200){
				return response.json();
			} else {
				throw new Error('Something went wrong');
			}
		}).then(res => {
			localStorage.setItem('authJWT', res.authentication);
			localStorage.setItem('refreshJWT', res.refresh);
			me.setRoles();
		}).catch(error => {
			console.log("Hubo el error: ",error);
		});
	};

	refreshJWTWithDisplayValidation = (display) => {
		let me = this;
		var data = JSON.stringify({
			refreshToken: localStorage.getItem('refreshJWT')
		});
		var url = constants.BACKEND_URL+"/api/v1/security/refresh";
		fetch(url, {
			method: "POST",
			body: data,
			headers: {
				"Content-Type": "application/json; charset=utf-8"
			}
		}).then(response => {
			const status = response['status'];
			//console.log("Response: ",response, " status: ",status," - ",typeof status);
			if(status === 200){
				return response.json();
			} else {
				throw new Error('Something went wrong');
			}
		}).then(res => {
			console.log("Success Refreshing for New dISPLAY");
			localStorage.setItem('authJWT', res.authentication);
			localStorage.setItem('refreshJWT', res.refresh);
			me.setRolesForNewDisplay(display);
		}).catch(error => {
			console.log("Hubo el error: ",error);
		});
	};



	canMakeRequest = (fnc) => {
		if(isTokenValid('authJWT')) {
			let message = "Auth Token is still valid with " + tokenTimeLeft('authJWT') + " s. left" + "\n" +
				 "Refresh Token is still valid with " + tokenTimeLeft('refreshJWT') + " s. left";
			alert(message);
			fnc();
			return true;
		}else {
			if(isTokenValid('refreshJWT')) {
				alert("Token is not valid but refresh still is... refreshing.");
				this.refreshJWT();
				return false;
			}else {
				alert("Neither the auth nor the refresh are valid :(");
				this.logout();
				return false;
			}
		}
	};

	setOrderProfileDisplay(record){
		this.setState({
			display: 'ORDER_PROFILE',
			recordDisplayed: record,

		});
		this.setState ((prevState) =>{
			prevState.display = 'ORDER_PROFILE';
			prevState.recordDisplayed = record;
			switch (record['orderStatus']) {
				case 1:
					prevState.nextStatusMessage = "Confirmar Preparado";
					break;
				case 2:
					prevState.nextStatusMessage = "Confirmar Despachado";
					break;
				case 3:
					prevState.nextStatusMessage = "Confirmar Entregado";
					break;
				case 4:
					prevState.nextStatusMessage = "";
			}
			return prevState;
		});
	};

	setTabsDisplay(record){
		this.setState({
			display: 'ORDER_TABS',
			recordDisplayed: record
		});
	};

	setRolesForNewDisplay(display) {
		let roles = getRoles('authJWT');
		let rolesMap = {};
		for(let i = 0; i < roles.length; i++) {
			rolesMap[roles[i]] = true;
		}
		this.setState({
			rolesMap: rolesMap,
			rolesArray: roles,
			display: display
		});
	}


	setRoles() {
		let roles = getRoles('authJWT');
		let rolesMap = {};
		for(let i = 0; i < roles.length; i++) {
			rolesMap[roles[i]] = true;
		}
		this.setState({
			rolesMap: rolesMap,
			rolesArray: roles
		});
	}

    componentDidMount = () => {
		this.getOrders();
		this.getOrderMovies();
	    this.refreshJWT();
	    this.getOrderProblems();
    };

    logout = () => {
    	let me = this;
	    localStorage.removeItem('authJWT');
	    localStorage.removeItem('refreshJWT');
	    const {from} = me.props.location.state || {from: {pathname: "/"}};
	    me.props.history.push(from);
    };



	TitanLogo = () => {
		return (
			 <img alt="" className={"logo"} src={Logo}/>
		);
	};

	setHomeBody = newDisplay => {
		this.refreshJWT();
		this.setState({
			display: newDisplay
		})
	};

	setTablesData = (filter) => {
		//console.log("Filtering with "+filter);
		this.setState ((prevState) =>{
			prevState.paidOrderData = [];
			prevState.preparedOrderData = [];
			prevState.dispatchedOrderData = [];
			prevState.deliveredOrderData = [];
			for(let i = 0; i < prevState.orderData.length; i++) {
				let includesOrderIdFilter = ((prevState.orderData[i]['orderId']).toString().toLowerCase().includes(filter));
				let includesNameFilter = ((prevState.orderData[i]['firstName']).toString().toLowerCase().includes(filter));
				//console.log((prevState.orderData[i]['orderId']).toString()," includes ",filter,includesFilter);
				if(!(includesOrderIdFilter || includesNameFilter))continue;
				switch(prevState.orderData[i]['orderStatus']){
					case 1:
						prevState.paidOrderData.push(
							 {
								 ...prevState.orderData[i],
								 key: i
							 });
						break;
					case 2:
						prevState.preparedOrderData.push(
							 {
								 ...prevState.orderData[i],
								 key: i
							 });
						break;
					case 3:
						prevState.dispatchedOrderData.push(
							 {
								 ...prevState.orderData[i],
								 key: i
							 });
						break;
					case 4:
						prevState.deliveredOrderData.push(
							 {
								 ...prevState.orderData[i],
								 key: i
							 });
						break;
				}
			}
			return prevState;
		});
	};

	Filter = () => {
		return(
			 <Search placeholder="Buscar pedido..." onSearch={value => {
				 this.setState({
					 searchValue: value
				 });
				 this.setTablesData(value);
			 }} enterButton />
		);
	};

	Body = () => {
		let me = this;
		switch(this.state.display) {
			case "USER_TABLE":
				if(this.state.rolesMap['PAGE_USER_MANAGEMENT']) {
					return (
						 <UserTable canMakeRequest={this.canMakeRequest} setHomeBody={this.setHomeBody}
						            rolesMap={this.state.rolesMap}/>
					);
				} else {
					this.setHomeBody('HOME');
					return null;
				}
			case "ORDER_TABS":
				return (
					 <div>
						 {this.Filter()}
						 <Tabs defaultActiveKey={this.state.activeKey} centered>
							 <TabPane tab="Pagado" key="1">
								 <ReactTable
									  columns={columns.paidOrderColumns}
									  data={this.state.paidOrderData}
									  onClick={me.setOrderProfileDisplay}
								 />
							 </TabPane>
							 <TabPane tab="Preparado" key="2">
								 <ReactTable
									  columns={columns.preparedOrderColumns}
									  data={this.state.preparedOrderData}
									  onClick={me.setOrderProfileDisplay}
								 />
							 </TabPane>
							 <TabPane tab="Despachados" key="3">
								 <ReactTable
									  columns={columns.dispatchedOrderColumns}
									  data={this.state.dispatchedOrderData}
									  onClick={me.setOrderProfileDisplay}
								 />
							 </TabPane>
							 <TabPane tab="Entregados" key="4">
								 <ReactTable
									  columns={columns.deliveredOrderColumns}
									  data={this.state.deliveredOrderData}
									  onClick={me.setOrderProfileDisplay}
								 />
							 </TabPane>
						 </Tabs>
						 <br/>
						 <Row justify="flex-start">
							 <Col>
								 <Button type="dashed" size={'large'} block onClick={()=>this.setHomeBody('HOME')}>
									 Atrás
								 </Button>
							 </Col>
							 <Col>

							 </Col>
						 </Row>
					 </div>
				);
			case "ORDER_PROFILE":
				return <OrderProfile
					 order={this.state.recordDisplayed}
					 orderMovies={this.state.orderMovieData[this.state.recordDisplayed['orderId']]}
					 orderProblems={this.state.orderProblemData[this.state.recordDisplayed['orderId']]}
					 goBack={this.setTabsDisplay}
					 updateStatus={this.getUpdateOrderStatus}
					 nextStatusMessage={this.state.nextStatusMessage}
					 updatePreparedCopies={this.updatePreparedCopies}
					 createProblem={this.createProblem}
				/>;
			default:
				const gridStyle = {
					width: '33%',
					textAlign: 'center',
					height: '100px'
				};
				let cards = [];
				if(this.state.rolesMap['PAGE_USER_MANAGEMENT']){
					cards.push(
						 <Card.Grid key={"PAGE_USER_MANAGEMENT"} className="card" style={gridStyle} onClick={() => this.refreshJWTWithDisplayValidation("USER_TABLE")}>
							 Gestionar Usuarios
						 </Card.Grid>
					);
				}
				if(this.state.rolesMap['PAGE_PRODUCT_MANAGEMENT']){
					cards.push(
						 <Card.Grid key={"PAGE_PRODUCT_MANAGEMENT"} className="card" style={gridStyle} onClick={() => this.refreshJWTWithDisplayValidation("ORDER_TABS")}>
							 Gestionar Pedidos
						 </Card.Grid>
					);
				}
				cards.push(
					 <Card.Grid key={"EXIT"} className="card" style={gridStyle} onClick={this.logout}>
						 Salir
					 </Card.Grid>
				);
				return (
					 <Card>
						 {cards}
					 </Card>
				)

		}
	};

    render() {
        return (
	         <Layout>
		         <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
			         {this.TitanLogo()}
		         </Header>
		         <Content className="site-layout">
			         <div className="site-layout-background">
				         {this.Body()}
			         </div>
		         </Content>
		         <Footer style={{ textAlign: 'center' }}>Nash ©2020</Footer>
	         </Layout>
        );
    }
}

export default AdminLayout;
