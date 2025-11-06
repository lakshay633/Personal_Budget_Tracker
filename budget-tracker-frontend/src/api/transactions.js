// src/api/transactions.js
import api from "./axios";

/*
 Backend endpoints expected:
 GET  /transactions/          -> list (supports ?limit=&offset=&type=&category=&search=)
 POST /transactions/          -> create { type, category, amount, date }
 GET  /transactions/:id/      -> retrieve
 PUT  /transactions/:id/      -> update
 DELETE /transactions/:id/    -> delete
*/

export const fetchTransactions = (params = {}) =>
  api.get("/transactions/", { params });

export const createTransaction = (payload) =>
  api.post("/transactions/", payload);

export const updateTransaction = (id, payload) =>
  api.put(`/transactions/${id}/`, payload);

export const deleteTransaction = (id) =>
  api.delete(`/transactions/${id}/`);

export const getTransaction = (id) =>
  api.get(`/transactions/${id}/`);
