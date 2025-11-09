// src/components/common/Navbar.jsx
import React from "react";
import styled from "styled-components";
// React Router Link for navigation
import { Link } from "react-router-dom";
// Custom hook to access authentication status and actions
import useAuth from "../../hooks/useAuth";

//Styled components for Navbar layout and styling
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

//Brand title styling
const Brand = styled.h1` font-size: 20px; margin: 0; `;
const NavLinks = styled.nav` display:flex; gap:18px; align-items:center; `;

//Styled Link component for navigation links
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

//Navbar component displaying different links based on authentication status
export default function Navbar(){
  //Get authentication status and logout function from custom hook(useAuth)..
  const { isAuthenticated, logout } = useAuth();

  return (
    <Header>
      <Brand>Budget Tracker</Brand>
      <NavLinks>
        {!isAuthenticated ? (
          //Public links for visitors
          <>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        ) : (
          //Protected links for logged-in users
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/transactions">Transactions</NavLink>
            <NavLink to="/budgets">Budget</NavLink>
            <NavLink to="/reports">Reports</NavLink>
            <PlainButton onClick={logout}>Logout</PlainButton>
          </>
        )}
      </NavLinks>
    </Header>
  );
}
