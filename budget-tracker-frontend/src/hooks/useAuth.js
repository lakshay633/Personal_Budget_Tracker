import { useState, useEffect } from "react";
import { loginRequest, registerRequest } from "../api/auth";

//Custom hook to manage authentication state..
export default function useAuth() {
  // user state from localStorage..
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("user");
      //Convert json string to object..
      return raw ? JSON.parse(raw) : null;
      //If any error occurs during parsing, return null..
    } catch {
      return null;
    }
  });

  //helper function to check if token exists in localStorage..
  const isTokenPresent = () => {
    try {
      return !!localStorage.getItem("access");
    } catch {
      return false;
    }
  };

  //isAuthenticated state based on presence of token..
  const [isAuthenticated, setIsAuthenticated] = useState(isTokenPresent());

  useEffect(() => {
    //Function to handle storage events and update auth state accordingly..
    const handleStorage = () => {
      //Update isAuthenticated based on token presence..
      setIsAuthenticated(isTokenPresent());
      try {
        //Retrieve and parse user data from localStorage..
        const raw = localStorage.getItem("user");
        //Update user state..
        setUser(raw ? JSON.parse(raw) : null);
      } catch {
        //In case of error, set user to null..
        setUser(null);
      }
    };
    //Listen for storage events to sync auth state across tabs...
    window.addEventListener("storage", handleStorage);
    //Initial check on component mount..
    handleStorage();

    //Cleanup event listener on component unmount..
    return () => window.removeEventListener("storage", handleStorage);
  }, []);//([] means it run only once on the first render.. )

  //Function to handle user login..
  const login = async ({ email, password }) => {
    //Make login request to backend..
    const res = await loginRequest({ email, password });
    //Extract access, refresh, and user data from response..`
    const { access, refresh, user: userData } = res.data || {};
    //Store tokens and user data in localStorage..
    if (access) localStorage.setItem("access", access);
    if (refresh) localStorage.setItem("refresh", refresh);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    } else {
      //If user data is not provided, store basic info..
      const basic = { email };
      localStorage.setItem("user", JSON.stringify(basic));
      setUser(basic);
    }
    //Update isAuthenticated state..
    setIsAuthenticated(true);
    //Return the full response..
    return res;
  };

  //Function to handle user registration..
  const register = async (payload) => {
    //Make registration request to backend..
    const res = await registerRequest(payload);
    //Return the full response..
    return res;
  };

  //Function to handle user logout..
  const logout = () => {
    //Clear tokens and user data from localStorage..
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    //Reset user and isAuthenticated state..
    setUser(null);
    setIsAuthenticated(false);
    //Redirect to login page..
    window.location.href = "/login";
  };

  //Return auth state and functions..
  return { user, isAuthenticated, login, register, logout };
}
