import { 
  INSTA_BOOK_LOADING, 
  INSTA_BOOK_SUCCESS, 
  INSTA_BOOK_ERROR 
} from './action';

// Initial State
const initialState = {
  availableDates: [],
  minDuration: 1,
  maxDuration: 30,
  isLoading: false,
  error: null
};

// Reducer
const instaBookReducer = (state = initialState, action) => {
  switch (action.type) {
    case INSTA_BOOK_LOADING:
      return {
        ...state,
        isLoading: true,
        error: null
      };
      
    case INSTA_BOOK_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isLoading: false,
        error: null
      };
      
    case INSTA_BOOK_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };
      
    default:
      return state;
  }
};

export default instaBookReducer; 