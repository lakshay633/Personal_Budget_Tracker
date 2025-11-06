// src/pages/Dashboard.jsx
import React from "react";
import styled from "styled-components";
import SummaryCards from "../components/dashboard/SummaryCards";
import RecentTransactions from "../components/dashboard/RecentTransactions";

const Wrap = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export default function Dashboard() {
  return (
    <Wrap>
      <h1>Dashboard</h1>
      <SummaryCards />
      <h3>Recent Transactions</h3>
      <RecentTransactions max={5} />
    </Wrap>
  );
}
