import api from "./axios";

//Budget API calls
export const getBudgets = async () => {
  //Make GET request to fetch budgets
  const res = await api.get("/budgets/");
  //Return budget data
  return res.data;
};

//Create a new budget
export const createBudget = async (budgetData) => {
  //Make POST request to create budget
  const res = await api.post("/budgets/create/", budgetData);
  //Return created budget data
  return res.data;
};

//Update an existing budget by ID
export const updateBudget = async (id, data) => {
  const res = await api.put(`/budgets/${id}/`, data);
  return res.data;
};

//Delete a budget by ID
export const deleteBudget = async (id) => {
  const res = await api.delete(`/budgets/${id}/`);
  return res.data;
};
