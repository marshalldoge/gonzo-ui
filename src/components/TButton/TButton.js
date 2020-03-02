import React, { Component } from "react";
import "../../redux/reducers/appUserReducer";
import "./_TButton.scss";


class TButton extends Component {

	render() {
		return (
			<div className={"buttonCtn "+(this.props.size?this.props.size:"small") + " "+(this.props.type?this.props.type:"")} onClick={this.props.onClick}>
				<span className={"label "+(this.props.size?this.props.size:"small") + " "+(this.props.type?this.props.type:"")}>{this.props.label}</span>
			</div>
		);
	}
}

export default TButton;
