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
import { postTransaction } from "../services/api";
import {
  addTransaction,
  setError,
} from "../features/transactions/transactionSlice";

const categories = [
  "Salary",
  "Food",
  "Transport",
  "Entertainment",
  "Utilities",
  "Other",
];

function TransactionForm() {
  const dispatch = useDispatch();

  const [type, setType] = useState("income");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setLocalError] = useState("");

  const handleSubmit = async () => {
    if (!category || !amount || !date) {
      setLocalError("All fields are required");
      return;
    }

    try {
      const data = { type, category, amount: parseFloat(amount), date };
      const response = await postTransaction(data);
      dispatch(addTransaction(response.data));
      setSuccess("Transaction added!");
      setLocalError("");
      setCategory("");
      setAmount("");
      setDate("");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      dispatch(setError("Failed to add transaction"));
      setLocalError("Server error. Try again.");
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Add Transaction
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <TextField
        select
        label="Type"
        fullWidth
        margin="normal"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <MenuItem value="income">Income</MenuItem>
        <MenuItem value="expense">Expense</MenuItem>
      </TextField>
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
        label="Date"
        type="date"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSubmit}
      >
        Add Transaction
      </Button>
    </Box>
  );
}

export default TransactionForm;
