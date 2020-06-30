import React, {Component, Suspense} from "react";
import {Row,Col, Card, Typography, Button,Input, Alert} from 'antd';
import './_OrderProfile.scss'
// A great library for fuzzy filtering/sorting items
const { Meta } = Card;
const { Title } = Typography;

class OrderProfile extends Component {
	state = {
		preparedInput: []
	};

	handleChange(idx,event) {
		let value = event.target.value;
		this.setState ((prevState) =>{
			prevState.preparedInput[idx] = value;
			return prevState;
		});
	}

	preparedCopies = (i) => {
		console.log("Prepared copies: ",this.props.orderMovies[i]['preparedQuantity']);
		if(this.props.order['orderStatus'] !== 1){
			return(
				 <Meta title={"Copias preparadas"} description={"Copias Pedidas: "+this.props.orderMovies[i]['preparedQuantity']} />
			);
		}
		let showAlert = false;
		let alertMessage = "Número de copias incorrecto";
		if(this.state.preparedInput[i]){
			if(!isNaN(parseInt(this.state.preparedInput[i])+1)){
				if(parseInt(this.state.preparedInput[i]) > this.props.orderMovies[i]['quantity']){
					showAlert = true;
				}
			}else{
				showAlert = true;
				alertMessage = "No ingresó un número";
			}
		}
		return (
			 <div>
				 <Input placeholder={"Copias preparadas "} value={this.state.preparedInput[i] || ''} onChange={(e)=>this.handleChange(i,e)}/>
				 {showAlert ? <Alert message={alertMessage} type="error" /> : null}
			 </div>
		);
	};

	MovieCards = () => {
		let cards = [];
		for(let i = 0; i < this.props.orderMovies.length;i++) {
			cards.push(
				 <Card
					  hoverable
					  style={{ width: 170 }}
					  cover={<img className={"movieCardImage"} alt="Image movie" src={this.props.orderMovies[i]['image']} />}
					  key={i}
				 >
					 <Meta title={this.props.orderMovies[i]['name']} description={"Copias Pedidas: "+this.props.orderMovies[i]['quantity']} />
					 <br/>
					 {this.preparedCopies(i)}
				 </Card>
			);
		}
		return cards;
	};

	setInputData() {
		let me = this;
		this.setState ((prevState) =>{
			let inputs = [];
			for(let i = 0; i < this.props.orderMovies.length; i++) {
				inputs.push("");
			}
			prevState.preparedInput = inputs;
			return prevState;
		});
	}

	componentDidMount() {
		this.setInputData();
	}

	nextStatusButton = () => {
		if(this.props.nextStatusMessage === "") return null;
		return (
			 <Button
				  type="primary"
				  size={'large'}
				  block
				  onClick={
					  () =>
						   this.props.updateStatus(this.props.order['orderId'],this.props.order['orderStatus']+1)
				  }
			 >
				 {this.props.nextStatusMessage}
			 </Button>
		);
	};

	render() {
		return (
			 <Row className={"orderProfileCtn"}>
				 <Col span={24}>
					 <Row className={"pedidoCtn"} justify="center">
						 <Col span={6}>
							 <Title level={2}>Pedido #{this.props.order['orderId']}</Title>
						 </Col>
					 </Row>
					 <Row className={"peliculasCtn"} >
						 <Col span={6}>
							 <Title level={3}>Películas</Title>
						 </Col>
					 </Row>
					 <Row justify="space-around">
						 {this.MovieCards()}
					 </Row>
					 <br/>
					 <br/>
					 <Row justify="space-around">
						 <Col>
							 <Button type="dashed" size={'large'} block onClick={this.props.goBack}>
								 Atrás
							 </Button>
						 </Col>
						 <Col>
							 {this.nextStatusButton()}
						 </Col>
					 </Row>

				 </Col>

			 </Row>
		)
	}
}
export default OrderProfile
