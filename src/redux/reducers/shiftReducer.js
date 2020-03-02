import { SET_SHIFT, OPEN_SHIFT, SET_DURATION, INCREASE_SALE_COUNT } from "../actionTypes";

const initialState = {
    open:null,
    close:null,
    cashOpen:0,
    cashClose:0,
    duration:0,
    closed:false,
    saleCount:0
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_SHIFT:{
            //console.log("SET_MODULE: The content to be updated: ",action);
            const shift = action.payload;
            console.log("Setting shift for shiftReducer: ",shift);
            console.log("Setting open for shiftReducer: ",shift.open);
            return Object.assign({}, state, {
                open: shift.open,
                openCash: shift.cashOpen,
                cashClose: shift.cashClose,
                close: shift.close,
                saleCount: shift.saleCount
            });
        }
        case OPEN_SHIFT:{
            console.log("OPEN_SHIFT: The content to be updated: ",action);
            const {open,cashOpen} = action.payload;
            console.log("shift reducer: open:",open," and opencash: ",cashOpen);
            return {
                ...state,
                open : open,
                cashOpen : cashOpen
            };
        }
        case SET_DURATION:{
            //console.log("SET_MODULE: The content to be updated: ",action);
            const { duration } = action.payload;
            //console.log("Current MODULE ",modules);
            return {
                ...state,
                duration : duration
            };
        }
        case INCREASE_SALE_COUNT:{
            return Object.assign({}, state, {
                saleCount:state.saleCount+1
            });
        }
        default:
            return state;
    }
}