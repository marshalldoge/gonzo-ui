import React, {Component, Suspense} from "react";
import {Row,Col, Card, Typography, Button,Input, Alert, Collapse, Steps, List, Descriptions} from 'antd';
import { UserOutlined, SolutionOutlined, LoadingOutlined, SmileOutlined } from '@ant-design/icons';
import './_OrderProfile.scss'
import moment from "../../pages/AdminLayout/AdminLayout";
// A great library for fuzzy filtering/sorting items
const { Meta } = Card;
const { Title , Text} = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;
const { Step } = Steps;

class OrderProfile extends Component {
	state = {
		preparedInput: [],
		preparedMovieId: [],
		disableConfirmPrepareButton: true,
		problemDescription: "",
		problemTitle: "",
		originalOrderCost: 0,
		realOrderCost: 0,
		hasMissingCopies: false
	};


	componentDidMount() {
		this.setInputData();
	}


	onChange = ({ target: { value } }) => {
		this.setState({ problemDescription: value });
	};

	onChangeTitle = ({ target: { value } }) => {
		this.setState({ problemTitle: value });
	};

	handleChange(idx,event) {
		let value = event.target.value;
		this.setState ((prevState) =>{
			prevState.preparedInput[idx] = value;
			let disabled = false;
			for(let i = 0; i < prevState.preparedInput.length; i++){
				if(isNaN(parseInt(prevState.preparedInput[i]))){
					disabled = true || disabled;
				}else{
					if(parseInt(this.state.preparedInput[i]) > this.props.orderMovies[i]['quantity']){
						disabled = true || disabled;
					}
					if(this.state.preparedInput[i] === ""){
						disabled = true || disabled;
					}
				}
			}
			prevState.disableConfirmPrepareButton = disabled;
			return prevState;
		});
	}

	preparedCopies = (i) => {
		if(this.props.order['orderStatus'] !== 1){
			return(
				 <Meta title={"Copias preparadas"} description={this.props.orderMovies[i]['preparedQuantity']} />
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

	OrderDescription = () => {
		let costNumber = <p>{''}</p>;
		if(this.state.hasMissingCopies){
			costNumber = <Text type={'warning'} delete>{this.state.originalOrderCost+"Bs."}</Text>;
		}
		let defaultGoodCost = this.state.realOrderCost;
		if(defaultGoodCost === 0){
			defaultGoodCost = this.state.originalOrderCost;
		}

		return (
			 <Row className={"descriptionRow"}>
				 <Col>
					 <Descriptions title="Detalles" size={'default'}>
						 <Descriptions.Item key={1} label="Cliente">{this.props.order['firstName']}</Descriptions.Item>
						 <Descriptions.Item key={2} label="Costo">
							 {costNumber}   {defaultGoodCost+" Bs."}
						 </Descriptions.Item>
					 </Descriptions>

				 </Col>
			 </Row>
		)
	};


	CustomCard = (i) => {
		return (
			 <Row justify={"start"} key={i}>
				 <Col className={"movieCardImageCtn"} span={10}>
					 <img className={"movieCardImage"} alt="Image movie" src={this.props.orderMovies[i]['image']} />
				 </Col>
				 <Col span={10} offset={2}>
					<Row>
						{"Blue-Ray "+this.props.orderMovies[i]['name']}
					</Row>
					 <Row>
						 {"Copias Pedidas: "+this.props.orderMovies[i]['quantity']}
					 </Row>
					 <br/>
					 {this.preparedCopies(i)}
				 </Col>
			 </Row>
		)
	};

	MovieCards = () => {
		let cards = [];
		for(let i = 0; i < this.props.orderMovies.length;i++) {
			cards.push(
				 this.CustomCard(i)
			);
			cards.push(<br key={i.toString()+".1"}/>);
			cards.push(<br key={i.toString()+".2"}/>);
		}
		return cards;
	};

	setInputData() {
		let me = this;
		this.setState ((prevState) =>{
			let inputs = [];
			let costSum = 0;
			let costSum2 = 0;
			for(let i = 0; i < this.props.orderMovies.length; i++) {
				inputs.push("");
				costSum += (this.props.orderMovies[i]['cost']*this.props.orderMovies[i]['quantity']);
				costSum2 += (this.props.orderMovies[i]['cost']*this.props.orderMovies[i]['preparedQuantity']);
			}
			console.log("Two costs: ",costSum, " - ",costSum2);
			prevState.originalOrderCost = costSum;
			prevState.realOrderCost = costSum2;
			if(costSum !== costSum2 && costSum2 !== 0) {
				prevState.hasMissingCopies = true;
			}
			prevState.preparedInput = inputs;
			return prevState;
		});
	}

	OrderStatus = () => {
		let loadingIcon = <LoadingOutlined />;
		let currentOrderStatus = this.props.order['orderStatus']-1;
		return (
			 <Steps direction="vertical" size="small" current={this.props.order['orderStatus']-1}>
				 <Step
					  title="Pagado"
					  description={this.props.order['paidOrderDate']}
				 />
				 <Step
					  title="Preparado"
					  description={this.props.order['preparedOrderDate']}
					  icon={currentOrderStatus === 0 ? loadingIcon : null}
				 />
				 <Step
					  title="Despachado"
					  description={this.props.order['dispatchedOrderDate']}
					  icon={currentOrderStatus === 1? loadingIcon : null}
				 />
				 <Step
					  title="Entregado"
					  description={this.props.order['deliveredOrderDate']}
					  icon={currentOrderStatus === 2 ? loadingIcon : null}
				 />
			 </Steps>
		);
	};

	OrderProblems = () => {
		return (
			 <List
				  itemLayout="horizontal"
				  dataSource={this.props.orderProblems}
				  renderItem={item => (
					   <List.Item>
						   <List.Item.Meta
								title={item.title+ ' - ' +item['date']}
								description={item.problemDescription}
						   />
					   </List.Item>
				  )}
			 />
		);
	};

	NewProblemForm = () => {
		return (
			 <Row>
				 <TextArea
					  placeholder="Título"
					  value={this.state.problemTitle}
					  onChange={this.onChangeTitle}
				 />
				 <br/>
				 <TextArea
					  value={this.state.problemDescription}
					  onChange={this.onChange}
					  placeholder="Descripción"
				 />
				 <Button
					  type={'danger'}
					  block
					  disabled={this.state.problemTitle.length === 0 || this.state.problemDescription.length === 0}
					  onClick={() => {
					  	this.props.createProblem(
					  		 this.state.problemTitle,
						     this.state.problemDescription,
						     this.props.order['orderStatus'],
						     this.props.order['orderId']
					    );
					  	this.setState({
						    problemTitle: "",
						    problemDescription: ""
					  	})
					  }}
				 >Reportar Problema</Button>
			 </Row>
		)
	};

	nextStatusButton = () => {
		if(this.props.nextStatusMessage === "") return null;
		let finalDisabled = false;
		if(this.props.order['orderStatus'] === 1){
			finalDisabled = this.state.disableConfirmPrepareButton;
		}
		return (
			 <Button
				  type="primary"
				  size={'large'}
				  block
				  disabled={finalDisabled}
				  onClick={
					  () => {
						  if(this.props.order['orderStatus'] === 1) {
						  	    let preparedCopies = [];
							  for(let i = 0; i < this.props.orderMovies.length;i++) {
								  preparedCopies.push(
								  	 {
									     movieId: this.props.orderMovies[i]['movieId'],
									     preparedQuantity: this.state.preparedInput[i]
								     }
								     );
							  }
							  this.props.updatePreparedCopies(this.props.order['orderId'],preparedCopies);
						  }
					  	this.props.updateStatus(this.props.order['orderId'], this.props.order['orderStatus'] + 1)
					  }
				  }
			 >
				 {this.props.nextStatusMessage}
			 </Button>
		);
	};

	render() {
		let orderStatusMap = "";
		switch (this.props.order['orderStatus']) {
			case 1:
				orderStatusMap = "Pedido Pagado";
				break;
			case 2:
				orderStatusMap = "Pedido Preparado";
				break;
			case 3:
				orderStatusMap = "Pedido Despachado";
				break;
			case 4:
				orderStatusMap = "Pedido Entregado";
				break;
		}
		return (
			 <div>
				 <Row className={"pedidoCtn"} justify="flex-start">
					 <Col span={6}>
						 <Title level={2}>{"Pedido "+this.props.order['orderId']}</Title>
					 </Col>
				 </Row>
				 {this.OrderDescription()}
				 <Row className={"orderProfileCtn"}>
					 <Col span={24}>
						 <Row className={"moviesCtn"} justify="start">
							 <Col span={12}>
								 <Title level={3}>Películas</Title>
								 <Row className={"movieCardsRowCtn"} justify="start">
									 <Col className={"movieCardsCtn"} span={22}>
										 {this.MovieCards()}
									 </Col>
								 </Row>
							 </Col>
							 <Col span={12}>
								 <Title level={3}>Estado</Title>
								 {this.OrderStatus()}
								 <Title level={3}>Problemas</Title>
								 {this.OrderProblems()}
								 <Title level={4}>Agregar Problema</Title>
								 {this.NewProblemForm()}
							 </Col>
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
			 </div>
		)
	}
}
export default OrderProfile
