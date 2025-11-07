import api from "./axios";

export const loginRequest = (credentials) =>
  api.post("/", credentials); // expected {email, password}

export const registerRequest = (payload) =>
  api.post("/register/", payload);

export const refreshToken = (refresh) =>
  api.post("/tokenrefresh/", { refresh });
