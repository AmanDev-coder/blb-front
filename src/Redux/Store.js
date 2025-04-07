import { legacy_createStore, applyMiddleware, combineReducers } from "redux";
import {thunk} from "redux-thunk";
import { reducer as yachtReducer } from "./yachtReducer/reducer";
import {reducer as authReducer} from "./authReducer/reducer";
import {reducer as yachtOwnerReducer} from "./yachtOwnerReducer/reducer";
import {reducer as adminReducer} from "./adminReducer.js/reducer";



const rootReducer = combineReducers({
    adminReducer,
    yachtReducer,
    authReducer,
    yachtOwnerReducer
});

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));