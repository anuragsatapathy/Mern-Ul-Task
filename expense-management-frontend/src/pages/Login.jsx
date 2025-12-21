import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  AppBar,
  Toolbar,
  Snackbar,
  Alert,
} from "@mui/material";
import api from "../api/api";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({ open: false, msg: "", type: "error" });
  const navigate = useNavigate();

  
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/home");
    }
  }, [navigate]);

  const submit = async () => {
    if (!email || !password) {
      setToast({ open: true, msg: "Email and password required", type: "error" });
      return;
    }

    try {
      const res = await api.post("/users/login", { email, password });
      localStorage.setItem("token", res.data.data.token);
      navigate("/home");
    } catch {
      setToast({ open: true, msg: "Invalid credentials", type: "error" });
    }
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: "center" }}>
          <Typography variant="h6">Expense Management System</Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          width: 360,
          margin: "120px auto",
          padding: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h5" mb={2} textAlign="center">
          Login
        </Typography>

        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={submit}>
          Login
        </Button>

        <Typography mt={2} fontSize={14} textAlign="center">
          Don’t have an account? <Link to="/register">Register</Link>
        </Typography>
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.type} variant="filled">
          {toast.msg}
        </Alert>
      </Snackbar>
    </>
  );
}
