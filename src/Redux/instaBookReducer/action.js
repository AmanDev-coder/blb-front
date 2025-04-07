import axios from 'axios';

// Action Types
export const INSTA_BOOK_LOADING = 'INSTA_BOOK_LOADING';
export const INSTA_BOOK_SUCCESS = 'INSTA_BOOK_SUCCESS';
export const INSTA_BOOK_ERROR = 'INSTA_BOOK_ERROR';

// Action Creators
export const instaBookLoading = () => ({
  type: INSTA_BOOK_LOADING
});

export const instaBookSuccess = (data) => ({
  type: INSTA_BOOK_SUCCESS,
  payload: data
});

export const instaBookError = (error) => ({
  type: INSTA_BOOK_ERROR,
  payload: error
});

// Async Action to Fetch Insta Books by Yacht ID
export const getInstaBooksByYacht = (yachtId) => async (dispatch) => {
  try {
    dispatch(instaBookLoading());
    
    // Mock data for development
    const mockData = {
      availableDates: [
        { date: new Date(Date.now() + 86400000), price: 249 },   // Tomorrow
        { date: new Date(Date.now() + 86400000 * 2), price: 249 }, // Day after tomorrow
        { date: new Date(Date.now() + 86400000 * 3), price: 279 }, // 3 days from now
        { date: new Date(Date.now() + 86400000 * 4), price: 299 }, // 4 days from now
        { date: new Date(Date.now() + 86400000 * 7), price: 249 }, // 1 week from now
      ],
      minDuration: 1,
      maxDuration: 30
    };
    
    // In a real application, we would fetch from an API
    // const response = await axios.get(`http://localhost:8080/instaBooks/${yachtId}`);
    // dispatch(instaBookSuccess(response.data));
    
    // Using mock data for now
    setTimeout(() => {
      dispatch(instaBookSuccess(mockData));
    }, 600);
  } catch (error) {
    dispatch(instaBookError(error.message));
  }
}; 