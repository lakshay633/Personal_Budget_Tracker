import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Layout from "./components/common/Layout"; //add this import
import Welcome from "./pages/Welcome";
import Transactions from "./pages/Transactions";

// temporary placeholders for pages we’ll add later
const Budget = () => <h2>Budget Page (Coming Soon)</h2>;
const Reports = () => <h2>Reports Page (Coming Soon)</h2>;

export default function App() {
  return (
    <Routes>
      {/*Auth routes*/}
      <Route path="/login" element={
        <Login />} />
      <Route path="/register" element={
        <Register />} />

      {/*Redirect root to dashboard */}
      <Route path="/" element={<Welcome />} />

      {/* Protected pages with layout */}
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

      <Route
        path="/budget"
        element={
          <ProtectedRoute>
            <Layout>
              <Budget />
            </Layout>
          </ProtectedRoute>
        }
      />

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
      <Route 
        path="/transactions"
  element={
    <ProtectedRoute>
      <Layout>
        <Transactions/>
      </Layout>
    </ProtectedRoute>
  }
  />

      {/* 404 Fallback (optional) */}
      <Route path="*" element={<h2>404 - Page Not Found</h2>} />
    </Routes>
  );
}
