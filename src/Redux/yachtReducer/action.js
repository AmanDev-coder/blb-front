import {
  ADD_YACHT,
  DELETE_YACHT,
  FETCH_OWNER_YACHTS_SUCCESS,
  FETCH_YACHTS_FAILURE,
  FETCH_YACHTS_REQUEST,
  FETCH_YACHTS_SUCCESS,
  UPDATE_YACHT,
  ADD_BLOCK_REQUEST,
  ADD_BLOCK_SUCCESS,
  ADD_BLOCK_FAILURE,
  FETCH_BLOCKS_REQUEST,
  FETCH_BLOCKS_SUCCESS,
  FETCH_BLOCKS_FAILURE,
  UPDATE_BLOCK_REQUEST,
  UPDATE_BLOCK_SUCCESS,
  UPDATE_BLOCK_FAILURE,
  DELETE_BLOCK_REQUEST,
  DELETE_BLOCK_SUCCESS,
  DELETE_BLOCK_FAILURE,
  FETCH_SINGLE_YACHT_SUCCESS,
} from "../actionType";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchYachtsRequest = () => ({
  type: FETCH_YACHTS_REQUEST,
});

export const fetchYachtsSuccess = (yachts) => ({
  type: FETCH_YACHTS_SUCCESS,
  payload: yachts,
});

export const fetchYachtsFailure = (error) => ({
  type: FETCH_YACHTS_FAILURE,
  payload: error,
});
export const fetchYachtByIdSuccess = (yacht) => ({
  type: FETCH_SINGLE_YACHT_SUCCESS,
  payload: yacht,
});
export const addYacht = (yacht) => ({
  type: ADD_YACHT,
  payload: yacht,
});

export const updateYacht = (yacht) => ({
  type: UPDATE_YACHT,
  payload: yacht,
});

export const deleteYacht = (yachtId) => ({
  type: DELETE_YACHT,
  payload: { id: yachtId },
});

export const fetchOwnerYachtsSuccess = (yachts) => ({
  type: FETCH_OWNER_YACHTS_SUCCESS,
  payload: yachts,
});


export const addBlockRequest = () => ({ type: ADD_BLOCK_REQUEST });
export const addBlockSuccess = (blockData) => ({
  type: ADD_BLOCK_SUCCESS,
  payload: blockData,
});
export const addBlockFailure = (error) => ({
  type: ADD_BLOCK_FAILURE,
  payload: error,
});

// Fetch Blocks
export const fetchBlocksRequest = () => ({ type: FETCH_BLOCKS_REQUEST });
export const fetchBlocksSuccess = (blocks) => ({
  type: FETCH_BLOCKS_SUCCESS,
  payload: blocks,
});
export const fetchBlocksFailure = (error) => ({
  type: FETCH_BLOCKS_FAILURE,
  payload: error,
});

// Update Block
export const updateBlockRequest = () => ({ type: UPDATE_BLOCK_REQUEST });
export const updateBlockSuccess = (updatedBlock) => ({
  type: UPDATE_BLOCK_SUCCESS,
  payload: updatedBlock,
});
export const updateBlockFailure = (error) => ({
  type: UPDATE_BLOCK_FAILURE,
  payload: error,
});


export const deleteBlockRequest = () => ({ type: DELETE_BLOCK_REQUEST });
export const deleteBlockSuccess = (blockId) => ({
  type: DELETE_BLOCK_SUCCESS,
  payload: blockId,
});
export const deleteBlockFailure = (error) => ({
  type: DELETE_BLOCK_FAILURE,
  payload: error,
});
const TOKEN =`Bearer ${sessionStorage.getItem("token")}`; // Replace with your actual token

const config = {
  headers: {
    Authorization: TOKEN,
    "Content-Type": "application/json",
  },
};


//user side actions

export const fetchYachts = (paramsObj) => async (dispatch) => {
  dispatch(fetchYachtsRequest());
  // console.log(paramsObj)
  try {
    // Fetch boats and images in parallel
    const [boatsResponse, imagesResponse] = await Promise.all([
      axios.get(`${BASE_URL}/boats`, { params: paramsObj }),
      axios.get(`${BASE_URL}/images`),
    ]);

    // Extract data from responses
    const boats = boatsResponse.data.boats;
    const images = imagesResponse.data.data;
    // console.log(boats, images);
    // Merge the images with corresponding boats
    const yachtsWithImages = boats.map((boat) => {
      const boatImages = images.filter((image) => image.boatId === boat._id);
      return {
        ...boat,
        images: boatImages,
      };
    });
    console.log(yachtsWithImages);
    // Dispatch the merged data to the store
    dispatch(fetchYachtsSuccess(yachtsWithImages));
    return {
      boats: yachtsWithImages,
      totalPages: boatsResponse.data.totalPages,
      totalCount: boatsResponse.data.totalCount,
    };
  } catch (err) {
    dispatch(fetchYachtsFailure(err.message));
  }
};

export const fetchDestinations = () => async (dispatch) => {
  dispatch(fetchYachtsRequest());
  try {
    const response = await axios.get(`${BASE_URL}/destinations`);
    const destinations = response.data;
    
    dispatch({
      type: "FETCH_DESTINATIONS_SUCCESS",
      payload: destinations
    });
    console.log(destinations)


    
    return destinations;
  } catch (err) {
    dispatch(fetchYachtsFailure(err.message));
  }
};

export const fetchYachtTypes = () => async (dispatch) => {
  dispatch(fetchYachtsRequest());
  try {
    const response = await axios.get(`${BASE_URL}/yachtTypes`);
    const yachtTypes = response.data.data;
    
    dispatch({
      type: "FETCH_YACHT_TYPES_SUCCESS", 
      payload: yachtTypes
    });

    return yachtTypes;
  } catch (err) {
    dispatch(fetchYachtsFailure(err.message));
  }
};

export const getOwnerById =(ownerId)=> async (dispatch) => {
  dispatch(fetchYachtsRequest());

  try {
    const res = await axios.get(
      `${BASE_URL}/boatOwners/${ownerId}`,
      
    );

    const ownerDetails = res.data;
  
    dispatch({type:"BOAT_OWNER_DATA",payload: ownerDetails})

  } catch (err) {
    console.error("Error:", err.message);
  }
};

//owner side actions
export const getOwnerYachts = async (dispatch) => {
  dispatch(fetchYachtsRequest());

  try {
    const TOKEN =`Bearer ${sessionStorage.getItem("token")}`; // Replace with your actual token

    const config = {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json",
      },
    };
    
    const [boatsResponse, imagesResponse] = await Promise.all([
       axios.post(`${BASE_URL}/boats/owner`, {}, config),
      axios.get(`${BASE_URL}/images`),
    ]);

    const boats = boatsResponse.data;
    const images = imagesResponse.data.data;
    console.log(boats, images);
    // Merge the images with corresponding boats
    const yachtsWithImages = boats.map((boat) => {
      const boatImages = images.filter((image) => image.boatId === boat._id);
      return {
        ...boat,
        images: boatImages,
      };
    });

    // const response = await axios.post(`${BASE_URL}/boats/owner`, {}, config);

    // console.log("Response:", response, response.data);
    dispatch(fetchOwnerYachtsSuccess(yachtsWithImages));
return yachtsWithImages

  } catch (err) {
    console.error("Error:", err);
  }
};


export const AddYachtsListing = (yachtDetails) => async (dispatch) => {
  dispatch(fetchYachtsRequest());
  try {
    const TOKEN =`Bearer ${sessionStorage.getItem("token")}`;
    const config = {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json", // Specify JSON content type
      },
    };

    const boatsResponse = await axios.post(
      `${BASE_URL}/boats`,
      yachtDetails, // Replace with the actual request body
      config
    );

    // console.log(boatsResponse);
    return { yachtId: boatsResponse.data._id };
    // Dispatch success action or handle response as needed
  } catch (err) {
    dispatch(fetchYachtsFailure(err.message));
  }
};



export const getYachtsByID =(boatId)=>async(dispatch)=>{
  console.log(boatId)
    try {
      const response = await axios.get(
        `${BASE_URL}/boats/${boatId}`
      );
      const images = await axios.get(
        `${BASE_URL}/images/${boatId}`
      );
      console.log({ ...response.data, images: images.data.data });
      dispatch(fetchYachtByIdSuccess({ ...response.data, images: images.data.data }))
    } catch (error) {
      console.error("Error fetching boat details:", error);
    }
  
}
export const EditYachtListing =
  (yachtId, updatedFields) => async (dispatch) => {
    
    try {
      const TOKEN =`Bearer ${sessionStorage.getItem("token")}`;
      const config = {
        headers: {
          Authorization: TOKEN,
          "Content-Type": "application/json", // Specify JSON content type
        },
      };

      
      const response = await axios.patch(
        `${BASE_URL}/boats/${yachtId}`, // Endpoint with yacht ID
        updatedFields, // Body with updated fields
        config // Config (Headers)
      );

      // console.log("Response:", response.data);

      // Dispatch success action
      // dispatch(editYachtSuccess(response.data));
    } catch (err) {
      console.error("Error:", err.message);

      // Dispatch failure action
      // dispatch(editYachtFailure(err.message));
    }
  };

export const AddPhotos = (yachtId,photos) => async (dispatch) => {
  if (photos.length === 0) {
    alert("Please select at least one photo.");
    return;
  }

  const uploadFormData = new FormData();
  photos.forEach((photo) => {
    uploadFormData.append("files", photo);
    // uploadFormData.append('boatId', formData.);
  });
  const TOKEN =`Bearer ${sessionStorage.getItem("token")}`;
  const config = {
    headers: {
      Authorization: TOKEN,
      "Content-Type": "application/json", // Specify JSON content type
    },
  };

  try {
    const response = await fetch(`${BASE_URL}/images/multiple/${yachtId}`, {
      method: "POST",
      body: uploadFormData,
      config,
    });

    const data = await response.json();
    if (response.ok) {
      // console.log("Upload successful:", data);
      return data.images;
    } else {
      console.error("Upload failed:", data);
    }
  } catch (error) {
    console.error("Error uploading files:", error);
  }
};
export const DeleteYachtImage = (ImageId) => async (dispatch) => {
  if (!ImageId) {
    console.error("Photo ID and Yacht ID are required.");
    return;
  }
  const TOKEN =`Bearer ${sessionStorage.getItem("token")}`;
  const config = {
    headers: {
      Authorization: TOKEN,
      "Content-Type": "application/json", // Ensure headers match server expectations
    },
  };

  try {
    const response = await fetch(`${BASE_URL}/images/${ImageId}`, {
      method: "DELETE",
      config,
    });

    if (response.ok) {
      console.log(`Photo with ID ${ImageId} deleted successfully.`);
      return true; // Return success response
    } else {
      const data = await response.json();
      console.error("Deletion failed:", data.message);
      return false;
    }
  } catch (error) {
    console.error("Error deleting photo:", error);
    return false;
  }
};

export const fetchSuggestions = async (location) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/locations?locationQuery=${location}`
    );
    // console.log(response.data);
    return response.data;
  } catch (err) {
    console.error("Error fetching location suggestions:", err);
  }
};


export const DeleteYachtListing =
  (yachtId) => async (dispatch) => {
    const TOKEN =`Bearer ${sessionStorage.getItem("token")}`;
    try {
      const config = {
        headers: {
          Authorization: TOKEN,
          "Content-Type": "application/json", // Specify JSON content type
        },
      };

      const response = await axios.delete(
        `${BASE_URL}/boats/${yachtId}`, // Endpoint with yacht ID
        config // Config (Headers)
      );
     console.log(response)
    //  dispatch(fetchOwnerYachtsSuccess(response.data.updatedList))
    } catch (err) {
      console.error("Error:", err.message);

      // Dispatch failure action
      // dispatch(editYachtFailure(err.message));
    }
  };


  export const addBlock =  ( blockData) =>async(dispatch) =>{
    dispatch(addBlockRequest());
    const TOKEN =`Bearer ${sessionStorage.getItem("token")}`;
    const config = {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json", // Specify JSON content type
      },
    };
    try {
      const response = await axios.post(`${BASE_URL}/boats/owner/block`, blockData, config);
  
      // console.log("Add Block Response:", response.data);
      dispatch(addBlockSuccess(response.data));
    } catch (err) {
      console.error("Error Adding Block:", err.message);
      dispatch(addBlockFailure(err.message));
    }
  };
  
  // Fetch all blocks for a specific boat
  export const fetchBlocks =  ( boatId) =>async(dispatch)=> {
    dispatch(fetchBlocksRequest());
    const TOKEN =`Bearer ${sessionStorage.getItem("token")}`;
    const config = {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json", // Specify JSON content type
      },
    };
    try {
      const response = await axios.get(`${BASE_URL}/boats/owner/block/${boatId}`, config);
  
      console.log("Fetch Blocks Response:", response.data);
      dispatch(fetchBlocksSuccess(response.data));
      return response.data
    } catch (err) {
      console.error("Error Fetching Blocks:", err.message);
      dispatch(fetchBlocksFailure(err.message));
    }
  };
  export const fetchAllBlocks =  (yachtId=null ) =>async(dispatch)=> {
    dispatch(fetchBlocksRequest());
    const TOKEN =`Bearer ${sessionStorage.getItem("token")}`;
    const config = {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json", // Specify JSON content type
      },
      params: {
        ...(yachtId && { yachtId }), 
      },
    };
    try {
      const response = await axios.get(`${BASE_URL}/boats/owner/block`, config);
  
      console.log("Fetch Blocks Response:", response.data);
      dispatch(fetchBlocksSuccess(response.data));
      return response.data.blocks
    } catch (err) {
      console.error("Error Fetching Blocks:", err.message);
      dispatch(fetchBlocksFailure(err.message));
    }
  };
  // Update an existing availability block
  export const updateBlock = async (dispatch, blockId, updatedData) => {
    dispatch(updateBlockRequest());
    const TOKEN =`Bearer ${sessionStorage.getItem("token")}`;
    const config = {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json", // Specify JSON content type
      },
    };
    try {
      const response = await axios.put(`${BASE_URL}/boats/owner/block/${blockId}`, updatedData, config);
  
      // console.log("Update Block Response:", response.data);
      dispatch(updateBlockSuccess(response.data));
    } catch (err) {
      console.error("Error Updating Block:", err.message);
      dispatch(updateBlockFailure(err.message));
    }
  };
  
  // Delete an availability block
  export const deleteBlock =  ( blockId) =>async (dispatch)=>{
    dispatch(deleteBlockRequest());
    const TOKEN =`Bearer ${sessionStorage.getItem("token")}`;
    const config = {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json", // Specify JSON content type
      },
    };
    try {
      const response = await axios.delete(`${BASE_URL}/boats/owner/block/${blockId}`, config);
  
      // console.log("Delete Block Response:", response.data);
      dispatch(deleteBlockSuccess(blockId)); // Pass blockId to the reducer for state cleanup
    } catch (err) {
      console.error("Error Deleting Block:", err.message);
      dispatch(deleteBlockFailure(err.message));
    }
  };

 export const fetchAmenitiesByID=async(amenityIds)=>{
try {
  const response = await axios.post(`${BASE_URL}/features/amenities/bulk`,amenityIds);
  // console.log(response)
  return response.data
  
} catch (error) {
  
}

  }

  export const addInstaBook =  ( InstaBookData) =>async(dispatch) =>{
    dispatch(addBlockRequest());
    const TOKEN =`Bearer ${sessionStorage.getItem("token")}`;
    const config = {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json", // Specify JSON content type
      },
    };
    try {
      const response = await axios.post(`${BASE_URL}/instabook`, InstaBookData, config);
  console.log(response.data)
 
    } catch (err) {
      console.error("Error Adding Block:", err.message);
    }
  };

  export const getAllInstaBooks = (yachtId=null) => async (dispatch) => {
    const TOKEN =`Bearer ${sessionStorage.getItem("token")}`;
    const config = {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json", // Specify JSON content type
      }, params: {
        ...(yachtId && { yachtId }), 
      },
    };
  
    try {
      const response = await axios.get(`${BASE_URL}/instabook`, config);
      console.log("InstaBooks Fetched:", response.data);
      return response.data
    } catch (err) {
      console.error("Error Fetching InstaBooks:", err.message);
      // dispatch({ type: "GET_INSTABOOKS_FAIL", payload: err.message });
    }
  };
  
  export const getInstaBooksByYacht = (yachtId, startDate = null, endDate = null) => async (dispatch) => {
    const TOKEN = `Bearer ${sessionStorage.getItem("token")}`;
    
    const config = {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json", // Specify JSON content type
      },
    };
  
    // ✅ Construct Query Parameters Dynamically
    let queryParams = new URLSearchParams();
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  
    try {
      const response = await axios.get(`${BASE_URL}/instabook/yacht/${yachtId}${queryString}`, config);
      
      console.log("InstaBooks for Yacht:", response.data);
      
      return response.data; // ✅ Returns filtered results based on the date range
    } catch (err) {
      console.error("Error Fetching InstaBooks for Yacht:", err.message);
    }
  };
  
  export const getInstaBookById = (id) => async (dispatch) => {
    const TOKEN =`Bearer ${sessionStorage.getItem("token")}`;
    const config = {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json", // Specify JSON content type
      },
    };
  
    try {
      const response = await axios.get(`${BASE_URL}/instabook/${id}`, config);
      // dispatch({ type: "GET_INSTABOOK_SUCCESS", payload: response.data });
      console.log("InstaBook Fetched:", response.data);
      return response.data
    } catch (err) {
      console.error("Error Fetching InstaBook:", err.message);
      // dispatch({ type: "GET_INSTABOOK_FAIL", payload: err.message });
    }
  };
  
  export const updateInstaBook = (id, InstaBookData) => async (dispatch) => {
    const TOKEN =`Bearer ${sessionStorage.getItem("token")}`;
    const config = {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json", // Specify JSON content type
      },
    };
  
    try {
      const response = await axios.put(`${BASE_URL}/instabook/${id}`, InstaBookData, config);
      // dispatch({ type: "UPDATE_INSTABOOK_SUCCESS", payload: response.data });
      console.log("InstaBook Updated:", response.data);
    } catch (err) {
      // console.error("Error Updating InstaBook:", err.message);
      dispatch({ type: "UPDATE_INSTABOOK_FAIL", payload: err.message });
    }
  };
  
  export const deleteInstaBook = (id) => async (dispatch) => {
    // dispatch({ type: "DELETE_INSTABOOK_REQUEST" }); // Optional: Redux action for loading state
    const TOKEN =`Bearer ${sessionStorage.getItem("token")}`;
    const config = {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json", // Specify JSON content type
      },
    };
    try {
      await axios.delete(`${BASE_URL}/instabook/${id}`, config);
      // dispatch({ type: "DELETE_INSTABOOK_SUCCESS", payload: id });
      console.log("InstaBook Deleted:", id);
    } catch (err) {
      console.error("Error Deleting InstaBook:", err.message);
      // dispatch({ type: "DELETE_INSTABOOK_FAIL", payload: err.message });
    }
  };
  
  export const fetchOwnerByYachtId =(yachtId)=>async (dispatch) => {
    try {
      const response = await axios.get(`${BASE_URL}/boatOwners/yacht/${yachtId}`);
      dispatch({type:"BOAT_OWNER_DATA",payload: response.data.owner})
      return response.data.owner; // Return the owner data from the response
    } catch (error) {
      console.error("Error fetching owner by yacht ID:", error);
      throw error; // Re-throw the error for handling in the component
    }
  };


  
  export const fetchWishlist = (userId) => async (dispatch) => {
    console.log(userId)
    try {
      const response = await axios.get(`${BASE_URL}/wishlist/${userId}`);
      console.log(response,response.data.map((item) => item.yachtId?._id) )
      dispatch({ type: "FETCH_WISHLIST_SUCCESS", payload: response.data.map((item) => item?.yachtId?._id) });
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      dispatch({ type: "FETCH_WISHLIST_ERROR", payload: error.message });
    }
  };
  
  // ✅ Toggle Wishlist (Add or Remove)
  export const toggleWishlist = (userId, yachtId, isWishlisted) => async (dispatch) => {
    // console.log(isWishlisted)
    try {
      if (isWishlisted) {
        await axios.post(`${BASE_URL}/wishlist/remove`, { userId, yachtId });
        dispatch({ type: "REMOVE_FROM_WISHLIST", payload: yachtId });
       return {status:"success"}
      } else {
        await axios.post(`${BASE_URL}/wishlist/add`, { userId, yachtId });
        dispatch({ type: "ADD_TO_WISHLIST", payload: yachtId });
        return {status:"success"}
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      dispatch({ type: "WISHLIST_ERROR", payload: error.message });
    return  {status:"failed"}
    }
  };
  
  export const fetchBookings =  (
    page = 1,
    limit = 5,
    sortBy = "createdAt",
    order = "desc",
    startDate,
    endDate,
    status,
    yachtId,
    location,
  ) => async (dispatch)=>{
    try {
      // ✅ Build query parameters dynamically
      const queryParams = new URLSearchParams({
        page,
        limit,
        sortBy,
        order,
      });
  
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);
      if (status) queryParams.append("status", status);
      if (yachtId) queryParams.append("yachtId", yachtId);
      if (location) queryParams.append("location", location);
  
      // ✅ Send request to backend
      const response = await axios.get(`${BASE_URL}/bookings/?${queryParams.toString()}`);
  console.log(response)
      return response.data; // ✅ Return the API response
    } catch (error) {
      console.error("❌ Error fetching bookings:", error);
      throw error; // ✅ Handle errors properly
    }
  };
  export const approveYacht =  (yachtId) =>async(dispatch)=> {
    
    try {

      const TOKEN = `Bearer ${sessionStorage.getItem("token")}`;
    
      const config = {
        headers: {
          Authorization: TOKEN,
          "Content-Type": "application/json", // Specify JSON content type
        },
      };
      const response = await axios.put(`${BASE_URL}/boats/${yachtId}/approve`,{},config);
      return response.data;
    } catch (error) {
      console.error("❌ Error approving yacht:", error.response?.data || error.message);
      throw error;
    }
  };
  export const rejectYacht =  (yachtId) => async(dispatch)=>{
    try {
      // if (!rejectionReason) throw new Error("Rejection reason is required!");
      const TOKEN = `Bearer ${sessionStorage.getItem("token")}`;
    
    const config = {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json", // Specify JSON content type
      },
    };

      const response = await axios.put(`${BASE_URL}/boats/${yachtId}/reject`,{},config);
  
      return response.data;
    } catch (error) {
      console.error("❌ Error rejecting yacht:", error.response?.data || error.message);
      throw error;
    }
  };

  export const fetchYachtOwners =  (params = {})=>async(dispatch) => {
    try {

      const TOKEN = `Bearer ${sessionStorage.getItem("token")}`;
    
      const config = {
        headers: {
          Authorization: TOKEN,
          "Content-Type": "application/json", // Specify JSON content type
        },
      };
  
      const response = await axios.get(`${BASE_URL}/boatOwners`, { params },config);
  console.log(response)
      return response.data; // ✅ Return the response data
    } catch (error) {
      console.error("Error fetching yacht owners:", error);
      throw error;
    }
  };