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

// const Card = styled.div`
//   width: 420px;
//   background: #ffffff;
//   padding: 40px 36px;
//   border-radius: 18px;
//   box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
//   animation: fadeIn 0.6s ease;

//   @keyframes fadeIn {
//     from {
//       opacity: 0;
//       transform: translateY(-10px);
//     }
//     to {
//       opacity: 1;
//       transform: translateY(0);
//     }
//   }
// `;
const Card = styled.div`
  width: 400px;
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(2,6,23,0.12);
  transform-origin: center;
  animation: authCardIn 520ms cubic-bezier(.22,.9,.35,1);

  @keyframes authCardIn {
    0% {
      opacity: 0;
      transform: translateY(18px) scale(0.992);
    }
    60% {
      opacity: 1;
      transform: translateY(-6px) scale(1.006);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* Respect user preference for reduced motion */
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transform: none;
  }
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

const ErrorText = styled.p`
  color: #e11d48;
  margin: 10px 0 0;
  font-size: 14px;
  text-align: center;
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
    transition: color 0.2s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.accent};
      text-decoration: underline;
    }
  }
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

    if (form.password !== form.password2) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await register(form);
      nav("/login");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.email?.[0] ||
          err.response?.data?.detail ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Container>
      <Card>
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
        {error && <ErrorText>{error}</ErrorText>}
        <FooterText>
          Already have an account? <Link to="/login">Login</Link>
        </FooterText>
      </Card>
    </Container>
    <Footer />
    </>
  );
}
