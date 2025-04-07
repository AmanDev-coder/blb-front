import axios from "axios";
import { FETCH_OWNER_PAYOUTS_SUCCESS, FETCH_OWNER_YACHTS_SUCCESS, FETCH_REQUEST, FETCH_SINGLE_YACHTOWNER_SUCCESS } from "../actionType";




const BASE_URL = import.meta.env.VITE_API_BASE_URL;



export const getYachtOwnerById =  (ownerId) =>async(dispatch)=> {
  dispatch({type:FETCH_REQUEST})
  const TOKEN =`Bearer ${sessionStorage.getItem("token")}`; // Replace with your actual token

  const config = {
    headers: {
      Authorization: TOKEN,
      "Content-Type": "application/json",
    },
  };
     try {
       const response = await axios.get(`${BASE_URL}/boatOwners/${ownerId}`,{},config);
       dispatch({type:FETCH_SINGLE_YACHTOWNER_SUCCESS,payload:response.data})

       return response.data;
     } catch (error) {
       console.error("Error fetching yacht owner:", error);
       throw error.response?.data || { message: "Failed to fetch yacht owner" };
     }
   };

export const updateYachtOwner =  (ownerId, updateData) =>async(dispatch)=> {
  dispatch({type:FETCH_REQUEST})
  const TOKEN =`Bearer ${sessionStorage.getItem("token")}`; // Replace with your actual token

  const config = {
    headers: {
      Authorization: TOKEN,
      "Content-Type": "application/json",
    },
  };
  
     try {
       const response = await axios.patch(`${BASE_URL}/boatOwners/update/${ownerId}`, updateData,config);
       console.log(response.data)
       return response.data;
     } catch (error) {
       console.error("Error updating yacht owner:", error);
       throw error.response?.data || { message: "Failed to update yacht owner" };
     }
   };


   export const deleteYachtOwner =  (ownerId)  =>async(dispatch)=>{
     dispatch({type:FETCH_REQUEST})
     const TOKEN =`Bearer ${sessionStorage.getItem("token")}`; // Replace with your actual token

     const config = {
       headers: {
         Authorization: TOKEN,
         "Content-Type": "application/json",
       },
     };
    try {
       const response = await axios.delete(`${BASE_URL}/admin/yacht-owners/${ownerId}`,{},config);
       return response.data;
     } catch (error) {
       console.error("Error deleting yacht owner:", error);
       throw error.response?.data || { message: "Failed to delete yacht owner" };
     }
   };


   export const getOwnerYachts =  (ownerId)=>async (dispatch) => {
     dispatch({type:FETCH_REQUEST});
   
     try {
       const TOKEN =`Bearer ${sessionStorage.getItem("token")}`; // Replace with your actual token
   
       const config = {
         headers: {
           Authorization: TOKEN,
           "Content-Type": "application/json",
         },
       };
       
       const [boatsResponse, imagesResponse] = await Promise.all([
          axios.post(`${BASE_URL}/boats/owner/${ownerId}`, {}, config),
         axios.get(`${BASE_URL}/images`),
       ]);
   
       const boats = boatsResponse.data.yachts;
       const images = imagesResponse.data.data;
      //  console.log(boats, images);
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
       console.log(yachtsWithImages)
       dispatch({type:FETCH_OWNER_YACHTS_SUCCESS,payload:yachtsWithImages});
   return yachtsWithImages
   
     } catch (err) {
       console.error("Error:", err);
     }
   };
   

 // Ensure this is set in .env

export const getYachtOwnersPayouts =  (params={}) =>async(dispatch)=> {
  try {
    const TOKEN =`Bearer ${sessionStorage.getItem("token")}`; // Replace with your actual token

    const config = {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json",
      },
    };
    const response = await axios.get(`${BASE_URL}/payouts`, {params, ...config});
console.log(response) 
dispatch({type:FETCH_OWNER_PAYOUTS_SUCCESS,payload: response.data.data});

    return response.data; // Returns the list of payouts
  } catch (error) {
    console.error("Error fetching payouts:", error.response?.data?.message || error.message);
    throw error;
  }
};


export const updatePayoutStatus =  (payoutId, newStatus, txnId = "", reference = "") =>async (dispatch)=>{
  try {
    const response = await axios.patch(
      `${BASE_URL}/payouts/${payoutId}`,
      {
        status: newStatus, // "Approved", "Declined", "Paid", etc.
        txnId,
        reference,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token exists
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Returns updated payout details
  } catch (error) {
    console.error("Error updating payout status:", error.response?.data?.message || error.message);
    throw error;
  }
};