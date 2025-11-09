import React from "react";
import { Navigate } from "react-router-dom";

//Protected route component to restrict access based on authentication
const ProtectedRoute = ({ children }) => {
  //Check for token in localStorage
  const token = localStorage.getItem("access");
  //If no token, redirect to login page
  if (!token) return <Navigate to="/login" replace />;
  //If token exists, render child components(Protected pages)..
  return children;
};

export default ProtectedRoute;
