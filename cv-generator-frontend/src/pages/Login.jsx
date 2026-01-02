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

  const submit = async () => {
    const err = {};
    if (!email) err.email = "Email required";
    if (!password) err.password = "Password required";
    setErrors(err);
    if (Object.keys(err).length) return;

    // email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setToast({
        open: true,
        message: "Please enter a valid email address",
        severity: "error",
      });
      return;
    }

    // password validation
    if (!/[!@#$%^&*]/.test(password)) {
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

      setToast({
        open: true,
        message: "Login successful",
        severity: "success",
      });

      
      setTimeout(() => {
        navigate("/profile");
      }, 800);
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
        <Paper sx={{ width: 380, p: 4, borderRadius: 2 }}>
          <Typography
            variant="h5"
            fontWeight={600}
            textAlign="center"
            mb={3}
          >
            Login
          </Typography>

          <TextField
            fullWidth
            label="Email"
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            error={!!errors.password}
            helperText={errors.password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            fullWidth
            size="large"
            variant="contained"
            sx={{
              mt: 3,
              backgroundColor: "#ffb74d",
              color: "#000",
              fontWeight: 600,
              "&:hover": { backgroundColor: "#ffa726" },
            }}
            onClick={submit}
          >
            Login
          </Button>

          <Typography mt={2} textAlign="center">
            Don’t have an account?{" "}
            <span
              style={{ color: "#1976d2", cursor: "pointer" }}
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
