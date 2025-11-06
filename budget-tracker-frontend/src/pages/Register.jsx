import React, { useState } from "react";
import styled from "styled-components";
import useAuth from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../components/common/Footer";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4e89ae, #ed6663);
  padding: 20px;
`;

const Card = styled.div`
  width: 420px;
  background: #ffffff;
  padding: 40px 36px;
  border-radius: 18px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.6s ease;
`;

const Title = styled.h2`
  margin: 0 0 25px;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  font-weight: 600;
  font-size: 26px;
`;

const Input = styled.input`
  width: 100%;
  margin-bottom: 18px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  font-size: 15px;
  background: #f9fafb;
  transition: 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(78, 137, 174, 0.2);
    background: #fff;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 16px;
  font-weight: 500;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const FooterText = styled.div`
  margin-top: 18px;
  text-align: center;
  font-size: 14px;
  color: #6b7280;

  a {
    color: #4e89ae;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorAlert = styled.div`
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
  text-align: left;
`;

// helper to turn various backend error shapes into a readable message
function parseBackendError(data) {
  if (!data) return "Registration failed. Please try again.";
  if (typeof data === "string") return data;
  if (Array.isArray(data)) return data.join(" ");
  if (typeof data === "object") {
    // collect messages from keys
    const parts = [];
    Object.entries(data).forEach(([key, val]) => {
      if (!val) return;
      let msg;
      if (Array.isArray(val)) msg = val.join(" ");
      else if (typeof val === "object") msg = JSON.stringify(val);
      else msg = String(val);
      // friendly key labels
      const label = key === "non_field_errors" ? "" : `${key}: `;
      parts.push(label + msg);
    });
    return parts.join(" ");
  }
  return "Registration failed. Please check your details.";
}

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

    if (form.password !== form.password2) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register(form);
      nav("/login");
    } catch (err) {
      console.error(err);
      const data = err.response?.data;
      const message = parseBackendError(data);
      setError(message);
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
              placeholder="Password"
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
