import api from "./axios";

/*
 Backend login endpoint in your backend zip is at POST / (root),
 which returns access and refresh tokens (SimpleJWT).
 Adjust paths here if your backend uses /login or /api/token/.
*/

export const loginRequest = (credentials) =>
  api.post("/", credentials); // expected {email, password}

export const registerRequest = (payload) =>
  api.post("/register/", payload);

export const refreshToken = (refresh) =>
  api.post("/tokenrefresh/", { refresh });
