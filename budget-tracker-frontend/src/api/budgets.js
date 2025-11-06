import api from "./axios";

export const getBudgets = async () => {
  const res = await api.get("/budgets/");
  return res.data;
};

export const createBudget = async (budgetData) => {
  const res = await api.post("/budgets/create/", budgetData);
  return res.data;
};

export const updateBudget = async (id, data) => {
  const res = await api.put(`/budgets/${id}/`, data);
  return res.data;
};

export const deleteBudget = async (id) => {
  const res = await api.delete(`/budgets/${id}/`);
  return res.data;
};
