import React, {Component, Suspense} from "react";
// A great library for fuzzy filtering/sorting items
import {Table} from 'antd';
import matchSorter from 'match-sorter'


class ReactTable extends Component {
	state = {

	};

	render() {
		console.log('rendering order table: ',this.props.columns, " ", this.props.data);
		return (
			 <Table columns={this.props.columns} dataSource={this.props.data} />
		)
	}
}
export default ReactTable
