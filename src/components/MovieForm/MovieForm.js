import React, {Component, Suspense} from "react";
import {withRouter, Switch, Redirect, Route} from "react-router-dom";
import {Layout, Row, Col, Button} from "antd";
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import "antd/dist/antd.css";
import "./_MovieForm.scss";
import * as constants from "../../constants";

const {Content, Footer} = Layout;

class MovieForm extends Component {
	constructor(props) {
		super(props);
	}

	state = {
		movies:{}
	};

	componentDidMount() {
		this.getMovies();
	}

	styles = {
		height: this.props.complete ? "320px" : "200px"
	}

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

	loading = () => {
		return <div>The component is loading</div>
	};

	updateUsed = (e,idx,number) => {
		this.setState ((prevState) =>{
			console.log("prevstate: ",prevState.movies);
			if(number > 0){
				//prevState.movies[idx].used = Math.min(prevState.movies[idx].used + number,prevState.movies[idx].quantity);
				prevState.movies[idx].used = Math.min(prevState.movies[idx].used + number,10);
			}else{
				prevState.movies[idx].used = Math.max(prevState.movies[idx].used + number,0);
			}
			return prevState;
		});
	};

	Duration = (idx) => {
		return (
			 <Col span={3}>
				 {this.state.movies[idx].duration}
			 </Col>
		);
	};
	Buttons = (idx) => {
		return (
			 <Col span={4}>
				 <Button
					  type="primary" shape="circle" icon={<PlusCircleOutlined />}
					  onClick={e => (this.updateUsed(e,idx,1))}
				 />
				 <Button
					  type="primary" shape="circle" icon={<MinusCircleOutlined />}
					  onClick={e => (this.updateUsed(e,idx,-1))}
				 />
			 </Col>
		);
	};

	movieCtn = (idx) => {
		return (
			 <Row key = {idx} justify="center" align="middle">
				 <Col span={10}>
					 {this.state.movies[idx].name}
				 </Col>
				 {this.props.complete && this.Duration(idx)}
				 {this.props.complete && this.Buttons(idx)}
				 <Col span={2}>
					 {this.state.movies[idx].used}
				 </Col>

			 </Row>
		);
	};

	formTable = () => {
		let moviesRows = [];
		for(let i = 0; i < this.state.movies.length; i++) {
			moviesRows.push(this.movieCtn(i));
		}
		return moviesRows;
	};

	render() {
		return (
			 <Row className={"FormCtn"} style={this.styles}>
				 <Col span={24}>
					 {this.formTable()}
				 </Col>
			 </Row>
		);
	}
}

export default (MovieForm);
