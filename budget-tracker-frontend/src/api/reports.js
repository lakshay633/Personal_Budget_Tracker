import api from "./axios";

// Fetch reports summary data
export const getReports = async (params = {}) => {
  const res = await api.get("/transactions/reports/", { params });
  return res.data;
};
