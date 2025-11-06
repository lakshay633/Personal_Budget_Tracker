// src/hooks/useAuth.js
import { useState, useEffect } from "react";
import { loginRequest, registerRequest } from "../api/auth";
import api from "../api/axios";

export default function useAuth() {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // helper to check token existence
  const isTokenPresent = () => {
    try {
      return !!localStorage.getItem("access");
    } catch {
      return false;
    }
  };

  const [isAuthenticated, setIsAuthenticated] = useState(isTokenPresent());

  useEffect(() => {
    // update auth state when localStorage changes in the same tab
    const handleStorage = () => {
      setIsAuthenticated(isTokenPresent());
      try {
        const raw = localStorage.getItem("user");
        setUser(raw ? JSON.parse(raw) : null);
      } catch {
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorage);
    // also set it on mount
    handleStorage();

    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const login = async ({ email, password }) => {
    const res = await loginRequest({ email, password });
    const { access, refresh, user: userData } = res.data || {};
    if (access) localStorage.setItem("access", access);
    if (refresh) localStorage.setItem("refresh", refresh);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } else {
      // if backend doesn't return user object, still set a basic user record
      const basic = { email };
      localStorage.setItem("user", JSON.stringify(basic));
      setUser(basic);
    }
    setIsAuthenticated(true);
    return res;
  };

  const register = async (payload) => {
    const res = await registerRequest(payload);
    return res;
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    // navigate out of hook; component should redirect or we can force
    window.location.href = "/login";
  };

  return { user, isAuthenticated, login, register, logout };
}
