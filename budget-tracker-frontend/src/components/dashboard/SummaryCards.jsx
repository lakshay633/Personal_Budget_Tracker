import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchTransactions } from "../../api/transactions";

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


//SummaryCards component to show income, expense, balance summary cards..
export default function SummaryCards() {
  //State variables
  const [loading, setLoading] = useState(false);
  //Income, expense, balance
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [balance, setBalance] = useState(0);

  //Load summary data
  const load = async () => {
    setLoading(true);
    try {
      //fetch all transactions
      const res = await fetchTransactions({ limit: 1000 });
      //Handle both paginated and non-paginated responses, Always get an array: results → data → []
      const data = res.data.results ?? res.data ?? [];
      //Calculate income, expense, balance
      let inc = 0, exp = 0;
      //Iterate through transactions
      for (const t of data) {
        const amt = Number(t.amount) || 0;
        if ((t.type || "").toLowerCase() === "income") inc += amt;
        else exp += amt;
      }
      //Update state
      setIncome(inc);
      setExpense(exp);
      setBalance(inc - exp);
    } catch (err) {
      console.error("Summary load failed", err);
    } finally {
      setLoading(false);
    }
  };

  //Load summary on component mount once
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
        </Card>
      </Wrap>
    </>
  );
}
