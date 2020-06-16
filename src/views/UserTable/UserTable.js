import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Row, Col, Button, Table } from "antd";
import "./_UserTable.scss";
import Logo from'../../assets/logos/piratebayLogo.png';
import * as constants from "../../constants";


class UserTable extends Component {

	constructor(props) {
		//console.log("PROPS comming in ADMINLAYOUT: ",props);
		super(props);
		this.getUserData = this.getUserData.bind(this);
	}

	state = {
		dataSource: [],
		columns: [
			{
				title: 'ID',
				dataIndex: 'userId',
				key: 'userId',
			},
			{
				title: 'Username',
				dataIndex: 'username',
				key: 'username',
			},
			{
				title: 'Email',
				dataIndex: 'email',
				key: 'email',
			},
			{
				title: 'Phone Number',
				dataIndex: 'phoneNumber',
				key: 'phoneNumber',
			}
		]
	};

	getUserData = () => {
		let me = this;
		console.log("Si hay JWT validos");
		let url = constants.BACKEND_URL + "/api/v1/user";
		fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"Authorization": "bearer " + localStorage.getItem("authJWT")
			}
		}).then(response => {
			const status = response['status'];
			//console.log("Response: ",response, " status: ",status," - ",typeof status);
			if (status === 200) {
				return response.json();
			} else {
				throw new Error('Something went wrong');
			}
		}).then(res => {
			console.log("Success");
			console.log("User data: ", res);
			me.setState({
				dataSource: res.map((x, idx) => {
						 return {
							 ...x,
							 key: idx
						 }

					 }
				)
			})
		}).catch(error => {
			console.log("Hubo el error: ", error);
		});
	};

	componentDidMount() {
		this.getUserData();
	}

	render() {
		return (
			 <Row type="flex" className={"loginCtn"} justify={"center"} align={"middle"}>
				 <Col span={24} style={{height:"500px"}}>
					 <Row type={"flex"} justify={"center"} align={"middle"}>
						 <Col span={24} style={{textAlign:"center"}}>
							 <Table dataSource={this.state.dataSource} columns={this.state.columns}/>
						 </Col>
					 </Row>
					 <br/>
					 <Row justify="space-between">
						 <Button onClick={() => this.props.setHomeBody('HOME')}>Atrás</Button>
						 <Button onClick={() => this.props.canMakeRequest(this.getUserData)}>Actualizar datos</Button>
					 </Row>
				 </Col>
			 </Row>
		);
	}
}

export default UserTable;
