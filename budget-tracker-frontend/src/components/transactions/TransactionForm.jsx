// src/components/transactions/TransactionForm.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(2,6,23,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
`;

const Card = styled.div`
  width: 420px;
  background: ${({ theme }) => theme.colors.card};
  padding: 20px;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const Title = styled.h3` margin: 0 0 12px; `;
const Row = styled.div` display:flex; gap:10px; margin-bottom:10px; `;
const Label = styled.label` font-size:13px; color:#374151; `;
const Input = styled.input`
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const ButtonRow = styled.div` display:flex; gap:10px; justify-content:flex-end; margin-top:12px; `;
const Button = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background: ${({ primary, theme }) => (primary ? theme.colors.primary : "#efefef")};
  color: ${({ primary }) => (primary ? "white" : "#111")};
`;

export default function TransactionForm({ initial = null, onClose, onSave }) {
  const [form, setForm] = useState({
    type: "expense",
    category: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    if (initial) {
      setForm({
        type: initial.type || "expense",
        category: initial.category || "",
        amount: initial.amount || "",
        date: initial.date || new Date().toISOString().slice(0, 10),
      });
    }
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // basic validation
    if (!form.amount || Number(form.amount) <= 0) {
      alert("Enter a valid amount");
      return;
    }
    if (!form.category) {
      alert("Enter a category");
      return;
    }
    onSave(form);
  };

  return (
    <Backdrop onClick={onClose}>
      <Card onClick={(e) => e.stopPropagation()}>
        <Title>{initial ? "Edit Transaction" : "New Transaction"}</Title>
        <form onSubmit={handleSubmit}>
          <Row>
            <div style={{ flex: 1 }}>
              <Label>Type</Label>
              <Select name="type" value={form.type} onChange={handleChange}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </Select>
            </div>
            <div style={{ flex: 1 }}>
              <Label>Date</Label>
              <Input name="date" type="date" value={form.date} onChange={handleChange} />
            </div>
          </Row>

          <div style={{ marginBottom: 10 }}>
            <Label>Category</Label>
            <Input name="category" value={form.category} onChange={handleChange} placeholder="e.g., Food, Salary" />
          </div>

          <div style={{ marginBottom: 10 }}>
            <Label>Amount</Label>
            <Input name="amount" type="number" value={form.amount} onChange={handleChange} placeholder="0.00" />
          </div>

          <ButtonRow>
            <Button type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" primary>{initial ? "Update" : "Add"}</Button>
          </ButtonRow>
        </form>
      </Card>
    </Backdrop>
  );
}
