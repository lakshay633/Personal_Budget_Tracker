// src/components/budgets/BudgetEditModal.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { updateBudget } from "../../api/budgets";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
`;

const Content = styled.div`
  background: white;
  padding: 24px;
  border-radius: 10px;
  width: 420px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
`;

const Field = styled.div` margin-bottom: 12px; `;
const Label = styled.label` display:block; font-size: 13px; color: #374151; margin-bottom: 6px; `;
const Input = styled.input` width:100%; padding:10px; border-radius:6px; border:1px solid #ddd; `;

const ButtonRow = styled.div` display:flex; justify-content:flex-end; gap:8px; margin-top:8px; `;
const Button = styled.button`
  background: ${({ primary, theme }) => (primary ? theme.colors.primary : "#ccc")};
  color: ${({ primary }) => (primary ? "white" : "#111")};
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
`;

export default function BudgetEditModal({ budget, onClose, onSave }) {
  const [form, setForm] = useState({ ...budget });
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm({ ...budget }); }, [budget]);

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // keep existing behaviour: call API here and return the updated object via onSave
      const updated = await updateBudget(budget.id, form);
      onSave(updated);
      onClose();
    } catch (err) {
      console.error("Update budget failed", err);
      alert("Failed to update budget");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Overlay>
      <Content role="dialog" aria-modal="true" aria-label="Edit budget">
        <h3 style={{ marginTop: 0 }}>Edit Budget</h3>
        <form onSubmit={handleSubmit}>
          <Field>
            <Label>Category</Label>
            <Input name="category" value={form.category} onChange={handleChange} required />
          </Field>

          <Field>
            <Label>Amount</Label>
            <Input name="amount" type="number" value={form.amount} onChange={handleChange} required />
          </Field>

          <Field>
            <Label>Month</Label>
            <Input name="month" type="number" value={form.month} onChange={handleChange} required />
          </Field>

          <Field>
            <Label>Year</Label>
            <Input name="year" type="number" value={form.year} onChange={handleChange} required />
          </Field>

          <ButtonRow>
            <Button type="button" onClick={onClose} disabled={saving}>Cancel</Button>
            <Button primary type="submit" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </ButtonRow>
        </form>
      </Content>
    </Overlay>
  );
}
