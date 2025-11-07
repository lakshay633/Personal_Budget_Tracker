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

export default function BudgetList() {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]); // used to compute spent
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState(null);

  // Load budgets and recent transactions (we fetch a reasonably large set to compute monthly sums)
  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const bdata = await getBudgets();
      const budgetItems = Array.isArray(bdata) ? bdata : (bdata.results ?? []);
      setBudgets(budgetItems);

      // fetch transactions: get many records (client-side filter later). Using limit 1000 as pragmatic default
      const txRes = await fetchTransactions({ limit: 1000, offset: 0 });
      const txItems = txRes.data?.results ?? txRes.data ?? [];
      setTransactions(txItems);
    } catch (err) {
      console.error("Failed to load budgets/transactions", err);
      setError("Could not fetch budgets or transactions. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  // compute spent for a budget: sums expense transactions matching month, year, and category (case-insensitive)
  const computeSpent = (budget) => {
    const cat = (budget.category || "").toLowerCase().trim();
    const m = Number(budget.month);
    const y = Number(budget.year);
    // sum only expense type transactions (if your app treats negative amounts for expenses, adapt accordingly)
    let sum = 0;
    for (const t of transactions) {
      // dates might be "YYYY-MM-DD" or datetime — parse month/year safely
      const dateStr = t.date || t.created_at || t.timestamp || "";
      let txMonth = null, txYear = null;
      if (dateStr) {
        try {
          const d = new Date(dateStr);
          if (!isNaN(d)) {
            txMonth = d.getMonth() + 1;
            txYear = d.getFullYear();
          } else {
            // fallback: parse YYYY-MM-DD
            const parts = String(dateStr).split("-");
            if (parts.length >= 2) {
              txYear = Number(parts[0]);
              txMonth = Number(parts[1]);
            }
          }
        } catch {
          // ignore
        }
      }

      if (txMonth !== m || txYear !== y) continue;

      const tcat = (t.category || "").toLowerCase();
      // if budget.category is empty, count all matching month/year (unlikely)
      const catMatches = cat === "" ? true : tcat.includes(cat);
      const isExpense = (t.type || "").toLowerCase() === "expense";
      if (catMatches && isExpense) {
        const amt = Number(t.amount) || 0;
        sum += amt;
      }
    }
    return sum;
  };

  // handlers for create/update/delete — update state and reload necessary transactions
  const handleCreate = async (payload) => {
    try {
      const created = await createBudget(payload);
      const item = created && created.id ? created : (created.results ? created.results[0] : created);
      setBudgets((p) => [item, ...p]);
      setShowCreate(false);
      // optionally reload transactions if budgets creation affects anything — not necessary
    } catch (err) {
      console.error("Create budget failed", err);
      setError(err.response?.data?.detail || "Failed to create budget.");
    }
  };

  const handleUpdate = async (id, payload) => {
    try {
      const updated = await updateBudget(id, payload);
      const item = updated && updated.id ? updated : updated;
      setBudgets((p) => p.map((b) => (b.id === item.id ? item : b)));
      setEditing(null);
      // reload transactions might be unnecessary
    } catch (err) {
      console.error("Update failed", err);
      setError(err.response?.data?.detail || "Failed to update budget.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this budget?")) return;
    try {
      await deleteBudget(id);
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
            {budgets.map((b) => {
              const spent = computeSpent(b);
              const budgetAmt = Number(b.amount) || 0;
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
