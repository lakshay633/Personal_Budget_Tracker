import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Typography, Box } from "@mui/material";
import { getReports } from "../services/api";
import {
  setReports,
  setLoading,
  setError,
} from "../features/transactions/transactionSlice";
import ChartDisplay from "../components/ChartDisplay";

function Reports() {
  const dispatch = useDispatch();
  const { reports, loading, error } = useSelector(
    (state) => state.transactions
  );

  useEffect(() => {
    const fetchReports = async () => {
      dispatch(setLoading(true));
      try {
        const response = await getReports();
        dispatch(setReports(response.data));
      } catch (err) {
        dispatch(setError("Failed to load reports"));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchReports();
  }, [dispatch]);

  return (
    <Container maxWidth="lg">
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Spending Reports
        </Typography>
        {loading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        {reports && <ChartDisplay data={reports} />}
      </Box>
    </Container>
  );
}

export default Reports;
