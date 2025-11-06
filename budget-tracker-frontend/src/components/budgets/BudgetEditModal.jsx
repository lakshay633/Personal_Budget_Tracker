import React, { useState } from "react";
import styled from "styled-components";
import { updateBudget } from "../../api/budgets";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  width: 400px;
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

export default function BudgetEditModal({ budget, onClose, onSave }) {
  const [form, setForm] = useState({ ...budget });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updated = await updateBudget(budget.id, form);
    onSave(updated);
    onClose();
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h3>Edit Budget</h3>
        <form onSubmit={handleSubmit}>
          <Input name="category" value={form.category} onChange={handleChange} required />
          <Input name="amount" type="number" value={form.amount} onChange={handleChange} required />
          <Input name="month" type="number" value={form.month} onChange={handleChange} required />
          <Input name="year" type="number" value={form.year} onChange={handleChange} required />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button type="submit">Save</Button>
            <Button type="button" onClick={onClose} style={{ background: "gray" }}>Cancel</Button>
          </div>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
}
