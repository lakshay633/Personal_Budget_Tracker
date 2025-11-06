import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token automatically
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("access"); // using SimpleJWT 'access'
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (e) {
      // ignore
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// response interceptor to handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // token expired or unauthorized - remove tokens and redirect to login
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      // avoid push during some API calls; safe redirect:
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
