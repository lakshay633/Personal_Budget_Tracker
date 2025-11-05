import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  transactions: [], // array of transaction objects
  budgets: [],
  reports: {},
  loading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactions(state, action) {
      // Expect action.payload to be an array of transactions
      state.transactions = Array.isArray(action.payload) ? action.payload : [];
    },
    addTransaction(state, action) {
      // Prepend the new transaction so it appears at the top
      if (!state.transactions) state.transactions = [];
      state.transactions = [action.payload, ...state.transactions];
    },
    setBudgets(state, action) {
      state.budgets = action.payload;
    },
    setReports(state, action) {
      state.reports = action.payload;
    },
    setLoading(state, action) {
      state.loading = !!action.payload;
    },
    setError(state, action) {
      state.error = action.payload || null;
    },
    clearTransactions(state) {
      state.transactions = [];
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
  clearTransactions,
} = transactionSlice.actions;

export default transactionSlice.reducer;
