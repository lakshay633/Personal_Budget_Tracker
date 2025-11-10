// src/components/transactions/TransactionList.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  fetchTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../../api/transactions";
import TransactionForm from "./TransactionForm";

const Wrap = styled.div` padding: 18px; `;
const Toolbar = styled.div` display:flex; gap:12px; align-items:center; margin-bottom:12px; flex-wrap:wrap; `;
const Input = styled.input` padding:8px; border-radius:8px; border:1px solid #e5e7eb; `;
const Select = styled.select` padding:8px; border-radius:8px; border:1px solid #e5e7eb; `;
const Table = styled.table` width:100%; border-collapse: collapse; background: white; border-radius:8px; overflow:hidden; box-shadow:${({theme})=>theme.shadow};`;
const Th = styled.th` text-align:left; padding:12px; border-bottom:1px solid #eef2f7; font-weight:600; `;
const Td = styled.td` padding:12px; border-bottom:1px solid #f3f4f6; `;
const Actions = styled.div` display:flex; gap:8px; `;
const Button = styled.button`
  padding:6px 10px; border-radius:8px; border:none; cursor:pointer;
  background: ${({ danger, theme }) => (danger ? "#ef4444" : theme.colors.primary)}; color: white;
`;

export default function TransactionList() {
  //States
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  //filters and pagination
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  // const [search, setSearch] = useState("");
  //Pagination
  const [limit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);

  //Transaction form visibility and editing state
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  //Load transactions from API with filters and pagination, if there are any otherwise load all the transactions 
  const load = async () => {
    //Set loading state
    setLoading(true);
    try {
      //Build params
      const params = { limit, offset };
      //Add filters if any
      if (typeFilter) params.type = typeFilter;
      if (categoryFilter) params.category = categoryFilter;
      // if (search) params.search = search;
      //Fetch transactions
      const res = await fetchTransactions(params);
      //Set transactions and count based on response
      if (res.data.results) {
        //Paginated response
        setTransactions(res.data.results);
        setCount(res.data.count || res.data.results.length);
      } else {
        //Non-paginated response
        setTransactions(res.data);
        setCount(res.data.length);
      }
    } catch (err) {
      console.error("Failed to load transactions", err);
      alert("Could not fetch transactions");
    } finally { setLoading(false); }
  };

  //Load transactions on component mount once and when filters/pagination change
  useEffect(() => { load(); }, [offset, typeFilter, categoryFilter]);

  const handleAdd = async (payload) => {
    try {
      //Add transaction
      await createTransaction(payload);
      //Close form and reload list
      setShowForm(false);
      setOffset(0);
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to add");
    }
  };

  const handleUpdate = async (payload) => {
    try {
      //Update transaction
      await updateTransaction(editing.id, payload);
      //Close form and reload list
      setShowForm(false);
      setEditing(null);
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    }
  };

  const handleDelete = async (id) => {
    //Confirm deletion
    if (!confirm("Delete this transaction?")) return;
    try {
      //Delete transaction
      await deleteTransaction(id);
      load();
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  return (
    <Wrap>
      <Toolbar>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}>+ New</Button>
        <Select value={typeFilter} onChange={(e)=>setTypeFilter(e.target.value)}>
          <option value="">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </Select>
        <Input placeholder="Category" value={categoryFilter} onChange={(e)=>setCategoryFilter(e.target.value)} />
        {/* <Input placeholder="Search notes/ category" value={search} onChange={(e)=>setSearch(e.target.value)} /> */}
        <Button onClick={()=>{ setOffset(0); load(); }}>Apply</Button>
      </Toolbar>

      {loading ? <p>Loading...</p> : (
        <Table>
          <thead>
            <tr>
              <Th>Date</Th><Th>Type</Th><Th>Category</Th><Th>Amount</Th><Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 && <tr><Td colSpan={5}>No transactions found</Td></tr>}
            {transactions.map(t => (
              <tr key={t.id}>
                <Td>{t.date}</Td>
                <Td>{t.type}</Td>
                <Td>{t.category}</Td>
                <Td>{t.amount}</Td>
                <Td>
                  <Actions>
                    <Button onClick={()=>{ setEditing(t); setShowForm(true); }}>Edit</Button>
                    <Button danger onClick={()=>handleDelete(t.id)}>Delete</Button>
                  </Actions>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* pagination simple */}
      <div style={{ marginTop: 12, display:"flex", justifyContent:"space-between" }}>
        <div>Showing {transactions.length} / {count}</div>
        <div style={{ display:"flex", gap:8 }}>
          <button disabled={offset === 0} onClick={()=>setOffset(Math.max(0, offset - limit))}>Prev</button>
          <button disabled={transactions.length < limit} onClick={()=>setOffset(offset + limit)}>Next</button>
        </div>
      </div>

      {showForm && (
        <TransactionForm
          initial={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSave={(form) => editing ? handleUpdate(form) : handleAdd(form)}
        />
      )}
    </Wrap>
  );
}
