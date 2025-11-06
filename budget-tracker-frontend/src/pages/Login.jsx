// src/pages/Login.jsx
import React, { useState } from "react";
import styled from "styled-components";
import useAuth from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../components/common/Footer";

/* Styled components */
const Container = styled.div`
  min-height: 100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  background: linear-gradient(135deg, #4e89ae, #ed6663);
  padding: 20px;
`;

const Card = styled.div`
  width: 420px;
  background: ${({ theme }) => theme.colors.card};
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.6s ease;
`;

const Title = styled.h2` margin-bottom: 20px; color: ${({ theme }) => theme.colors.primary}; text-align:center; `;
const Input = styled.input`
  width:100%;
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 15px;
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; box-shadow: 0 0 0 2px rgba(78,137,174,0.12); }
`;
const Button = styled.button`
  width:100%;
  padding: 12px;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { background: ${({ theme }) => theme.colors.accent}; transform: translateY(-1px); }
`;
const FooterText = styled.div` margin-top: 16px; text-align:center; font-size:14px; color:#666; a{ color:#4e89ae; text-decoration:none; &:hover{text-decoration:underline;} }`;

/* Error alert + close */
const ErrorAlert = styled.div`
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
  text-align: left;
  position: relative;
`;

const CloseBtn = styled.button`
  position: absolute;
  right: 8px;
  top: 6px;
  background: transparent;
  border: none;
  color: #7f1d1d;
  font-size: 18px;
  cursor: pointer;
  line-height: 1;
`;

/* Helper to format backend errors into a readable string */
function parseBackendError(data) {
  if (!data) return "Login failed. Please try again.";
  if (typeof data === "string") return data;
  if (Array.isArray(data)) return data.join(" ");
  if (typeof data === "object") {
    // common DRF patterns: { "detail": "..." } or { "non_field_errors": ["..."] } or field errors
    if (data.detail) return String(data.detail);
    if (data.non_field_errors) return Array.isArray(data.non_field_errors) ? data.non_field_errors.join(" ") : String(data.non_field_errors);
    // collect field errors
    const parts = [];
    Object.entries(data).forEach(([key, val]) => {
      if (!val) return;
      let msg;
      if (Array.isArray(val)) msg = val.join(" ");
      else if (typeof val === "object") msg = JSON.stringify(val);
      else msg = String(val);
      const label = key === "non_field_errors" ? "" : `${key}: `;
      parts.push(label + msg);
    });
    if (parts.length) return parts.join(" ");
  }
  return "Login failed. Please check your credentials.";
}

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // persistent until user closes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // clear previous
    try {
      await login({ email, password });
      nav("/dashboard");
    } catch (err) {
      // log for debugging
      console.error("Login error raw:", err);
      const data = err?.response?.data;
      // network error / no response
      if (!err.response) {
        setError("Network error: please check your connection.");
      } else {
        const msg = parseBackendError(data);
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container>
        <Card>
          {error && (
            <ErrorAlert role="alert" aria-live="polite">
              {error}
              <CloseBtn aria-label="Dismiss error" onClick={() => setError("")}>×</CloseBtn>
            </ErrorAlert>
          )}

          <Title>Login to your account</Title>
          <form onSubmit={handleSubmit}>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              required
              aria-label="Email"
            />
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              required
              aria-label="Password"
            />
            <Button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
          </form>
          <FooterText>
            Don't have an account? <Link to="/register">Register</Link>
          </FooterText>
        </Card>
      </Container>
      <Footer />
    </>
  );
}
