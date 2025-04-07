import { FETCH_OWNER_YACHTS_SUCCESS, FETCH_REQUEST, FETCH_REQUEST_FAILURE, FETCH_SINGLE_YACHTOWNER_SUCCESS, FETCH_YACHTOWNERS_SUCCESS ,FETCH_OWNER_PAYOUTS_SUCCESS} from "../actionType";


const initialState = {
 
  YachtOwners:[],
  SingleYachtOwner:null,
  OwnerYachts:[],
  OwnerPayouts:[],
  loading: false,
  error: null,
};

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_YACHTOWNERS_SUCCESS:
      return {
        ...state,
        loading: false,
        YachtOwners: payload,
      };
    case FETCH_SINGLE_YACHTOWNER_SUCCESS:
      return {
        ...state,
        loading: false,
        SingleYacht: payload,
      };
      case FETCH_OWNER_YACHTS_SUCCESS:
        return {
          ...state,
          loading: false,
          OwnerYachts: payload,
        };

        case FETCH_OWNER_PAYOUTS_SUCCESS:
          return {
            ...state,
            loading: false,
            OwnerPayouts: payload,
          };
    case FETCH_REQUEST_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
      };
//     case FETCH_OWNER_YACHTS_SUCCESS:
//       return {
//         ...state,
//         loading: false,
//         OwnerYachts: payload,
//         error: false,
//       };
//       case "BOAT_OWNER_DATA":
//         return{
//           ...state,
//           loading: false,
//           YachtOwner: payload,
//           error: false,
//         };

  
     
  
      
    default:
      return state;
  }
};
