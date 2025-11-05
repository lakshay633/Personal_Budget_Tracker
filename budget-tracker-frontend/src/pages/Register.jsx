import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EmailIcon from "@mui/icons-material/Email";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [password2, setPassword2] = useState("");

const handleRegister = async () => {
  // client-side validation before hitting backend
  if (!name || !email || !password || !password2) {
    setError("All fields are required.");
    return;
  }

  if (password.length < 8) {
    setError("Password must be at least 8 characters long.");
    return;
  }

  if (password === password.toLowerCase() || password === password.toUpperCase()) {
    // simple heuristic: encourage mixed case (optional)
    // not required by backend, but helps avoid weak passwords
  }

  if (password !== password2) {
    setError("Passwords do not match.");
    return;
  }

  try {
    setError("");
    await registerUser({ name, email, password, password2 });
    // on success you may redirect to login or auto-login depending on backend behavior
    setSuccess("Registration successful! You can now log in.");
    navigate("/", { replace: true });
    // clear inputs (optional)
    setName("");
    setEmail("");
    setPassword("");
    setPassword2("");
  } catch (err) {
    // backend may return structured error; display friendly message
    if (err.response && err.response.data) {
      const data = err.response.data;
      // try to extract validation messages
      if (data.error) {
        // your backend wraps errors in an "error" object per your earlier example
        const e = data.error;
        // prefer first available message
        const msg =
          (e.password && e.password.join(" ")) ||
          (e.password2 && e.password2.join(" ")) ||
          (e.email && e.email.join(" ")) ||
          JSON.stringify(e);
        setError(msg || "Registration failed.");
      } else if (data.password) {
        setError(data.password.join(" "));
      } else {
        setError("Registration failed. Please try again.");
      }
    } else {
      setError("Registration failed. Please check your connection.");
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
      <Box sx={{ width: "450px" }}>
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
            <PersonAddIcon sx={{ color: "white", fontSize: 40 }} />
          </Box>
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            Register
          </Typography>
          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
              {success}
            </Alert>
          )}
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
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
                    <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
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
            onClick={handleRegister}
            sx={{ mt: 2 }}
          >
            Register
          </Button>
          <Box mt={2}>
            <Typography variant="body2">
              Already have an account?{" "}
              <Link to="/" style={{ textDecoration: "none", color: "#1976d2" }}>
                Login here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Register;
