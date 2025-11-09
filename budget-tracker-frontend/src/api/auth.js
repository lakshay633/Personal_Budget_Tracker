import api from "./axios";

//Auth API calls
export const loginRequest = (credentials) =>
  api.post("/", credentials); //expected {email, password}

//Register API call
export const registerRequest = (payload) =>
  api.post("/register/", payload);

export const refreshToken = (refresh) =>
  api.post("/tokenrefresh/", { refresh });
