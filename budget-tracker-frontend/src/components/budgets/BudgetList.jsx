// src/components/budgets/BudgetList.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getBudgets, createBudget, updateBudget, deleteBudget } from "../../api/budgets";
import { fetchTransactions } from "../../api/transactions";
import BudgetForm from "./BudgetForm";
import BudgetEditModal from "./BudgetEditModal";

const Wrap = styled.div` padding: 16px; `;
const Toolbar = styled.div` display:flex; gap:12px; align-items:center; margin-bottom:12px; flex-wrap:wrap; `;
const NewBtn = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
`;

const Table = styled.table`
  width:100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow};
  th, td { padding: 12px; border-bottom: 1px solid #eef2f7; }
  th { text-align:left; font-weight:600; background: #fafafa; }
`;

const Actions = styled.div` display:flex; gap:8px; `;
const SmallBtn = styled.button`
  padding: 6px 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: white;
  background: ${({ danger, theme }) => (danger ? "#ef4444" : theme.colors.primary)};
  &:hover { transform: translateY(-1px); }
`;

const ErrorAlert = styled.div`
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 12px;
  text-align: left;
`;

const ProgressWrap = styled.div` width: 180px; `;
const ProgressBar = styled.div`
  height: 10px;
  border-radius: 6px;
  background: #f3f4f6;
  overflow: hidden;
`;
const ProgressFill = styled.div`
  height: 100%;
  width: ${({ pct }) => Math.max(0, Math.min(100, pct))}%;
  background: ${({ over }) => (over ? "#ef4444" : "#06b6d4")};
  transition: width 240ms ease;
`;

const OverBadge = styled.span`
  display:inline-block;
  background: #fee2e2;
  color:#b91c1c;
  padding:4px 8px;
  border-radius: 6px;
  font-weight:600;
  font-size: 13px;
`;

//BudgetList component
export default function BudgetList() {
  const [budgets, setBudgets] = useState([]);
  //Transactions to compute spent amounts
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);

  //Load budgets and recent transactions
  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      //Fetch budgets
      const bdata = await getBudgets();
      //Handle paginated or non-paginated response, Always get an array: results → data → []
      const budgetItems = Array.isArray(bdata) ? bdata : (bdata.results ?? []);
      //Set budgets state
      setBudgets(budgetItems);

      //Fetch all transactions to compute spent amounts
      const txRes = await fetchTransactions({ limit: 1000, offset: 0 });
      //Handle both paginated and non-paginated responses, Always get an array: results → data → []
      const txItems = txRes.data?.results ?? txRes.data ?? [];
      //Set transactions state
      setTransactions(txItems);
    } catch (err) {
      console.error("Failed to load budgets/transactions", err);
      setError("Could not fetch budgets or transactions. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  //Load budgets and transactions on component mount once
  useEffect(() => { loadAll(); }, []);

  //Compute spent amount for a budget based on its category, month, year
  const computeSpent = (budget) => {
    const cat = (budget.category || "").toLowerCase().trim();
    const m = Number(budget.month);
    const y = Number(budget.year);
    //Sum amounts from transactions matching category, month, year
    let sum = 0;
    //Iterate through transactions
    for (const t of transactions) {
      //Date parsing to get month and year
      const dateStr = t.date || t.created_at || t.timestamp || "";
      let txMonth = null, txYear = null;
      //Date parsing  
      if (dateStr) {
        try {
          //Month and year from Date object
          const d = new Date(dateStr);
          if (!isNaN(d)) {
            txMonth = d.getMonth() + 1;
            txYear = d.getFullYear();
          } else {
            //Fallback parsing for YYYY-MM-DD format
            const parts = String(dateStr).split("-");
            if (parts.length >= 2) {
              txYear = Number(parts[0]);
              txMonth = Number(parts[1]);
            }
          }
        } catch {
          //ignore
        }
      }
      //Skip if month/year don't match
      if (txMonth !== m || txYear !== y) continue;
      //Category match
      const tcat = (t.category || "").toLowerCase();
      const catMatches = cat === "" ? true : tcat.includes(cat);
      const isExpense = (t.type || "").toLowerCase() === "expense";
      if (catMatches && isExpense) {
        //Add amount to sum
        const amt = Number(t.amount) || 0;
        sum += amt;
      }
    }
    //Return sum
    return sum;
  };

  //Create budget
  const handleCreate = async (payload) => {
    try {
      //Create budget
      const created = await createBudget(payload);
      //Add created budget to state
      const item = created && created.id ? created : (created.results ? created.results[0] : created);
      //Update state
      setBudgets((p) => [item, ...p]);
      //Close form
      setShowCreate(false);
    } catch (err) {
      console.error("Create budget failed", err);
      setError(err.response?.data?.detail || "Failed to create budget.");
    }
  };

  //Update budget
  const handleUpdate = async (id, payload) => {
    try {
      const updated = await updateBudget(id, payload);
      //Update budget in state
      const item = updated && updated.id ? updated : updated;
      //If the id matches, update it in state
      setBudgets((p) => p.map((b) => (b.id === item.id ? item : b)));
      //Close edit modal
      setEditing(null);
    } catch (err) {
      console.error("Update failed", err);
      setError(err.response?.data?.detail || "Failed to update budget.");
    }
  };

  //Delete budget
  const handleDelete = async (id) => {
    //Confirm deletion
    if (!confirm("Delete this budget?")) return;
    try {
      await deleteBudget(id);
      //If the deletion is successful, remove from state by creating a new array without the deleted budget
      setBudgets((p) => p.filter((b) => b.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      setError("Failed to delete budget.");
    }
  };

  return (
    <Wrap>
      {error && <ErrorAlert>{error}</ErrorAlert>}
      <Toolbar>
        <NewBtn onClick={() => setShowCreate(true)}>+ New Budget</NewBtn>
      </Toolbar>

      {loading && <p>Loading...</p>}
      {!loading && budgets.length === 0 && <p>No budgets found</p>}

      {!loading && budgets.length > 0 && (
        <Table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Amount</th>
              <th>Spent</th>
              <th>Month</th>
              <th>Year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/*Loop through budgets and display them*/}
            {budgets.map((b) => {
              const spent = computeSpent(b);
              const budgetAmt = Number(b.amount) || 0;
              {/*Compute progress percentage*/}
              const pct = budgetAmt > 0 ? (spent / budgetAmt) * 100 : 0;
              const over = spent > budgetAmt;
              return (
                <tr key={b.id} style={over ? { background: "rgba(254,226,226,0.6)" } : {}}>
                  <td>{b.category}</td>
                  <td>₹{budgetAmt.toFixed(2)}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <ProgressWrap>
                        <ProgressBar>
                          <ProgressFill pct={Math.min(100, pct)} over={over} />
                        </ProgressBar>
                      </ProgressWrap>
                      <div style={{ minWidth: 80, textAlign: "right" }}>
                        ₹{spent.toFixed(2)} {over && <div><OverBadge>Over</OverBadge></div>}
                      </div>
                    </div>
                  </td>
                  <td>{String(b.month).padStart(2, "0")}</td>
                  <td>{b.year}</td>
                  <td>
                    <Actions>
                      <SmallBtn onClick={() => setEditing(b)}>Edit</SmallBtn>
                      <SmallBtn danger onClick={() => handleDelete(b.id)}>Delete</SmallBtn>
                    </Actions>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}

      {showCreate && (
        <BudgetForm
          onClose={() => setShowCreate(false)}
          onSave={handleCreate}
        />
      )}

      {editing && (
        <BudgetEditModal
          budget={editing}
          onClose={() => setEditing(null)}
          onSave={(updated) => handleUpdate(editing.id, updated)}
        />
      )}
    </Wrap>
  );
}
