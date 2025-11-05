import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { postBudget } from "../services/api";
import {
  setBudgets,
  setError,
} from "../features/transactions/transactionSlice";

const categories = ["Food", "Transport", "Entertainment", "Utilities", "Other"];

function BudgetForm() {
  const dispatch = useDispatch();

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setLocalError] = useState("");

  const handleSubmit = async () => {
    if (!category || !amount || !month || !year) {
      setLocalError("All fields are required");
      return;
    }

    try {
      const data = {
        category,
        amount: parseFloat(amount),
        month,
        year,
      };
      const response = await postBudget(data);
      dispatch(setBudgets(response.data));
      setSuccess("Budget set successfully!");
      setLocalError("");
      setCategory("");
      setAmount("");
      setMonth("");
      setYear("");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      dispatch(setError("Failed to set budget"));
      setLocalError("Server error. Try again.");
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Set Monthly Budget
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <TextField
        select
        label="Category"
        fullWidth
        margin="normal"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {categories.map((cat) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Amount"
        type="number"
        fullWidth
        margin="normal"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <TextField
        label="Month"
        type="number"
        fullWidth
        margin="normal"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />
      <TextField
        label="Year"
        type="number"
        fullWidth
        margin="normal"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSubmit}
      >
        Set Budget
      </Button>
    </Box>
  );
}

export default BudgetForm;
