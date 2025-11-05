//helper function to create a slice for transaction state management from redux toolkit
import { createSlice } from "@reduxjs/toolkit";

//Note: The initial state defines the default values for the transaction state
const initialState = {
  transactions: [], //stores list of all transactions..
  budgets: [], //stores budget information...
  reports: {}, //stores report data...
  loading: false, //indicates if data is being loaded
  error: null, //stores error messages..
};

//Creating the transaction slice with reducers to handle various actions
const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    //Sets the list of transactions in the state
    setTransactions: (state, action) => {
      state.transactions = action.payload;
    },
    addTransaction: (state, action) => {
      state.transactions.push(action.payload); //Adds a new transaction to the list beacuse we don't want to reload the whole list we just want to append the existing data...
    },
    //Sets the list of budgets in the state...
    setBudgets: (state, action) => {
      state.budgets = action.payload;
    },
    setReports: (state, action) => {
      state.reports = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setTransactions,
  addTransaction,
  setBudgets,
  setReports,
  setLoading,
  setError,
} = transactionSlice.actions;

export default transactionSlice.reducer;
