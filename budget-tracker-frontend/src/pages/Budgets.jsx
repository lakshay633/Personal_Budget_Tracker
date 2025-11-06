import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getBudgets } from "../api/budgets";
import BudgetForm from "../components/budgets/BudgetForm";
import BudgetList from "../components/budgets/BudgetList";

const Container = styled.div`
  padding: 40px;
  background: #f4f6f8;
  min-height: 100vh;
`;

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBudgets = async () => {
    try {
      const data = await getBudgets();
      setBudgets(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleAdd = (newBudget) => {
    setBudgets((prev) => [newBudget, ...prev]);
  };

  const handleDelete = (id) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  const handleUpdate = (updatedBudget) => {
    setBudgets((prev) =>
      prev.map((b) => (b.id === updatedBudget.id ? updatedBudget : b))
    );
  };

  return (
    <Container>
      <h2>Manage Budgets</h2>
      <BudgetForm onAdd={handleAdd} />
      {loading ? <p>Loading...</p> : <BudgetList budgets={budgets} onDelete={handleDelete} onUpdate={handleUpdate} />}
    </Container>
  );
}
