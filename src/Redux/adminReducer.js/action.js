import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Fetch Admin Dashboard Stats from API
export const fetchAdminDashboardStats = async () => {
  try {

     const TOKEN =`Bearer ${sessionStorage.getItem("token")}`; // Replace with your actual token

    const config = {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json",
      },
    };
    const response = await axios.get(`${BASE_URL}/admin/dashboard-stats`,config);

    return response.data; // ✅ Return API response data
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    return null; // ✅ Return `null` if API request fails
  }
};

export const createYachtOwnerByAdmin = (data) => async(dispatch) => {
  try {
    const TOKEN = `Bearer ${sessionStorage.getItem("token")}`;
    const config = {
      headers: {            
        Authorization: TOKEN,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.post(`${BASE_URL}/boatOwners/create-by-admin`, data, config); 
    return response.data;
  } catch (error) {
    console.error("Error creating yacht owner:", error);
    throw error;
  }
};  



export const getVisitorBookingAnalytics =  () =>async (dispatch)=>{
  const TOKEN =`Bearer ${sessionStorage.getItem("token")}`; // Replace with your actual token

  const config = {
    headers: {
      Authorization: TOKEN,
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await axios.get(`${BASE_URL}/visitors/analytics`);
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch visitor and booking analytics:", error);
    throw error;
  }
};

export const fetchUsers=  (params = {})=>async(dispatch) => {
  try {

    const TOKEN = `Bearer ${sessionStorage.getItem("token")}`;
  
    const config = {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json", // Specify JSON content type
      },
    };

    const response = await axios.get(`${BASE_URL}/users`, { params },config);
console.log(response)
    return response.data; // ✅ Return the response data
  } catch (error) {
    console.error("Error fetching yacht owners:", error);
    throw error;
  }
};


export const fetchBookings=  (params = {})=>async(dispatch) => {
  try {

    const TOKEN = `Bearer ${sessionStorage.getItem("token")}`;
  
    const config = {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json", // Specify JSON content type
      },
    };

    const response = await axios.get(`${BASE_URL}/bookings`, { params },config);
    console.log(response)
    return response.data; // ✅ Return the response data
  } catch (error) {
    console.error("Error fetching yacht owners:", error);
    throw error;
  }
};

export const updateBooking = (bookingId, data) => async (dispatch) => {
 
  try {
    const TOKEN = `Bearer ${sessionStorage.getItem("token")}`;
    const config = {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.patch(`${BASE_URL}/bookings/${bookingId}`, data, config);
    console.log(response)
    return response.data; 
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
};    

export const fetchTransactions=  (params = {})=>async(dispatch) => {
  try {

    const TOKEN = `Bearer ${sessionStorage.getItem("token")}`;
  
    const config = {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json", // Specify JSON content type
      },
    };

    const response = await axios.get(`${BASE_URL}/transactions`, { params },config);
    console.log(response)
    return response.data; // ✅ Return the response data
  } catch (error) {
    console.error("Error fetching yacht owners:", error);
    throw error;
  }
};
export const updateTransaction = (transactionId, data) => async (dispatch) => {
  try {
    const TOKEN = `Bearer ${sessionStorage.getItem("token")}`;
    const config = {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.patch(`${BASE_URL}/transactions/${transactionId}`, data, config);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
};

export const fetchSettings = (section, params = {}) => async(dispatch) => {
  try {
    const TOKEN = `Bearer ${sessionStorage.getItem("token")}`;
  
    const config = {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.get(`${BASE_URL}/settings/${section}`, { params }, config);
    console.log(response)
    dispatch({
      type: 'FETCH_SETTINGS_SUCCESS',
      payload: response.data
    });
    return response.data; // ✅ Return the response data
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw error;
  }
};

export const updateSettings = (section, data, params = {}) => async(dispatch) => {
  try {
    const TOKEN = `Bearer ${sessionStorage.getItem("token")}`;
  
    const config = {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.put(`${BASE_URL}/settings/${section}`, data, { params, ...config });
    console.log(response)
    return response.data; // ✅ Return the response data
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
};


export const fetchReviews =  (params = {}) => async(dispatch) => {
  console.log(params)
  try {
    const TOKEN = `Bearer ${sessionStorage.getItem("token")}`;
    const config = {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json",
      },
    };
    // Handle both general reviews and yacht-specific reviews
    let endpoint = `${BASE_URL}/reviews`;
    if (params.yachtId) {
      endpoint = `${BASE_URL}/reviews/yacht/${params.yachtId}`;
      // Remove yachtId from params since it's now in URL
      const { yachtId, ...restParams } = params;
      params = restParams;
    }
    
    const response = await axios.get(endpoint, { params }, config);
    console.log(response) 
    return response.data.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};  

export const addTestimonial = (data) => async(dispatch) => {
  try {
    const TOKEN = `Bearer ${sessionStorage.getItem("token")}`;
    const config = {
      headers: {    
        Authorization: TOKEN,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.post(`${BASE_URL}/reviews`, data, config);
    return response.data;
  } catch (error) { 
    console.error("Error adding testimonial:", error);
    throw error;
  }
};
    export const updateTestimonial = (data) => async(dispatch) => {
  try    {
    const TOKEN = `Bearer ${sessionStorage.getItem("token")}`;
    const config = {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.patch(`${BASE_URL}/reviews/${data.id}`, data, config);
    return response.data;
  } catch (error) {
    console.error("Error updating testimonial:", error);
    throw error;
  }
};

export const deleteTestimonialAndReviews = (id) => async(dispatch) => {
  try {
    const TOKEN = `Bearer ${sessionStorage.getItem("token")}`;
    const config = {
      headers: {
        Authorization: TOKEN,   
        "Content-Type": "application/json",
      },
    };

    const response = await axios.delete(`${BASE_URL}/reviews/${id}`, config);
    return response.data;     
  } catch (error) {
    console.error("Error deleting FAQ category:", error);
    throw error;
  }
};

export const fetchFAQCategories = (params = {}) => async(dispatch) => {
  try {
    const TOKEN = `Bearer ${sessionStorage.getItem("token")}`;
    const config = {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json", 
      },
    };

    const response = await axios.get(`${BASE_URL}/faqs/categories`, { params, ...config });
    return response.data;
  } catch (error) {
    console.error("Error fetching FAQ categories:", error);
    throw error;
  }
};

export const createFAQCategory = (data) => async(dispatch) => {
  try {
    const TOKEN = `Bearer ${sessionStorage.getItem("token")}`;
    const config = {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.post(`${BASE_URL}/faqs/categories`, data, config);
    return response.data;
  } catch (error) {
    console.error("Error creating FAQ category:", error);
    throw error;
  }
};

export const updateFAQCategory = (id, data) => async(dispatch) => {
  try {
    const TOKEN = `Bearer ${sessionStorage.getItem("token")}`;
    const config = {
      headers: {
        Authorization: TOKEN,   
        "Content-Type": "application/json",
      },
    };

    const response = await axios.patch(`${BASE_URL}/faqs/categories/${id}`, data, config);
    return response.data;
  } catch (error) { 
    console.error("Error updating FAQ category:", error);
    throw error;
  }
};

export const deleteFAQCategory = (id) => async(dispatch) => {
  try {
    const TOKEN = `Bearer ${sessionStorage.getItem("token")}`;
    const config = {
      headers: {
        Authorization: TOKEN,   
        "Content-Type": "application/json",
      },
    };

    const response = await axios.delete(`${BASE_URL}/faqs/categories/${id}`, config);
    return response.data;     
  } catch (error) {
    console.error("Error deleting FAQ category:", error);
    throw error;
  }
};


export const fetchFAQs = (params = {}) => async(dispatch) => {
  try {
    const TOKEN = `Bearer ${sessionStorage.getItem("token")}`;
    const config = {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json",
      },
    };

    let endpoint = `${BASE_URL}/faqs`;
    if (params.category && params.userType) {
      endpoint = `${BASE_URL}/faqs/${params.category}/${params.userType}`;
      // Remove category and userType from params since they're in URL
      const { category, userType, ...restParams } = params;
      params = restParams;
    }

    const response = await axios.get(endpoint, { params, ...config });
    return response.data;
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    throw error;
  }
};

export const updateFAQ = (id, data) => async(dispatch) => {
  console.log(data)
  try {
    const TOKEN = `Bearer ${sessionStorage.getItem("token")}`;
    const config = {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.put(`${BASE_URL}/faqs/${id}`, data, config);
    return response.data;
  } catch (error) {
    console.error("Error updating FAQ:", error);
    throw error;
  }
};

export const createFAQ = (data) => async(dispatch) => {
  try {
    const TOKEN = `Bearer ${sessionStorage.getItem("token")}`;
    const config = {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json",
      },
    };

    const response = await axios.post(`${BASE_URL}/faqs`, data, config);
    return response.data;
  } catch (error) {
    console.error("Error creating FAQ:", error);
    throw error;
  }
};
