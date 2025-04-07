import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;;

// Create an Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ✅ Automatically Attach Token Before Every Request
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Global Error Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Fetching Error:", error.response?.data || error.message);
    return Promise.reject(error.response?.data || error.message);
  }
);

export default api;
