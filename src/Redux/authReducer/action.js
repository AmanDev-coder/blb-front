import { CornerDownLeft } from "lucide-react";
import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  AUTH_ERROR_RESET,
} from "../actionType";
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";


import api from "../../utils/api";
import {formatFirebaseError} from "../../utils/formatFirebaseError";


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const registerRequest = () => ({ type: REGISTER_REQUEST });
export const registerSuccess = (user) => ({
  type: REGISTER_SUCCESS,
  payload: user,
});
export const registerFail = (error) => ({
  type: REGISTER_FAIL,
  payload: error,
});

export const LoginRequest = () => ({ type: LOGIN_REQUEST });
export const LoginSuccess = (user) => ({
  type: LOGIN_SUCCESS,
  payload: user,
});
export const LoginFail = (error) => ({
  type: LOGIN_FAIL,
  payload: error,
});

export const clearAuthError = () => ({ type: AUTH_ERROR_RESET });

// Async action to handle registration with Firebase
export const registerUser = (email, password, name) => async (dispatch) => {
  dispatch(registerRequest());
  const auth = getAuth();

  try {
    // ✅ Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // ✅ Get Firebase ID Token
    const idToken = await firebaseUser.getIdToken();

    // ✅ Register user in backend
    const res = await api.post("/auth/register", {
      name,
      email,
      password, // Optional: Backend may not need password
      idToken,
    });

    // ✅ Save user & token
    sessionStorage.setItem("user", JSON.stringify(res.data.user));
    sessionStorage.setItem("token", idToken);

    dispatch(registerSuccess(res.data.user));
    return res.data;
  } catch (error) {
    console.error("Registration Error:", error);

    let errorMessage = "Something went wrong. Please try again.";
    let errorType = "UNKNOWN_ERROR";

    // ✅ Handle Firebase Errors
    if (error.code) {
      errorMessage = formatFirebaseError(error.code);
      errorType = "FIREBASE_ERROR";
    }

    // ✅ Handle API Errors
    else if (error.response && error.response.data) {
      errorMessage = error.response.data.message || "Failed to register.";
      errorType = "API_ERROR";
    }

    // ✅ Dispatch standardized error format
    
    dispatch(registerFail({ type: errorType, message: errorMessage, code: error.code || "" }));

    return { success: false, error: errorMessage };
  }
};

export const LoginUser = (email, password) => async (dispatch) => {
  dispatch(LoginRequest());
  try {
    const auth = getAuth();

    // ✅ Sign in with Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();

    // ✅ Authenticate with backend using Firebase token
    const res = await api.post("/auth/login", { idToken });

    // ✅ Store user & token
    sessionStorage.setItem("user", JSON.stringify(res.data.user));
    sessionStorage.setItem("token", idToken);

    dispatch(LoginSuccess(res.data));
    return { status: "success", user: res.data };
  } catch (error) {
    console.error("Login Error:", error);

    let errorMessage = "Something went wrong. Please try again.";
    let errorType = "UNKNOWN_ERROR";

    // ✅ Handle Firebase Errors
    if (error.code) {
      errorMessage = formatFirebaseError(error.code);
      errorType = "FIREBASE_ERROR";
    }

    // ✅ Handle Backend API Errors
    else if (error.response && error.response.data) {
      errorMessage = error.response.data.message || "Login failed.";
      errorType = "API_ERROR";
    }

    // ✅ Dispatch structured error to Redux
    dispatch(LoginFail({ type: errorType, message: errorMessage, code: error.code || "" }));

    return { status: "error", error: errorMessage };
  }
};
export const saveUserToDatabase = (user) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/google-signin`,
      user,
      config
    );
    // const data = await response.json();
    console.log(response);
  } catch (error) {
    console.error("Error saving user to database:", error);
    // dispatch({ type: "SAVE_USER_ERROR", payload: error.message });
  }
};

//

export const OwnerRegisterationRequest = (ownerDeatils) => async (dispatch) => {
  dispatch(registerRequest());
  try {
    const TOKEN = `Bearer ${sessionStorage.getItem("token")}`;

    const config = {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json", // Ensure headers match server expectations
      },
    };
    const res = await axios.post(
      `${BASE_URL}/boatOwners/register`,
      ownerDeatils,
      config
    );
    console.log(res.data.user)
    sessionStorage.setItem("user", JSON.stringify(res.data.user));

  } catch (error) {
    console.log("error", error, error.response.data);
    dispatch(registerFail(error.response.data));
  }
};

export const AdminRegisteration = (AdminDeatils) => async (dispatch) => {
  console.log(AdminDeatils);
  dispatch(registerRequest());
  try {
    const res = await axios.post(`${BASE_URL}/admin/register`, AdminDeatils);
    console.log("res", res);
    return {status:"success",message:res.data.message}
  } catch (error) {
    console.error("Registration Error:", error);

    let errorMessage = "Something went wrong. Please try again.";
    let errorType = "UNKNOWN_ERROR";

    // ✅ Handle Firebase Errors
   

    // ✅ Handle API Errors
     if (error.response && error.response.data) {
      errorMessage = error.response.data.message || "Failed to register.";
      errorType = "API_ERROR";
    }


    // ✅ Dispatch standardized error format
    
    dispatch(registerFail({ type: errorType, message: errorMessage, code: error.code || "" }));

    return { success: false, error: errorMessage };
  }
};

export const LoginAdmin = (adminDetails) => async (dispatch) => {
  const auth = getAuth();
  const { email, password } = adminDetails;

  dispatch(registerRequest());
  // console.log(adminDetails)

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const idToken = await userCredential.user.getIdToken();

    // Send the ID token to your backend API for validation
    const response = await axios.post(`${BASE_URL}/admin/login`, { idToken });

    // Save the admin data to localStorage
    sessionStorage.setItem("user", JSON.stringify(response.data.admin));
    sessionStorage.setItem("token", idToken);
    // console.log(response.data.admin)
    dispatch(LoginSuccess(response.data.admin));

    return { status: "success", message: "Login Successful!" };
    // Dispatch success
  } catch (error) {
    console.error("Admin login error:", error);

    let errorMessage = "Something went wrong. Please try again.";
    let errorType = "UNKNOWN_ERROR";

    // ✅ Step 1: Check if Error is from the Backend API First
    if (error.response && error.response.data) {
      errorMessage = error.response.data.message || "Login failed.";
      errorType = "API_ERROR";
    }

    // ✅ Step 2: If No API Error, Check for Firebase Errors
    else if (error.code) {
      errorMessage = formatFirebaseError(error.code);
      errorType = "FIREBASE_ERROR";
    }

    // ✅ Dispatch Structured Error to Redux
    dispatch(LoginFail({ type: errorType, message: errorMessage, code: error.code || "" }));
  }
};

export const logoutUser = async (dispatch) => {
  try {
    // ✅ 1. Clear Token & User Data
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");

    // ✅ 2. Dispatch Redux Action to Clear Auth State
    dispatch({ type: "LOGOUT_SUCCESS" });

    // ✅ 3. Redirect to Login (if needed)
    // window.location.href = "/adminLogin"; // Can use `navigate()` if using React Router

  } catch (error) {
    console.error("Logout Error:", error);
  }
};


export const sendContactUsRequest =  (formData) =>async(dispatch)=> {
  try {
    const response = await axios.post(`${BASE_URL}/email/contact-us`, formData, {
      headers: { "Content-Type": "application/json" },
    });
console.log(response)
    return { success: true, message: response.data.message };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Error sending request",
      error: error.response?.data?.error || error.message,
    };
  }
};