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
  background: linear-gradient(135deg, #4e89ae, #ed66);
  padding: 20px;
`;

// const Card = styled.div`
//   width: 400px;
//   background: white;
//   padding: 40px;
//   border-radius: 16px;
//   box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
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
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 15px;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(78, 137, 174, 0.2);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: ${({ theme }) => theme.colors.accent};
    transform: translateY(-1px);
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
    transition: color 0.2s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.accent};
      text-decoration: underline;
    }
  }
`;


export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      nav("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/*login section */}
      <Container>
        <Card>
          <Title>Login to your account</Title>
          <form onSubmit={handleSubmit}>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              required
            />
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <FooterText>
            Don’t have an account? <Link to="/register">Register</Link>
          </FooterText>
        </Card>
      </Container>
      <Footer />
    </>
  );
}
