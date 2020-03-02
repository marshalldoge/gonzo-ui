import React, {Component, Suspense} from "react";
import {withRouter, Switch, Redirect, Route} from "react-router-dom";
import {Layout, Row, Form} from "antd";
import "antd/dist/antd.css";
import "../../stylesheets/layout/_adminLayout.scss";
import "./_Body.scss"

const {Content, Footer} = Layout;

class Body extends Component {
	constructor(props) {
		super(props);
		this.mapRoutes = this.mapRoutes.bind(this);
	}

	loading = () => {
		return <div>The component is loading</div>
	};

	render() {
		return (
			 <div>THIS IS THE BODY</div>
		);
	}
}

export default withRouter(Form.create()(Body));
