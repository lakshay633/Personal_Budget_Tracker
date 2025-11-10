// src/pages/Reports.jsx
import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { getReports } from "../api/reports";
import { fetchTransactions } from "../api/transactions"; // fallback

// Chart.js + react wrapper
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Container = styled.div`
  padding: 32px;
  background: #f4f6f8;
  min-height: calc(100vh - 64px);
`;

const TitleRow = styled.div` display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; flex-wrap:wrap; `;
const Title = styled.h2` margin:0 0 10px 0; `;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 28px;
`;

const Card = styled.div`
  background: white;
  border-radius: 10px;
  padding: 18px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.06);
  text-align: center;
`;

const Label = styled.p` margin: 0; font-size: 14px; color: #6b7280; `;
const Value = styled.h3` margin: 10px 0 0; color: ${({ color }) => color || "#111"}; `;

const ChartsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 18px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 18px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.06);
`;

//Safely format numbers to 2 decimal places string
function safeFixed(n) {
  return (typeof n === "number" && !isNaN(n)) ? n.toFixed(2) : "0.00";
}

//Compute report data from transactions as a fallback
const computeFromTransactions = (txs) => {
  //Initialize totals
  let total_income = 0;
  let total_expense = 0;
  const by_category = {};
  const by_month = {};
  //Iterate through transactions
  for (const t of txs) {
    //Determine type and amount
    const type = String(t.type || "").toLowerCase();
    const amt = Number(t.amount) || 0;
    //Get year-month string
    let ym = "unknown";
    //Date parsing
    const dateStr = t.date || t.created_at || t.timestamp || "";
    if (dateStr) {
      const d = new Date(dateStr);
      //If date is valid, use it
      if (!isNaN(d)) ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      else {
        //Fallback parsing for YYYY-MM-DD format
        const parts = String(dateStr).split("-");
        if (parts.length >= 2) ym = `${parts[0]}-${String(parts[1]).padStart(2,"0")}`;
      }
    }
    //Creates a new month entry if not exists
    if (!by_month[ym]) by_month[ym] = { income: 0, expense: 0 };
    if (type === "income") {
      //Income transaction
      total_income += amt;
      by_month[ym].income += amt;
    } else {
      //Expense transaction
      total_expense += amt;
      by_month[ym].expense += amt;
      //By category accumulation
      const cat = String(t.category || "Uncategorized");
      //Initialize if not exists that category amount
      by_category[cat] = (by_category[cat] || 0) + amt;
    }
  }
  const net_savings = total_income - total_expense;
  return { total_income, total_expense, net_savings, by_category, by_month };
};

//Reports page component
export default function Reports() {
  //State variables
  const [report, setReport] = useState(null);
  const [computedFallback, setComputedFallback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //Load report data on component mount
  useEffect(() => {
    //Use a mounted flag to avoid setting state on unmounted component
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      setComputedFallback(false);
      try {
        //Try to fetch report from backend
        const data = await getReports();
        console.log("reports endpoint response:", data);
        //Check if data has totals, else fallback to transactions computation
        const hasTotals = data && (data.total_income !== undefined || data.total_expense !== undefined || data.net_savings !== undefined);
        if (hasTotals) {
          if (!mounted) return;
          setReport(data);
          setLoading(false);
          return;
        }
        //If no totals, fallback to computing from transactions
        const txRes = await fetchTransactions({ limit: 1000, offset: 0 });
        //Handle both paginated and non-paginated responses, Always get an array: results → data → []
        const txs = txRes.data?.results ?? txRes.data ?? [];
        //Compute report from transactions
        const comp = computeFromTransactions(txs);
        //Update state
        if (!mounted) return;
        setReport(comp);
        setComputedFallback(true);
      } catch (err) {
        console.error("Reports/transactions fetch error:", err);
        try {
          //On error, try fallback to computing from transactions
          const txRes = await fetchTransactions({ limit: 1000, offset: 0 });
          const txs = txRes.data?.results ?? txRes.data ?? [];
          const comp = computeFromTransactions(txs);
          if (!mounted) return;
          setReport(comp);
          setComputedFallback(true);
        } catch (err2) {
          //Fallback also failed, set error
          console.error("Transactions fallback also failed:", err2);
          if (!mounted) return;
          setError("Failed to load report data. Check backend or network (see console).");
        }
      } finally {
        //Always set loading to false
        if (mounted) setLoading(false);
      }
    };
    //Load on component mount
    load();
    //Cleanup function to set mounted to false on an unmount
    return () => { mounted = false; };
  }, []);

  //Using useMemo to compute chart datasets only when report changes..
  const byCategoryArray = useMemo(() => {
    //Transform by_category object to array of { category, value }
    const bc = report?.by_category || report?.byCategory || {};
    //Handle both array and object formats
    if (Array.isArray(bc)) {
      //Array handling (if any) 
      return bc.map((r) => ({ category: r.category || r.name || "Unknown", value: Number(r.value ?? r.total ?? 0) }));
    }
    //Taking object and returning sorted array of { category, value } in descending order
    return Object.entries(bc || {}).map(([k, v]) => ({ category: k, value: Number(v) || 0 }))
      .sort((a,b) => b.value - a.value);
  }, [report]);

  //Monthly data array
  const byMonthArray = useMemo(() => {
    //Transform by_month object to array of { month, income, expense }
    const bm = report?.by_month || report?.byMonth || {};
    if (Array.isArray(bm)) {
      //Array handling (if any)
      return bm.map(r => ({ month: r.month || "unknown", income: Number(r.income || 0), expense: Number(r.expense || 0) }));
    }
    //Taking object and returning sorted array of { month, income, expense } in ascending order
    return Object.entries(bm || {}).map(([k, v]) => ({ month: k, income: Number(v.income || 0), expense: Number(v.expense || 0) }))
      .sort((a,b) => a.month.localeCompare(b.month));
  }, [report]); //Only recompute when report changes

  //Pie chart data for expenses by category
  const pieData = useMemo(() => {
    //Prepare data for Pie chart
    const labels = byCategoryArray.map((r) => r.category);
    const data = byCategoryArray.map((r) => r.value);
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            "#06b6d4","#ef4444","#f59e0b","#10b981","#6366f1","#ec4899","#14b8a6","#f97316"
          ],
          hoverOffset: 6,
        }
      ]
    };
  }, [byCategoryArray]);

  //Bar chart data for monthly income vs expense
  const barData = useMemo(() => {
    //Prepare data for Bar chart
    const labels = byMonthArray.map((m) => m.month);
    const income = byMonthArray.map((m) => m.income);
    const expense = byMonthArray.map((m) => m.expense);
    return {
      labels,
      datasets: [
        { label: "Income", data: income, backgroundColor: "#10b981" },
        { label: "Expense", data: expense, backgroundColor: "#ef4444" },
      ],
    };
  }, [byMonthArray]);

  //Options for Pie chart
  const pieOptions = {
    responsive: true,
    plugins: {
      //Info about which color corresponds to which category
      legend: { position: "bottom" },
      //Effect on hover
      tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ₹${safeFixed(ctx.parsed)}` } },
    },
  };

  //Options for Bar chart
  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ₹${safeFixed(ctx.parsed.y || ctx.parsed)}` } },
    },
    //Axis options
    scales: {
      x: { stacked: false },
      y: { beginAtZero: true },
    },
  };

  if (loading) return <Container><p>Loading reports...</p></Container>;
  if (error) return <Container><p style={{ color: "red" }}>{error}</p></Container>;
  if (!report) return <Container><p>No report data available.</p></Container>;

  return (
    <Container>
      <TitleRow>
        <Title>Financial Reports</Title>{/*computedFallback ? "(computed from transactions)" : ""*/}
      </TitleRow>

      <SummaryGrid>
        <Card>
          <Label>Total Income</Label>
          <Value color="#16a34a">₹{safeFixed(report.total_income ?? (report.totalIncome ?? (report.total_income || 0)))}</Value>
        </Card>
        <Card>
          <Label>Total Expenses</Label>
          <Value color="#ef4444">₹{safeFixed(report.total_expense ?? (report.totalExpense ?? (report.total_expense || 0)))}</Value>
        </Card>
        <Card>
          <Label>Net Savings</Label>
          <Value color="#0284c7">₹{safeFixed(report.net_savings ?? (report.netSavings ?? ((report.total_income||0) - (report.total_expense||0))))}</Value>
        </Card>
      </SummaryGrid>

      <ChartsRow>
        <ChartCard>
          <h4 style={{ marginTop: 0 }}>Expenses by Category</h4>
          {byCategoryArray.length === 0 ? (
            <p style={{ color: "#9ca3af" }}>No category data</p>
          ) : (
            <div style={{ maxWidth: "100%", height: 340 }}>
              <Pie data={pieData} options={pieOptions} />
            </div>
          )}
        </ChartCard>

        <ChartCard>
          <h4 style={{ marginTop: 0 }}>Monthly Income vs Expense</h4>
          {byMonthArray.length === 0 ? (
            <p style={{ color: "#9ca3af" }}>No monthly data</p>
          ) : (
            <div style={{ width: "100%", height: 340 }}>
              <Bar data={barData} options={barOptions} />
            </div>
          )}
        </ChartCard>
      </ChartsRow>
    </Container>
  );
}
