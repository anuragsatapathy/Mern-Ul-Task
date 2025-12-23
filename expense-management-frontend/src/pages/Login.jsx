import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import AuthNavbar from "../components/AuthNavbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const submit = async () => {
    const err = {};
    if (!email) err.email = "Email required";
    if (!password) err.password = "Password required";
    setErrors(err);
    if (Object.keys(err).length) return;

    try {
      const res = await api.post("/users/login", { email, password });
      localStorage.setItem("token", res.data.data.token);
      navigate("/dashboard");
    } catch {
      setErrors({ password: "Invalid credentials" });
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
        <Paper
          elevation={3}
          sx={{
            width: 380,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" fontWeight={600} textAlign="center" mb={3}>
            Welcome Back
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
    </>
  );
}
