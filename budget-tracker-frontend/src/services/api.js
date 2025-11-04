import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api", // need to change this to backend URL
});

// Attach token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const registerUser = (data) => API.post("/register", data);
export const loginUser = (data) => API.post("/login", data);

// Transaction APIs
export const getTransactions = () => API.get("/transactions");
export const postTransaction = (data) => API.post("/transactions", data);

// Budget APIs
export const getBudget = () => API.get("/budget");
export const postBudget = (data) => API.post("/budget");

// Reports API
export const getReports = () => API.get("/reports");
