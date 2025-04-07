import {
  FETCH_DASHBOARD_STATS_REQUEST,
  FETCH_DASHBOARD_STATS_SUCCESS,
  FETCH_DASHBOARD_STATS_FAILURE,
  FETCH_VISITOR_ANALYTICS_REQUEST,
  FETCH_VISITOR_ANALYTICS_SUCCESS,
  FETCH_VISITOR_ANALYTICS_FAILURE,
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
  FETCH_BOOKINGS_REQUEST,
  FETCH_BOOKINGS_SUCCESS,
  FETCH_BOOKINGS_FAILURE,
  FETCH_TRANSACTIONS_REQUEST,
  FETCH_TRANSACTIONS_SUCCESS,
  FETCH_TRANSACTIONS_FAILURE,
  FETCH_SETTINGS_SUCCESS,
  UPDATE_SETTINGS_SUCCESS,
  CLEAR_ERROR
} from "./actionType";

const initialState = {
  dashboardStats: null,
  visitorAnalytics: null,
  users: [],
  bookings: [],
  transactions: [],
  settings: {},
  loading: false,
  error: null
};

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_DASHBOARD_STATS_REQUEST:
      return { ...state, loading: true };
    case FETCH_DASHBOARD_STATS_SUCCESS:
      return { ...state, loading: false, dashboardStats: payload };
    case FETCH_DASHBOARD_STATS_FAILURE:
      return { ...state, loading: false, error: payload };

    case FETCH_VISITOR_ANALYTICS_REQUEST:
      return { ...state, loading: true };
    case FETCH_VISITOR_ANALYTICS_SUCCESS:
      return { ...state, loading: false, visitorAnalytics: payload };
    case FETCH_VISITOR_ANALYTICS_FAILURE:
      return { ...state, loading: false, error: payload };

    case FETCH_USERS_REQUEST:
      return { ...state, loading: true };
    case FETCH_USERS_SUCCESS:
      return { ...state, loading: false, users: payload };
    case FETCH_USERS_FAILURE:
      return { ...state, loading: false, error: payload };

    case FETCH_BOOKINGS_REQUEST:
      return { ...state, loading: true };
    case FETCH_BOOKINGS_SUCCESS:
      return { ...state, loading: false, bookings: payload };
    case FETCH_BOOKINGS_FAILURE:
      return { ...state, loading: false, error: payload };

    case FETCH_TRANSACTIONS_REQUEST:
      return { ...state, loading: true };
    case FETCH_TRANSACTIONS_SUCCESS:
      return { ...state, loading: false, transactions: payload };
    case FETCH_TRANSACTIONS_FAILURE:
      return { ...state, loading: false, error: payload };

    case FETCH_SETTINGS_SUCCESS:
      return { ...state, settings: { ...state.settings, ...payload } };
    case UPDATE_SETTINGS_SUCCESS:
      return { ...state, settings: { ...state.settings, ...payload } };

    case CLEAR_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
};

