// src/pages/Transactions.jsx
import React from "react";
import TransactionList from "../components/transactions/TransactionList";
import styled from "styled-components";

const Wrapper = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

export default function Transactions() {
  return (
    <Wrapper>
      <Title>Your Transactions</Title>
      <TransactionList />
    </Wrapper>
  );
}
