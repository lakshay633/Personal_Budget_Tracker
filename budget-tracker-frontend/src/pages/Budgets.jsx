import React from "react";
import styled from "styled-components";
import BudgetList from "../components/budgets/BudgetList";

const Wrap = styled.div`
  padding: 24px;
`;

export default function Budgets() {
  return (
    <Wrap>
      <h2>Budgets</h2>
      <p>Set monthly budgets by category and monitor spending against them.</p>
      <BudgetList />
    </Wrap>
  );
}
