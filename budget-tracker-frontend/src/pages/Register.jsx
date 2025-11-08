import React, { useState } from "react";
import styled from "styled-components";
import useAuth from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../components/common/Footer";

/* Styled components (matched to Login.jsx) */
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

const Title = styled.h2`
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.primary};
  text-align:center;
`;

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

const FooterText = styled.div`
  margin-top: 16px;
  text-align:center;
  font-size:14px;
  color:#666;
  a{ color:#4e89ae; text-decoration:none; &:hover{text-decoration:underline;} }
`;

/* Error alert + close (same as Login.jsx) */
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

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // persistent until user closes or changes

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Local frontend validations
    if (!form.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!form.email.includes("@") || !form.email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (form.password !== form.password2) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (/^\d+$/.test(form.password)) {
      setError("Password cannot be entirely numeric.");
      return;
    }

    setLoading(true);
    try {
      await register(form);
      alert("Registration successful! Please login.");
      nav("/login");
    } catch (err) {
      console.error("Register error raw:", err);
      // Simplified: show existing-user message (or network issue)
      if (err?.message?.includes("Network")) {
        setError("Network error: please check your connection.");
      } else {
        setError("A user with this email already exists.");
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

          <Title>Create an Account</Title>
          <form onSubmit={handleSubmit}>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
            />
            <Input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password (min 8 characters)"
              required
            />
            <Input
              name="password2"
              type="password"
              value={form.password2}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Register"}
            </Button>
          </form>

          <FooterText>
            Already have an account? <Link to="/login">Login</Link>
          </FooterText>
        </Card>
      </Container>
      <Footer />
    </>
  );
}
