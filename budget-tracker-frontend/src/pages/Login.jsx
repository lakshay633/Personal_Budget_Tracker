import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginSuccess } from "../features/auth/authSlice";
import { loginUser } from "../services/api";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailIcon from "@mui/icons-material/Email";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

const handleLogin = async () => {
  try {
    // call backend login (SimpleJWT) which returns { access, refresh }
    const response = await loginUser({ email, password });

    if (!response || !response.data) {
      setError("Login failed: no response from server.");
      return;
    }

    const { access, refresh } = response.data;

    if (!access) {
      setError("Login failed: access token not returned.");
      return;
    }

    // Save tokens to localStorage (access stored under 'token' because api interceptor reads 'token')
    localStorage.setItem("token", access);
    if (refresh) localStorage.setItem("refresh", refresh);

    // Update redux state (store token)
    dispatch(loginSuccess({ token: access }));

    // Clear any error and navigate to dashboard
    setError("");
    navigate("/dashboard", { replace: true });
  } catch (err) {
    console.error("Login error:", err);
    if (err.response && err.response.data) {
      const data = err.response.data;
      if (data.detail) setError(data.detail);
      else if (data.error) setError(JSON.stringify(data.error));
      else setError("Login failed. Check credentials.");
    } else {
      setError("Login failed. Check network connection.");
    }
  }
};


  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Box sx={{ width: "450px", mx: "auto" }}>
        <Box
          sx={{
            p: 4,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: 3,
            borderRadius: 2,
            bgcolor: "background.paper",
          }}
        >
          <Box
            sx={{
              backgroundColor: "primary.main",
              borderRadius: "50%",
              p: 1,
              mb: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LockOutlinedIcon sx={{ color: "white", fontSize: 40 }} />
          </Box>
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            Login
          </Typography>
          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            sx={{ mt: 2 }}
          >
            Login
          </Button>
          <Box mt={2}>
            <Typography variant="body2">
              New user?{" "}
              <Link
                to="/register"
                style={{ textDecoration: "none", color: "#1976d2" }}
              >
                Register here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;
