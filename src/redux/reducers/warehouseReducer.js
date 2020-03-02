import { SET_WAREHOUSE } from "../actionTypes";

const initialState = {
    warehouseHashMap:{},
    nameIdWarehouseHashMap:{},
    nameWarehouse:[]
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_WAREHOUSE:{
            //console.log("SET_MODULE: The content to be updated: ",action);
            const warehouseHashMap = action.payload;
            let nameWarehouse = [];
            let nameIdWarehouseHashMap = {};
            for(let warehouse in warehouseHashMap){
                if(warehouseHashMap.hasOwnProperty(warehouse)) {
                    nameWarehouse.push(warehouseHashMap[warehouse]["name"]);
                    nameIdWarehouseHashMap[warehouseHashMap[warehouse]["name"]]=warehouse;
                }
            }
            console.log("Current nameIdWarehouseHashMap ",nameIdWarehouseHashMap);
            return {
                ...state,
                warehouseHashMap : warehouseHashMap,
                nameWarehouse : nameWarehouse,
                nameIdWarehouseHashMap : nameIdWarehouseHashMap
            };
        }
        default:
            return state;
    }
}