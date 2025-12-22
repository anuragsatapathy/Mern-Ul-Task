import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import api from "../api/api";
import { useNavigate, Link } from "react-router-dom";
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
      navigate("/home");
    } catch {
      setErrors({ password: "Invalid credentials" });
    }
  };

  return (
    <>
      <AuthNavbar />

      <Box sx={{ width: 360, mx: "auto", mt: 8 }}>
        <Typography variant="h5" mb={2} textAlign="center">
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

        <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={submit}>
          LOGIN
        </Button>

        <Typography mt={2} fontSize={14} textAlign="center">
          Don’t have an account? <Link to="/register">Register</Link>
        </Typography>
      </Box>
    </>
  );
}
