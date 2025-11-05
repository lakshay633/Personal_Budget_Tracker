//A helper function to create a slice for authentication state management from redux toolkit
import { createSlice } from "@reduxjs/toolkit";

//Note: The initial state defines the default values for the authentication state
const initialState = {
  user: null, //stores user information when logged in
  token: null, //stores authentication token
  isAuthenticated: false, //indicates if the user is logged in
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    //Handles successful login by updating user info, token, and authentication status
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    //Handles logout by clearing user info, token, and updating authentication status
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

//Exporting the action creators and reducer for use in the application
export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
