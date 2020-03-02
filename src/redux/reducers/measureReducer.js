import { SET_MEASURE } from "../actionTypes";

const initialState = {
	measureHashMap:{},
	nameIdMeasureHashMap:{},
	nameMeasure:[]
};

export default function(state = initialState, action) {
	switch (action.type) {
		case SET_MEASURE:{
			//console.log("SET_MODULE: The content to be updated: ",action);
			const measureHashMap = action.payload;
			let nameMeasure = [];
			let nameIdMeasureHashMap = {};
			for(let measure in measureHashMap){
				if(measureHashMap.hasOwnProperty(measure)) {
					nameMeasure.push(measureHashMap[measure]["name"]);
					nameIdMeasureHashMap[measureHashMap[measure]["name"]]=measure;
				}
			}
			console.log("Current nameIdMeasureHashMap ",nameIdMeasureHashMap);
			return {
				...state,
				measureHashMap : measureHashMap,
				nameMeasure : nameMeasure,
				nameIdMeasureHashMap : nameIdMeasureHashMap
			};
		}
		default:
			return state;
	}
}
