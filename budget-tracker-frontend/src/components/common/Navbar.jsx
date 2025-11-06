// src/components/common/Navbar.jsx
import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Header = styled.header`
  height: var(--header-height, 64px);
  min-height: var(--header-height, 64px);
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  z-index: 30;
`;

const Brand = styled.h1` font-size: 20px; margin: 0; `;
const NavLinks = styled.nav` display:flex; gap:18px; align-items:center; `;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 10px;
  border-radius: 6px;

  &:hover {
    background: rgba(255,255,255,0.06);
  }
`;

const PlainButton = styled.button`
  background: ${({ theme }) => theme.colors.accent};
  border: none;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
`;

export default function Navbar(){
  const { isAuthenticated, logout } = useAuth();

  return (
    <Header>
      <Brand>Budget Tracker</Brand>
      <NavLinks>
        {!isAuthenticated ? (
          // public links for visitors
          <>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        ) : (
          // protected links for logged-in users
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/transactions">Transactions</NavLink>
            <NavLink to="/budget">Budget</NavLink>
            <NavLink to="/reports">Reports</NavLink>
            <PlainButton onClick={logout}>Logout</PlainButton>
          </>
        )}
      </NavLinks>
    </Header>
  );
}
