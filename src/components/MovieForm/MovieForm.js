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
	}

	styles = {
		height: this.props.complete ? "320px" : "200px"
	
		 
	}

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
				 {this.props.movies[idx].duration}
			 </Col>
		);
	};
	Buttons = (idx) => {
		return (
			 <Col span={4}>
				 <Button
					  type="primary" className="button4" shape="circle" icon={<PlusCircleOutlined />}
					  onClick={e => (this.props.updateUsed(e,idx,1))}
				 />
				 <Button
					  type="primary" className="button4" shape="circle" icon={<MinusCircleOutlined />}
					  onClick={e => (this.props.updateUsed(e,idx,-1))}
				 />
			 </Col>
		);
	};

	movieCtn = (idx) => {
		return (
			 <Row key = {idx} justify="center" align="middle">
				 <Col span={10}>
					 {this.props.movies[idx].name}
				 </Col>
				 {this.props.complete && this.Duration(idx)}
				 {this.props.complete && this.Buttons(idx)}
				 <Col span={2}>
					 {this.props.movies[idx].used}
				 </Col>

			 </Row>
		);
	};

	formTable = () => {
		let moviesRows = [];
		for(let i = 0; i < this.props.movies.length; i++) {
			moviesRows.push(this.movieCtn(i));
		}
		return moviesRows;
	};

	render() {
		return (

			 <Row className={"FormCtn"} style={this._Movie}>
				 <Col span={24}>
					 {this.formTable()}
				 </Col>
			 </Row>
		);
	}
}

export default (MovieForm);
