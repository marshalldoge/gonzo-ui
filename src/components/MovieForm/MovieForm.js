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


	};

	similarity = (s1, s2) => {
		var longer = s1;
		var shorter = s2;
		if (s1.length < s2.length) {
			longer = s2;
			shorter = s1;
		}
		var longerLength = longer.length;
		if (longerLength == 0) {
			return 1.0;
		}
		return (longerLength - this.editDistance(longer, shorter)) / parseFloat(longerLength);
	};

	editDistance = (s1, s2) => {
		s1 = s1.toLowerCase();
		s2 = s2.toLowerCase();

		var costs = new Array();
		for (var i = 0; i <= s1.length; i++) {
			var lastValue = i;
			for (var j = 0; j <= s2.length; j++) {
				if (i === 0)
					costs[j] = j;
				else {
					if (j > 0) {
						var newValue = costs[j - 1];
						if (s1.charAt(i - 1) != s2.charAt(j - 1))
							newValue = Math.min(Math.min(newValue, lastValue),
								 costs[j]) + 1;
						costs[j - 1] = lastValue;
						lastValue = newValue;
					}
				}
			}
			if (i > 0)
				costs[s2.length] = lastValue;
		}
		return costs[s2.length];
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

	rowStyle = (avalaible) => {
		return {
			backgroundColor: avalaible ? "white" : "#e50914"
		}
	};

	movieCtn = (idx, avalaible) => {
		return (
			 <Row key = {idx} justify="center" align="middle" style={this.rowStyle(avalaible)}>
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

	optionalHeader = () => {
		return (
			 <Col span={7}>
				 {""}
			 </Col>
		);
	};

	formTable = () => {
		let moviesRows = [];
		moviesRows.push(
			 <Row key = {9999999} justify="center" align="middle">
				 <Col span={10}>
					 {"Nombre(Duración)"}
				 </Col>
				 {this.props.complete && this.optionalHeader()}
				 <Col span={4}>
					 {"Agregados"}
				 </Col>

			 </Row>
		);

		for(let i = 0; i < this.props.movies.length; i++) {
			if(this.similarity(this.props.filter.toUpperCase(),this.props.movies[i].name.toUpperCase()) >= 0.2|| this.props.filter === "") {
				console.log("Filter: ",this.props.filter," vs ",this.props.movies[i].name, " wiht sim: ",this.similarity(this.props.filter,this.props.movies[i].name));
				if(this.props.movies[i].quantity > 0){
					moviesRows.push(this.movieCtn(i,true));
				}else{
					moviesRows.push(this.movieCtn(i,false));
				}
			}
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
