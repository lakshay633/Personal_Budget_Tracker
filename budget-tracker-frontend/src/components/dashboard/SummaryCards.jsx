import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchTransactions } from "../../api/transactions";
import TransactionForm from "../transactions/TransactionForm";

const Wrap = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.card};
  padding: 18px;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Value = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: ${({ color }) => color || "#111"};
`;

const Label = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.muted};
`;

const Controls = styled.div`
  display:flex;
  gap: 8px;
  align-items:center;
  justify-content:flex-end;
`;

const Button = styled.button`
  background: ${({ theme, primary }) => (primary ? theme.colors.primary : "#efefef")};
  color: ${({ primary }) => (primary ? "white" : "#111")};
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
`;

export default function SummaryCards({ onOpenNew }) {
  const [loading, setLoading] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      // fetch all transactions - if many items you may want an aggregate endpoint later
      const res = await fetchTransactions({ limit: 1000 }); // temporary large limit
      const data = res.data.results ?? res.data ?? [];
      let inc = 0, exp = 0;
      for (const t of data) {
        const amt = Number(t.amount) || 0;
        if ((t.type || "").toLowerCase() === "income") inc += amt;
        else exp += amt;
      }
      setIncome(inc);
      setExpense(exp);
      setBalance(inc - exp);
    } catch (err) {
      console.error("Summary load failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <>
      <Wrap>
        <Card>
          <Label>Total Income</Label>
          <Value color="#059669">₹{income.toFixed(2)}</Value>
        </Card>

        <Card>
          <Label>Total Expense</Label>
          <Value color="#ef4444">₹{expense.toFixed(2)}</Value>
        </Card>

        <Card>
          <Label>Balance</Label>
          <Value color={balance >= 0 ? "#0ea5a4" : "#ef4444"}>₹{balance.toFixed(2)}</Value>
          {/* <Controls>
            <Button onClick={() => { setShowForm(true); if (onOpenNew) onOpenNew(); }}>+ New</Button>
          </Controls> */}
        </Card>
      </Wrap>

      {showForm && (
        <TransactionForm
          onClose={() => { setShowForm(false); load(); }}
          onSave={async (form) => {
            // delegate adding to TransactionForm consumer (TransactionForm will call parent onSave)
            // We will assume parent saves through API; here we just close and reload
            setShowForm(false);
            await load();
          }}
        />
      )}
    </>
  );
}
