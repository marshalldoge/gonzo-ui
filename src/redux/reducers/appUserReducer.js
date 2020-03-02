import {SET_ID_APPUSER, SET_APPUSER, SET_ID_SHIFT, SET_ID_WAREHOUSE, CLOSE_SHIFT} from "../actionTypes";

const initialState = {
    idAppUser:undefined,
    firstName:undefined,
    username:undefined,
    role:undefined,
    email:undefined,
    cellphone: undefined,
    idShift:undefined,
    idCompany:undefined,
    inShift:false,
    idWarehouse:1,
    clientCount:0,
    saleCount:null
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_ID_APPUSER: {
            //console.log("The content to be updated: ",action);
            const { idAppUser} = action.payload;
            //console.log("Current appUser ",idAppUser);
            return {
                ...state,
                idAppUser: idAppUser
            };
        }
        case SET_APPUSER:{
            //console.log("SET_APPUSER: The content to be updated: ",action);
            const {AppUser} = action.payload;
            //console.log("Current appUser ",AppUser);
            return {
                ...state,
                idAppUser: AppUser.id,
                firstName:AppUser.firstName,
                username:AppUser.username,
                role:AppUser.role,
                email:AppUser.email,
                cellphone: AppUser.cellphone,
                idShift:AppUser.idShift,
                idCompany:AppUser.idCompany,
                inShift:AppUser.inShift,
                shiftCount:AppUser.shiftCount,
                saleCount:AppUser.saleCount
            };
        }
        case SET_ID_SHIFT:{
            console.log("SET_ID_SHIFT: action.payload: ",action.payload);
            const { id } = action.payload.Shift;
            console.log("SET_ID_SHIFT: Placing Id of shift: ",id);
            return Object.assign({}, state, {
                idShift: id,
                inShift:true
            });
        }
        case SET_ID_WAREHOUSE:{
            console.log("SET_ID_WAREHOUSE: action.payload: ",action.payload);
            const { idWarehouse } = action.payload;
            console.log("SET_ID_WAREHOUSE: Placing Id of Warehouse: ",idWarehouse);
            return {
                ...state,
                idWarehouse: idWarehouse
            }
        }
        case CLOSE_SHIFT:{
            console.log("AppUserReducer: Updating inShift to ",false);
            return Object.assign({}, state, {
                inShift: false
            });
        }
        default:
            return state;
    }
}
