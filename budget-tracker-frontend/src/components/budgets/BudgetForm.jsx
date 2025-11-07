// src/components/budgets/BudgetForm.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Backdrop = styled.div`
  position: fixed; inset: 0;
  background: rgba(2,6,23,0.35);
  display:flex; align-items:center; justify-content:center; z-index:60;
`;

const Card = styled.div`
  width: 420px;
  background: ${({ theme }) => theme.colors.card};
  padding: 20px;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const Title = styled.h3` margin:0 0 12px; `;
const Row = styled.div` display:flex; gap:10px; margin-bottom:10px; `;
const Input = styled.input`
  width:100%; padding:8px 10px; border-radius:8px; border:1px solid #e5e7eb;
`;
const Label = styled.label` font-size:13px; color:#374151; display:block; margin-bottom:6px;`;

const ButtonRow = styled.div` display:flex; gap:10px; justify-content:flex-end; margin-top:12px; `;
const Button = styled.button`
  padding:8px 12px; border-radius:8px; border:none; cursor:pointer;
  background: ${({ primary, theme }) => (primary ? theme.colors.primary : "#efefef")};
  color: ${({ primary }) => (primary ? "white" : "#111")};
`;

export default function BudgetForm({ initial = null, onClose, onSave }) {
  const now = new Date();
  const [form, setForm] = useState({
    category: "",
    amount: "",
    month: String(now.getMonth() + 1).padStart(2, "0"),
    year: String(now.getFullYear()),
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (initial) setForm({
      category: initial.category || "",
      amount: initial.amount || "",
      month: String(initial.month || now.getMonth() + 1).padStart(2,"0"),
      year: String(initial.year || now.getFullYear()),
    });
  }, [initial]);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.category) { setError("Enter category"); return; }
    if (!form.amount || Number(form.amount) <= 0) { setError("Enter valid amount"); return; }
    onSave({
      category: form.category,
      amount: Number(form.amount),
      month: Number(form.month),
      year: Number(form.year),
    });
  };

  return (
    <Backdrop onClick={onClose}>
      <Card onClick={(ev) => ev.stopPropagation()}>
        <Title>{initial ? "Edit Budget" : "New Budget"}</Title>
        {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
        <form onSubmit={submit}>
          <div style={{ marginBottom: 8 }}>
            <Label>Category</Label>
            <Input name="category" value={form.category} onChange={handleChange} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <Label>Amount</Label>
            <Input name="amount" type="number" value={form.amount} onChange={handleChange} />
          </div>
          <Row>
            <div style={{ flex: 1 }}>
              <Label>Month</Label>
              <Input name="month" type="number" value={form.month} onChange={handleChange} />
            </div>
            <div style={{ flex: 1 }}>
              <Label>Year</Label>
              <Input name="year" type="number" value={form.year} onChange={handleChange} />
            </div>
          </Row>

          <ButtonRow>
            <Button type="button" onClick={onClose}>Cancel</Button>
            <Button primary type="submit">{initial ? "Update" : "Create"}</Button>
          </ButtonRow>
        </form>
      </Card>
    </Backdrop>
  );
}
