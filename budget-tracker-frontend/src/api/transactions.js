import api from "./axios";

/*
 Backend endpoints expected:
 GET  /transactions/          -> list (supports ?limit=&offset=&type=&category=&search=)
 POST /transactions/          -> create { type, category, amount, date }
 GET  /transactions/:id/      -> retrieve
 PUT  /transactions/:id/      -> update
 DELETE /transactions/:id/    -> delete
*/

//Transaction API calls
export const fetchTransactions = (params = {}) =>
  //Make GET request to fetch transactions with optional query parameters
  api.get("/transactions/", { params });

  //Create a new transaction
export const createTransaction = (payload) =>
  //Make POST request to create transaction
  api.post("/transactions/", payload);

  //Update an existing transaction by ID
export const updateTransaction = (id, payload) =>
  //Make PUT request to update transaction
  api.put(`/transactions/${id}/`, payload);

//Delete a transaction by ID
  export const deleteTransaction = (id) =>
  api.delete(`/transactions/${id}/`);

  //Retrieve a single transaction by ID
export const getTransaction = (id) =>
  api.get(`/transactions/${id}/`);
