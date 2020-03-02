import { SET_NAME_ID_HASHMAP, SET_CLIENT_DATA,SET_BILLNAME_ARRAY, SET_CLIENT_NIT_ARRAY, SET_NIT_CLIENT_HASHMAP,
    INCRESE_CLIENT_SALE_COUNT
} from "../actionTypes";

const initialState = {
    nitIdClientHashMap:{},
    clientHashMap:{},
    clientBillName:[],
    nitClientHashMap:{},
    clientNit:[]
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_NAME_ID_HASHMAP:{
            //console.log("SET_MODULE: The content to be updated: ",action);
            const hashmap = action.payload;
            //console.log("Current MODULE ",modules);
            return {
                ...state,
                nitIdClientHashMap:hashmap
            };
        }
        case SET_CLIENT_DATA:{
            //console.log("SET_MODULE: The content to be updated: ",action);
            const clientHashMap = action.payload;
            //console.log("Current MODULE ",modules);
            return {
                ...state,
                clientHashMap:clientHashMap
            };
        }
        case SET_BILLNAME_ARRAY:{
            //console.log("SET_MODULE: The content to be updated: ",action);
            const clientBillName = action.payload;
            //console.log("Current MODULE ",modules);
            return {
                ...state,
                clientBillName:clientBillName
            };
        }
        case SET_CLIENT_NIT_ARRAY: {
            //console.log("SET_MODULE: The content to be updated: ",action);
            const clientNit = action.payload;
            //console.log("clientNit to save in reducer: ",clientNit);
            return {
                ...state,
                clientNit: clientNit
            };
        }
        case SET_NIT_CLIENT_HASHMAP: {
            //console.log("SET_MODULE: The content to be updated: ",action);
            const nitClientHashMap = action.payload;
            //console.log("clientNit to save in reducer: ",nitClientHashMap);
            return {
                ...state,
                nitClientHashMap: nitClientHashMap
            };
        }
        case INCRESE_CLIENT_SALE_COUNT: {
            const idClient = action.payload;
            console.log("idClient to update saleCount: ",idClient);
            return Object.assign({}, state, {
                clientHashMap:{
                    ...state.clientHashMap,
                    [idClient]:{
                        ...state.clientHashMap[idClient],
                        saleCount:state.clientHashMap[idClient].saleCount+1
                    }
                }
            });
        }
        default:
            return state;
    }
}