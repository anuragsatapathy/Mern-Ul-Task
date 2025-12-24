import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";
import api from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import AuthNavbar from "../components/AuthNavbar";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  // proper email
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const submit = async () => {
    const err = {};

    if (!form.name) err.name = "Name required";
    if (!form.email) err.email = "Email required";
    else if (!isValidEmail(form.email))
      err.email = "Enter a valid email address";

    if (!form.password) err.password = "Password required";

    setErrors(err);
    if (Object.keys(err).length) {
      setToast({
        open: true,
        message: "Please fix the errors above",
        severity: "error",
      });
      return;
    }

    try {
      await api.post("/users", form);

      setToast({
        open: true,
        message: "Registration successful",
        severity: "success",
      });

      setTimeout(() => navigate("/"), 1200);
    } catch {
      setToast({
        open: true,
        message: "Registration failed. Try again.",
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
          <Typography variant="h5" fontWeight={600} textAlign="center" mb={3}>
            Create Account
          </Typography>

          <TextField
            fullWidth
            label="Name"
            margin="normal"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name}
          />

          <TextField
            fullWidth
            label="Email"
            margin="normal"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
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
            Register
          </Button>

          <Typography mt={3} fontSize={14} textAlign="center">
            Already registered? <Link to="/">Login</Link>
          </Typography>
        </Paper>
      </Box>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={2000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
