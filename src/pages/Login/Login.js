import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Row, Col } from "antd";
import "./_Login.scss";
import Logo from'../../assets/logos/logo.png';

const LoginForm = React.lazy(() => import("./LoginForm"));

class Login extends Component {

  TitanLogo = () => {
    return (
         <img alt="" className={"loginLogo"} src={Logo}/>
    );
  };

  render() {
  	return (
  		 <Row type="flex" className={"loginCtn"} justify={"center"} align={"middle"}>
		     <Col span={24} style={{height:"500px"}}>
			     <Row type={"flex"} justify={"center"} align={"middle"}>
				     <Col span={10} style={{textAlign:"center"}}>
					      {this.TitanLogo()}
				     </Col>
			     </Row>
			     <br/>
			     <Row>
				     <Col span={24}>
				     <LoginForm/>
				     </Col>
			     </Row>
		     </Col>
    	 </Row>
    );
  }
}

export default withRouter(Login);
