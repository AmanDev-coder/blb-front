import { REGISTER_REQUEST,REGISTER_SUCCESS,REGISTER_FAIL,LOGIN_REQUEST,LOGIN_SUCCESS,LOGIN_FAIL, AUTH_ERROR_RESET} from "../actionType";

const initialState = {
  user: JSON.parse(sessionStorage.getItem("user"))?.user||{},
  loading: false,
  isError: null,
  isAuth:JSON.parse(sessionStorage.getItem("user"))?.user?true:false,
  token:sessionStorage.getItem("token"),
  isLoginError:null

};

// Reducer
export const reducer = (state = initialState, {type,payload}) => {
  switch (type) {
    case REGISTER_REQUEST:
      return { ...state, loading: true, isError: null };
    case REGISTER_SUCCESS:
      return { ...state, loading: false, user: payload,isAuth:true };
    case REGISTER_FAIL:
      return { ...state, loading: false, isError: payload };
      case LOGIN_REQUEST:
      return { ...state, loading: true, isError: null };
    case LOGIN_SUCCESS:
      return { ...state, loading: false, user: payload.user,isAuth:true ,token:payload.token};
    case LOGIN_FAIL:
      return { ...state, loading: false, isError: payload }; 
      case AUTH_ERROR_RESET:
        return { ...state, isError: null };
        case "LOGOUT_SUCCESS":
          return { ...state, user: null, isAuth: false };
    default:
      return state;
  }
};

