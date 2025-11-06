import React, { useState } from "react";
import styled from "styled-components";
import { createBudget } from "../../api/budgets";

const FormContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  margin-bottom: 12px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
`;

const Button = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.accent};
  }
`;

export default function BudgetForm({ onAdd }) {
  const [form, setForm] = useState({ category: "", amount: "", month: "", year: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newBudget = await createBudget(form);
      onAdd(newBudget);
      setForm({ category: "", amount: "", month: "", year: "" });
      setError("");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create budget.");
    }
  };

  return (
    <FormContainer>
      <h3>Add Budget</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <Input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
        <Input name="amount" placeholder="Amount" type="number" value={form.amount} onChange={handleChange} required />
        <Input name="month" placeholder="Month (1-12)" type="number" value={form.month} onChange={handleChange} required />
        <Input name="year" placeholder="Year" type="number" value={form.year} onChange={handleChange} required />
        <Button type="submit">Add Budget</Button>
      </form>
    </FormContainer>
  );
}
