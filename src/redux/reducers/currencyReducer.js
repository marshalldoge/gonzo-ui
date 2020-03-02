import {SET_CURRENCY} from "../actionTypes";

const initialState = {
	currencyHashMap: {}
};

export default function(state = initialState, action) {
	switch (action.type) {
		case SET_CURRENCY:{
			//console.log("SET_MODULE: The content to be updated: ",action);
			//console.log("Current MODULE ",modules);
			console.log("CURRENCY REDUCER hashmap: ",action.payload);
			return {
				...state,
				currencyHashMap: action.payload
			};
		}
		default:
			return state;
	}
}
