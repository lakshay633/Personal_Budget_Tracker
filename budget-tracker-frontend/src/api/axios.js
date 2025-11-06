// import axios from "axios";

// const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

// const api = axios.create({
//   baseURL: API_BASE,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // attach token automatically
// api.interceptors.request.use(
//   (config) => {
//     try {
//       const token = localStorage.getItem("access"); // using SimpleJWT 'access'
//       if (token) config.headers.Authorization = `Bearer ${token}`;
//     } catch (e) {
//       // ignore
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // response interceptor to handle 401 globally
// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 401) {
//       // token expired or unauthorized - remove tokens and redirect to login
//       localStorage.removeItem("access");
//       localStorage.removeItem("refresh");
//       // avoid push during some API calls; safe redirect:
//       window.location.href = "/login";
//     }
//     return Promise.reject(err);
//   }
// );

// export default api;

// src/api/axios.js
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

// response interceptor to handle 401 globally — but ignore auth endpoints so login can show errors.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const req = err?.config || {};
    const url = req.url || "";

    // list of auth endpoints where we want to allow the component to handle 401/400 responses
    const authPaths = [
      "/",               // your backend uses POST / for token obtain
      "/register/",
      "/tokenrefresh/",
      "/api/token/",     // common alternative
      "/api/token/refresh/",
      "/login",
    ];

    // helper: check if the request url ends with any auth path OR contains '/register' etc.
    const isAuthRequest = authPaths.some((p) => {
      try {
        // handle absolute and relative urls
        return url.endsWith(p) || url.includes(p);
      } catch {
        return false;
      }
    });

    if (status === 401 && !isAuthRequest) {
      // Only perform global redirect for non-auth requests.
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      // Use location replace to avoid creating history entry
      window.location.replace("/login");
      // return a rejected promise so caller can handle if needed
      return Promise.reject(err);
    }

    // For auth requests or other statuses, do not redirect; let the component handle it.
    return Promise.reject(err);
  }
);

export default api;
