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
  transition: 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    //Local frontend validations

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
  setError("A user with this email already exists.");
}finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container>
        <Card>
          {error && <ErrorAlert>{error}</ErrorAlert>}

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

          <p style={{ textAlign: "center", marginTop: 16 }}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </Card>
      </Container>
      <Footer />
    </>
  );
}
