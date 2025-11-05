import React from "react";
import { Box, Typography } from "@mui/material";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ChartDisplay({ data }) {
  const { categoryTotals = {}, monthlyTotals = {} } = data;

  const barData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(categoryTotals),
        backgroundColor: "#1976d2",
      },
    ],
  };

  const lineData = {
    labels: Object.keys(monthlyTotals),
    datasets: [
      {
        label: "Monthly Spending",
        data: Object.values(monthlyTotals),
        borderColor: "#ff9800",
        fill: false,
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Expenses by Category
      </Typography>
      <Bar data={barData} />

      <Typography variant="h6" gutterBottom mt={4}>
        Monthly Spending Trends
      </Typography>
      <Line data={lineData} />
    </Box>
  );
}

export default ChartDisplay;
