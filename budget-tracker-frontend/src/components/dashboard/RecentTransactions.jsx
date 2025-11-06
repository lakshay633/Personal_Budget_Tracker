import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchTransactions } from "../../api/transactions";

const Wrap = styled.div`
  background: ${({ theme }) => theme.colors.card};
  padding: 14px;
  border-radius: 12px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

// const TitleRow = styled.div`
//   display:flex;
//   align-items:center;
//   justify-content:space-between;
//   margin-bottom: 12px;
// `;

const Title = styled.h4`
  margin: 0;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.primary};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

const Th = styled.th`
  text-align: left;
  padding: 8px 10px;
  color: #6b7280;
  font-weight: 600;
  border-bottom: 1px solid #eef2f7;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
`;

const Empty = styled.div`
  padding: 18px;
  color: #6b7280;
  text-align: center;
`;

export default function RecentTransactions({ max = 5 }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      // request most recent transactions - backend ordering assumed default (newest first)
      const res = await fetchTransactions({ limit: max, offset: 0 });
      const data = res.data?.results ?? res.data ?? [];
      setRows(data);
    } catch (e) {
      console.error("RecentTransactions load error:", e);
      setErr("Failed to load recent transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // optionally, you could subscribe to an event or poll to refresh
  }, []);

  return (
    <Wrap>
      {/* <TitleRow>
        <Title>Recent Transactions</Title>
      </TitleRow> */}

      {loading ? (
        <Empty>Loading...</Empty>
      ) : err ? (
        <Empty style={{ color: "red" }}>{err}</Empty>
      ) : rows.length === 0 ? (
        <Empty>No recent transactions</Empty>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Date</Th>
              <Th>Type</Th>
              <Th>Category</Th>
              <Th style={{ textAlign: "right" }}>Amount</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id}>
                <Td>{t.date}</Td>
                <Td style={{ textTransform: "capitalize" }}>{t.type}</Td>
                <Td>{t.category}</Td>
                <Td style={{ textAlign: "right" }}>{Number(t.amount).toFixed(2)}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Wrap>
  );
}
