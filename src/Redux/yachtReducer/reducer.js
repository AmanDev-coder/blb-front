import {
  ADD_YACHT,
  DELETE_YACHT,
  FETCH_OWNER_YACHTS_SUCCESS,
  FETCH_SINGLE_YACHT_SUCCESS,
  FETCH_YACHTS_FAILURE,
  FETCH_YACHTS_REQUEST,
  FETCH_YACHTS_SUCCESS,
  UPDATE_YACHT,
} from "../actionType";

const initialState = {
  yachts: [],
  wishlist: [], 
  SingleYacht: null,
  OwnerYachts: [],
  YachtOwner:null,
  loading: false,
  error: null,
};

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_YACHTS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_YACHTS_SUCCESS:
      return {
        ...state,
        loading: false,
        yachts: payload,
      };
    case FETCH_SINGLE_YACHT_SUCCESS:
      return {
        ...state,
        loading: false,
        SingleYacht: payload,
      };
    case FETCH_YACHTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    case FETCH_OWNER_YACHTS_SUCCESS:
      return {
        ...state,
        loading: false,
        OwnerYachts: payload,
        error: false,
      };
      case "BOAT_OWNER_DATA":
        return{
          ...state,
          loading: false,
          YachtOwner: payload,
          error: false,
        };
    case ADD_YACHT:
      return {
        ...state,
        yachts: [...state.yachts, payload],
      };
    case UPDATE_YACHT:
      return {
        ...state,
        yachts: state.yachts.map((yacht) =>
          yacht.id === payload.id ? payload : yacht
        ),
      };
    case DELETE_YACHT:
      return {
        ...state,
        yachts: state.yachts.filter((yacht) => yacht.id !== payload.id),
      };
      case "FETCH_WISHLIST_SUCCESS":
        return { ...state, wishlist: payload, loading: false };
  
      case "FETCH_WISHLIST_ERROR":
        return { ...state, error: payload, loading: false };
  
      
  
     
  
      
    default:
      return state;
  }
};
