import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {Row, Col, Button, Table, Card} from "antd";
import {EditOutlined, DeleteOutlined} from '@ant-design/icons';
import "./_OrderTable.scss";
import Logo from'../../assets/logos/piratebayLogo.png';
import * as constants from "../../constants";

const { Column, ColumnGroup } = Table;


class UserTable extends Component {

	constructor(props) {
		//console.log("PROPS comming in ADMINLAYOUT: ",props);
		super(props);
		if(!props.rolesMap['PAGE_USER_MANAGEMENT']){
			props.setHomeBody('HOME');
		}
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

	actionsColumn = () => {

		let buttons = [];
		buttons.push(
			 <Button key={"BUTTON_EDIT_USER"} type="dashed" icon={<EditOutlined />} size={'small'} />
		);
		if(this.props.rolesMap['BUTTON_DELETE_USER']){
			buttons.push(
				 <Button key={"BUTTON_DELETE_USER"}  type="danger" icon={<DeleteOutlined />} size={'small'} />
			);
		}
		return (
			 <Column
				  title="Actions"
				  dataIndex="actions"
				  key="actions"
				  align={"center"}
				  render={() => <Row justify="space-around">{buttons}</Row>}
			 />
		);

	};

	render() {
		return (
			 <Row type="flex" className={"loginCtn"} justify={"center"} align={"middle"}>
				 <Col span={24} style={{height: "500px"}}>
					 <Row type={"flex"} justify={"center"} align={"middle"}>
						 <Col span={24} style={{textAlign: "center"}}>
							 <Table dataSource={this.state.dataSource}>
								 <Column title="ID" dataIndex="userId" key="userId"/>
								 <Column title="Username" dataIndex="username" key="username"/>
								 <Column title="Email" dataIndex="email" key="email"/>
								 {this.actionsColumn()}
							 </Table>,
						 </Col>
					 </Row>
					 <br/>
					 <Row justify="space-between">
						 <Button onClick={() => this.props.setHomeBody('HOME')}>Atrás</Button>
						 <Button onClick={() => this.props.canMakeRequest(this.getUserData)}>Actualizar
							 datos</Button>
					 </Row>
				 </Col>
			 </Row>
		);
	}
}

export default UserTable;
