import React from 'react'
import {  Navigate, useLocation, useNavigate } from 'react-router-dom';

export const PrivateRoutes = ({children }) => {
 
  const navigate=useNavigate()

  const location =useLocation()
  const token =sessionStorage.getItem("token")
  const user = sessionStorage.getItem("user");
  if(!token&&location.pathname=="/adminn"){
    return <Navigate to= "/adminLogin" state={{ from: location.pathname }} replace/>
  
    }
  if(!token){
  return <Navigate to= "/auth" state={{ from: location.pathname }} replace/>
  }
  
  // if (allowedRoles && !allowedRoles.includes(user.role)) {
  //   // Redirect to an unauthorized page if role is not allowed
  //   return <Navigate to="/unauthorized" replace state={{ from: location.pathname }}/>;
  // }

  return children;

}