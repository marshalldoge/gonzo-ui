import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {Form, Alert, Row, Col} from "antd";
import {setCookie, getJWtProperty} from "../../utils.js";

import "antd/dist/antd.css";
import "../../stylesheets/layout/_loginForm.scss";
import { connect } from "react-redux";
import { setIdAppUser } from "../../redux/actions";
import * as constants from "../../constants";

const TButton = React.lazy(() => import("../../components/TButton/TButton"));

class LoginForm extends Component {

    state = {
        displayAlert:0,
        username: "",
        password: ""
    };

    handleChange = event => {
        this.setState({[event.target.name]: event.target.value});
    };

    handleSubmit = () => {
        let me = this;
        //console.log("Received values of form: ", values);
        var user = this.state.username;
        var password = this.state.password;
        // Default options are marked with *
	    if(user.trim() === "" || password.trim() === ""){
	    	this.setState({displayAlert: 2})
		    return;
	    }
        var data = JSON.stringify({
            username: user,
            password: password
        });
        var url = constants.BACKEND_URL+"/api/v1/security/login";
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
                console.log("Success");
	            localStorage.setItem('authJWT', res.authentication);
	            localStorage.setItem('refreshJWT', res.refresh);
	            const {from} = me.props.location.state || {from: {pathname: "/dashboard"}};
	            me.props.history.push(from);
        }).catch(error => {
        	console.log("Hubo el error: ",error);
	        me.setState({displayAlert:1});
        });
    };

    UsernameInput = () => {
        return (
             <input
                  name={"username"}
                  className={"usernameInput"}
                  type={"text"}
                  value={this.state.username}
                  placeholder={"Usuario"}
                  onChange={this.handleChange}
             />
        );
    };
    PasswordInput = () => {
        return (
             <input
                  name={"password"}
                  className={"usernameInput"}
                  type={"password"}
                  value={this.state.password}
                  placeholder={"Contraseña"}
                  onChange={this.handleChange}
             />
        );
    };

    LoginButton = () => {
        return (
          <TButton
               label={"Ingresar"}
               size={"medium"}
               onClick={this.handleSubmit}
               type={"inverse"}
          />
        );
    }

    signOut(e) {
        e.preventDefault();
        this.props.history.push("/");
    }

    Alert = () => {
        if(this.state.displayAlert === 0)return null;
        let message;
        if(this.state.displayAlert === 1)message = "Usuario o Contraseña inválidos.";
	    if(this.state.displayAlert === 2)message = "Ha dejado vacío algunos de los campos.";
        if(this.state.displayAlert === 3)message = "Hubo un problema de conexion. Verifique que esta conectado a internet.";
        return(
            <Form.Item>
                <Alert style={{

                }}
                       message={message}
                       type="error"
                />
            </Form.Item>
        );
    };

    render() {
        return (
            <Row type={"flex"} className={"loginFormCtn"} justify={"center"} align={"middle"}>
                <Col span={10}>
                    <Row type={"flex"} justify={"center"}>
                        {this.UsernameInput()}
                    </Row>
                    <br/>
                    <br/>
                    <Row type={"flex"} justify={"center"}>
                        {this.PasswordInput()}
                    </Row>
                    <br/>
                    <br/>
                    <Row type={"flex"} justify={"center"}>
                        {this.LoginButton()}
                    </Row>
	                <br/>
	                {this.Alert()}
                </Col>
            </Row>
        );
    }
}
export default withRouter(connect(null,{setIdAppUser})(LoginForm))
