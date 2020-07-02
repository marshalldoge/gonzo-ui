import React, {Component, Suspense} from "react";
// A great library for fuzzy filtering/sorting items
import {Table} from 'antd';
import matchSorter from 'match-sorter'


class ReactTable extends Component {
	// eslint-disable-next-line no-useless-constructor
	constructor(props) {
		super(props);
	}

	state = {

	};

	render() {
		let me = this;
		return (
			 <Table
				  columns={this.props.columns}
				  dataSource={this.props.data}
				  onRow={(record, rowIndex) => {
					  return {
						  onClick: event => me.props.onClick(record)// click row
					  };
				  }}
			 />
		)
	}
}
export default ReactTable
