import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import AuthNavbar from "../components/AuthNavbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const hasSpecialChar = (password) =>
    /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const submit = async () => {
    const err = {};

    if (!email) err.email = "Email required";
    if (!password) err.password = "Password required";

    setErrors(err);
    if (Object.keys(err).length) return;

    if (!isValidEmail(email)) {
      setToast({
        open: true,
        message: "Enter a valid email address",
        severity: "error",
      });
      return;
    }

    if (!hasSpecialChar(password)) {
      setToast({
        open: true,
        message: "Password must contain at least one special character",
        severity: "error",
      });
      return;
    }

    try {
      const res = await api.post("/users/login", { email, password });
      localStorage.setItem("token", res.data.data.token);

      
      if ("Notification" in window && Notification.permission === "default") {
        await Notification.requestPermission();
      }

      setToast({
        open: true,
        message: "Login successful",
        severity: "success",
      });

      setTimeout(() => navigate("/dashboard"), 1000);
    } catch {
      setToast({
        open: true,
        message: "Invalid email or password",
        severity: "error",
      });
    }
  };

  return (
    <>
      <AuthNavbar />

      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#f3f4f6",
        }}
      >
        <Paper elevation={3} sx={{ width: 380, p: 4, borderRadius: 2 }}>
          <Typography variant="h5" fontWeight={600} textAlign="center" mb={3}>
            Login
          </Typography>

          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />

          <Button
            fullWidth
            size="large"
            variant="contained"
            sx={{ mt: 3 }}
            onClick={submit}
          >
            Login
          </Button>

          <Typography mt={3} textAlign="center" fontSize={14}>
            Don’t have an account?{" "}
            <span
              style={{ color: "#1976d2", cursor: "pointer", fontWeight: 500 }}
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </Typography>
        </Paper>
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={2000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
