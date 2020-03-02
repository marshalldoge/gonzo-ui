import {SET_APPUSER, SET_NAME_ID_HASHMAP, SET_MODULE, SET_SHIFT,
    OPEN_SHIFT, SET_ID_SHIFT, SET_CLIENT_DATA, SET_BILLNAME_ARRAY,
    SET_CLIENT_NIT_ARRAY, SET_NIT_CLIENT_HASHMAP,SET_ITEM_QUANTITY,
    SET_ITEM_QUANTITY_CODE, SET_WAREHOUSE, SET_ID_WAREHOUSE, CLOSE_SHIFT,
    INCREASE_SALE_COUNT, SET_COMPANY, INCRESE_CLIENT_SALE_COUNT,
    INCREASE_COMPANY_SALE_COUNT,SET_CURRENCY,SET_MEASURE} from "./actionTypes";

export const setAppUser = AppUser => ({
    type: SET_APPUSER,
    payload: {
        AppUser
    }
});

export const setIdAppUser = AppUser => ({
    type: SET_APPUSER,
    payload: {
        AppUser
    }
});

export const setIdShift = Shift => ({
    type: SET_ID_SHIFT,
    payload: {
        Shift
    }
});

export const setIdWarehouse = idWarehouse => ({
    type: SET_ID_WAREHOUSE,
    payload: {
        idWarehouse
    }
});

export const setModules = Modules => ({
    type: SET_MODULE,
    payload: {
        Modules
    }
});

export const setShift = Shift => ({
    type: SET_SHIFT,
    payload: Shift
});

export const openShift = Shift => ({
    type: OPEN_SHIFT,
    payload: Shift
});

export const closeShift = () =>({
    type: CLOSE_SHIFT,
    payload:{

    }
});

export const setDuration = duration => ({
    type: OPEN_SHIFT,
    payload: {
        duration
    }
});

export const setNitIdClientHashMap = hashmap => ({
    type: SET_NAME_ID_HASHMAP,
    payload:hashmap
});

export const setClientData = clienData => ({
    type: SET_CLIENT_DATA,
    payload:clienData
});

export const setClientBillNameArray = array => ({
    type: SET_BILLNAME_ARRAY,
    payload:array
});

export const setClientNitArray = array => ({
    type: SET_CLIENT_NIT_ARRAY,
    payload:array
});
export const setNitClientHashMap = hashmap => ({
    type : SET_NIT_CLIENT_HASHMAP,
    payload: hashmap
});

export const setItemQuantityHashMap = hashmap => ({
    type : SET_ITEM_QUANTITY,
    payload: hashmap
});
export const setItemQuantityCode = hashmap => ({
    type : SET_ITEM_QUANTITY_CODE,
    payload: hashmap
});

export const setWarehouse = hashmap => ({
    type : SET_WAREHOUSE,
    payload: hashmap
});

export const increaseSaleCount = () => ({
    type : INCREASE_SALE_COUNT
});

export const setCompany = hashmap => ({
    type : SET_COMPANY,
    payload: hashmap
});

export const increaseClientSaleCount = idClient => ({
    type : INCRESE_CLIENT_SALE_COUNT,
    payload: idClient
});

export const increaseCompanySaleCount = () => ({
    type : INCREASE_COMPANY_SALE_COUNT
});

export const setCurrency = hashmap => ({
    type: SET_CURRENCY,
    payload: hashmap
});

export const setMeasure = hashmap => ({
    type: SET_MEASURE,
    payload: hashmap
});









