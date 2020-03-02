import { SET_ID_APPUSER, SET_MODULE } from "../actionTypes";

const initialState = {
    modules:{}
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
        case SET_MODULE:{
            //console.log("SET_MODULE: The content to be updated: ",action);
            const modules = action.payload;
            //console.log("Current MODULE ",modules);
            return {
                ...state,
                modules : modules
            };
        }
        default:
            return state;
    }
}
