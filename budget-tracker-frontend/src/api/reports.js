import api from "./axios";

//Reports API calls
export const getReports = async (params = {}) => {
  //Make GET request to fetch reports with optional query parameters
  const res = await api.get("/transactions/reports/", { params });
  //Return report data
  return res.data;
};
