//axios library instance with interceptors for auth handling  
import axios from "axios";

// Base URL from environment variable or default to localhost
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

// Create axios instance with base URL and JSON headers
const api = axios.create({
  //base url for all requests
  baseURL: API_BASE,
  // default headers for json content
  headers: {
    //all requests will have this header..
    "Content-Type": "application/json",
  },
});

//request interceptor to add Authorization header if token exists..
api.interceptors.request.use(

  // before request is sent
  (config) => {
    try {
      // get token from localStorage
      const token = localStorage.getItem("access"); //using SimpleJWT 'access'
      // if token exists, add Authorization header
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (e) {
      //Log any error during token retrieval
      console.log(e);
    }
    //return modified config
    return config;
  },
  (error) => Promise.reject(error)
);


//response interceptor to handle 401 errors globally..
api.interceptors.response.use(
  // on successful response
  (res) => res,
  // on response error
  (err) => {
    // extract status and request info
    const status = err?.response?.status;
    const req = err?.config || {};
    const url = req.url || "";

    //define auth-related paths that should not trigger redirect
    const authPaths = [
      "/",              // home or landing page 
      "/register/",
      "/tokenrefresh/",
      "/api/token/",    
      "/api/token/refresh/",
      "/login",
    ];

    //check if request url matches any auth-related paths
    const isAuthRequest = authPaths.some((p) => {
      try {
        //check for exact match or inclusion
        return url.endsWith(p) || url.includes(p);
      } catch {
        return false;
      }
    });

    // if 401 Unauthorized and not an auth-related request, redirect to login
    if (status === 401 && !isAuthRequest) {
      //Only perform global redirect for non-auth requests.
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      //Use location replace to avoid creating history entry.
      window.location.replace("/login");
      //Return a rejected promise.
      return Promise.reject(err);
    }

    //For other errors.
    return Promise.reject(err);
  }
);

export default api;
