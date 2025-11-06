import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Footer from "../components/common/Footer";

const Container = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #4e89ae, #ed6663);
  color: white;
  text-align: center;
  padding: 40px 20px;
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.2;
`;

const Tagline = styled.p`
  font-size: 18px;
  margin-bottom: 40px;
  max-width: 600px;
  line-height: 1.6;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled(Link)`
  background: white;
  color: ${({ theme }) => theme.colors.primary};
  padding: 12px 26px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.2s ease;
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
    color: white;
  }
`;

export default function Welcome() {
  return (
    <>
      <Container>
        <Title>Welcome to Budget Tracker</Title>
        <Tagline>
          Track your income, expenses, and budget goals — all in one place.
        </Tagline>
        <ButtonGroup>
          <Button to="/login">Login</Button>
          <Button to="/register">Register</Button>
        </ButtonGroup>
      </Container>

      {/* Footer below the full-screen container */}
      <Footer />
    </>
  );
}
