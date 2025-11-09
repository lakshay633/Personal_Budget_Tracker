import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/common/ProtectedRoute"; //Restricts access to authenticated users only..
import Layout from "./components/common/Layout"; //Common layout wrapper for protected pages..
import Welcome from "./pages/Welcome"; //Public welcome page..
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Reports from "./pages/Reports";

export default function App() {
  return (
    <Routes>
      {/*Public routes*/}
      {/*Landing route(Welcome page) for public*/}
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/*Protected routes with layout(require authentication)*/}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/*Transactions page*/}
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <Layout>
              <Transactions />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/*Budgets page*/}
      <Route
        path="/budgets"
        element={
          <ProtectedRoute>
            <Layout>
              <Budgets />
            </Layout>
          </ProtectedRoute>
        }
      />
      {/*Reports page*/}
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Layout>
              <Reports />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/*404 fallback route*/}
      <Route path="*" element={<h2>404 - Page Not Found</h2>} />
    </Routes>
  );
}
