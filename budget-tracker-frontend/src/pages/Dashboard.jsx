import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Typography, Box, Grid } from "@mui/material";
import { getTransactions } from "../services/api";
import {
  setTransactions,
  setLoading,
  setError,
} from "../features/transactions/transactionSlice";
import TransactionForm from "../components/TransactionForm";

function Dashboard() {
  const dispatch = useDispatch();
  const { transactions, loading, error } = useSelector(
    (state) => state.transactions
  );

  // defensive: ensure we always map over an array
  const safeTransactions = Array.isArray(transactions) ? transactions : [];


  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
const response = await getTransactions();
// backend returns paginated response: { count, next, previous, results: [...] }
// choose the results array if present, otherwise accept plain array or fallback to []
const payload = Array.isArray(response.data)
  ? response.data
  : response.data && response.data.results
  ? response.data.results
  : [];
dispatch(setTransactions(payload));
      } catch (err) {
        dispatch(setError("Failed to load transactions"));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <Container maxWidth="lg">
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <TransactionForm />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6">Recent Transactions</Typography>
            {loading && <Typography>Loading...</Typography>}
            {error && <Typography color="error">{error}</Typography>}
            <Box mt={2}>
{safeTransactions.map((tx) => (
  <Box
    key={tx.id}
    mb={1}
    p={2}
    border="1px solid #ccc"
    borderRadius={2}
  >
    <Typography>
      {tx.date} - {tx.category} - ₹{tx.amount} ({tx.type})
    </Typography>
  </Box>
))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Dashboard;
