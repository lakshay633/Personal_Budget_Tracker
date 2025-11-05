//A helper function to create the redux store for the application
import { configureStore } from "@reduxjs/toolkit";
//Manages authentication state(login, logout, user info)
import authReducer from "../features/auth/authSlice";
//Manages transactions state(add, delete, fetch transactions)
import transactionsReducer from "../features/transactions/transactionSlice";

const store = configureStore({
  //reducer- An object use to map slice reducers to state keys
  reducer: {
    auth: authReducer,
    transactions: transactionsReducer,
  },
});
export default store;
