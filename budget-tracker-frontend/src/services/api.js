import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000", // backend root (no /api)
});

// Attach token to every request if available
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token"); // we store SimpleJWT "access" token here
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });
API.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token"); // expected to be SimpleJWT "access"
    if (token && typeof token === "string") {
      const parts = token.split(".");
      const looksLikeJwt = parts.length === 3 && parts[0] && parts[2];
      if (looksLikeJwt) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // remove bad tokens so we stop sending invalid headers
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
      }
    }
  } catch (e) {
    // if anything goes wrong, just proceed without auth header
  }
  return config;
});

// Auth APIs (note the new refresh path name 'tokenrefresh' used by your teammate)
export const registerUser = (data) => API.post("/auth/register/", data);
export const loginUser = (data) => API.post("/auth/login/", data);
export const refreshToken = (data) => API.post("/auth/tokenrefresh/", data);

// Transaction APIs
export const getTransactions = () => API.get("/transactions/");
export const postTransaction = (data) => API.post("/transactions/", data);
export const deleteTransaction = (id) => API.delete(`/transactions/${id}/`);

// Budget APIs
export const getBudget = () => API.get("/budgets/");
export const postBudget = (data) => API.post("/budgets/create/", data);

// Reports API
export const getReports = () => API.get("/transactions/reports/");

export default API;
