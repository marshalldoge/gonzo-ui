import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Modal from 'react-modal';
import "antd/dist/antd.css";
import "./_adminLayout.scss";
import {deleteCookie, getCookie, getJWtProperty, withParams,isTokenValid, tokenTimeLeft, getRoles} from "../../utils";
import {setIdAppUser,setAppUser,setModules,setClientData,setNitIdClientHashMap,
    setClientBillNameArray,setClientNitArray,setNitClientHashMap,setItemQuantityHashMap,
    setItemQuantityCode, setWarehouse, setShift, setCompany, setCurrency, setMeasure} from "../../redux/actions";
import moment from "moment";
import {connect} from "react-redux";
import * as constants from "../../constants";
import LoadingGif from'../../assets/gif/loading.gif';
import { Row,Col,Button,Layout, Menu, Breadcrumb, Typography, Select, message, Card } from 'antd';
import Logo from "../../assets/logos/piratebayLogo.png";
const { Header, Content, Footer } = Layout;
const {Title} = Typography;
const { Option } = Select;


const UserTable = React.lazy(() => import("../../views/UserTable/UserTable"));

class AdminLayout extends Component {
    constructor(props) {
        //console.log("PROPS comming in ADMINLAYOUT: ",props);
        super(props);
	    this.setHomeBody = this.setHomeBody.bind(this);
	    this.refreshJWT = this.refreshJWT.bind(this);
	    this.canMakeRequest = this.canMakeRequest.bind(this);
    }

    state = {
        collapsed: false,
	    display: "HOME",
	    rolesArray: [],
	    rolesMap: {}
    };

	refreshJWT = () => {
		let me = this;
		console.log("Regresing!");
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
			console.log("Success Refreshing");
			localStorage.setItem('authJWT', res.authentication);
			localStorage.setItem('refreshJWT', res.refresh);
			me.setRoles();
		}).catch(error => {
			console.log("Hubo el error: ",error);
		});
	};

	refreshJWTWithDisplayValidation = (display) => {
		let me = this;
		console.log("Regresing!");
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
		console.log("Evaluating JWT state!");
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
		console.log("RolesWithDisplay: ",rolesMap);
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
		console.log("RolesMap: ",rolesMap);
	}

    componentDidMount = () => {
	    this.refreshJWT();
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

	Body = () => {
		switch(this.state.display) {
			case "USER_TABLE":
				console.log("Rendering user_table");
				if(this.state.rolesMap['PAGE_USER_MANAGEMENT']) {
					return (
						 <UserTable canMakeRequest={this.canMakeRequest} setHomeBody={this.setHomeBody}
						            rolesMap={this.state.rolesMap}/>
					);
				} else {
					this.setHomeBody('HOME');
					return null;
				}
			default:
				const gridStyle = {
					width: '33%',
					textAlign: 'center',
					height: '100px'
				};
				let cards = [];
				//console.log("Roles available: ",roles," ? ");
				if(this.state.rolesMap['PAGE_USER_MANAGEMENT']){
					cards.push(
						 <Card.Grid key={"PAGE_USER_MANAGEMENT"} className="card" style={gridStyle} onClick={() => this.refreshJWTWithDisplayValidation("USER_TABLE")}>
							 Gestionar Usuarios
						 </Card.Grid>
					);
				}
				if(this.state.rolesMap['PAGE_PRODUCT_MANAGEMENT']){
					cards.push(
						 <Card.Grid key={"PAGE_PRODUCT_MANAGEMENT"} className="card" style={gridStyle}>
							 Gestionar Productos
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
        //console.log("LOADING: ",this.state.loadedServices);
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

export default withRouter(connect(null,{setIdAppUser,setAppUser,setModules,setClientData,
    setNitIdClientHashMap,setClientBillNameArray,setClientNitArray,setNitClientHashMap,
    setItemQuantityHashMap,setItemQuantityCode, setWarehouse, setShift, setCompany, setCurrency, setMeasure})(AdminLayout));
