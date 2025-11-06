import React, { useState } from "react";
import styled from "styled-components";
import { deleteBudget } from "../../api/budgets";
import { FaTrash, FaEdit } from "react-icons/fa";
import BudgetEditModal from "./BudgetEditModal";

const ListContainer = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  padding: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    padding: 12px;
    border-bottom: 1px solid #eee;
  }
  th {
    text-align: left;
    background: #f9f9f9;
  }
  td:last-child {
    text-align: right;
  }
`;

export default function BudgetList({ budgets, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(null);
  console.log("Budgets data:", budgets);
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      await deleteBudget(id);
      onDelete(id);
    }
  };

  return (
    <ListContainer>
      <h3>Budgets Overview</h3>
      {budgets.length === 0 ? (
        <p>No budgets added yet.</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Month</th>
              <th>Year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((b) => (
              <tr key={b.id}>
                <td>{b.category}</td>
                <td>{b.amount}</td>
                <td>{b.month}</td>
                <td>{b.year}</td>
                <td>
                  <FaEdit style={{ cursor: "pointer", marginRight: 10 }} onClick={() => setEditing(b)} />
                  <FaTrash style={{ cursor: "pointer", color: "red" }} onClick={() => handleDelete(b.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {editing && (
        <BudgetEditModal
          budget={editing}
          onClose={() => setEditing(null)}
          onSave={(updated) => onUpdate(updated)}
        />
      )}
    </ListContainer>
  );
}
