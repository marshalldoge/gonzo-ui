import {INCREASE_COMPANY_SALE_COUNT, SET_COMPANY} from "../actionTypes";

const initialState = {
    idCompany:null,
    clientCount:null,
    saleCount: null,
    purchaseCount: null,
    supplierCount: null
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_COMPANY:{
            //console.log("SET_MODULE: The content to be updated: ",action);
            const company = action.payload;
            //console.log("Current MODULE ",modules);
            console.log("Receiving company in reducer: ",company);
            return {
                ...state,
                idCompany:company.id,
                clientCount:company.clientCount,
                saleCount:company.saleCount,
                purchaseCount:company.purchaseCount,
                supplierCount:company.supplierCount
            };
        }
        case INCREASE_COMPANY_SALE_COUNT:{
            return Object.assign({}, state, {
                saleCount:state.saleCount+1
            });
        }
        default:
            return state;
    }
}
