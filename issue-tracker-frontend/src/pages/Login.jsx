import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      window.location.href = "/issues";
    } catch (err) {
      alert("Invalid email or password");
    }
  };

  return (
    <Box
      sx={{
        width: 320,
        margin: "120px auto",
        padding: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "#fff",
        textAlign: "center",
      }}
    >
      <Typography variant="h5" mb={2}>
        Login
      </Typography>

      <TextField
        fullWidth
        label="Email"
        margin="normal"
        value={email}
        error={!!errors.email}
        helperText={errors.email}
        onChange={(e) => {
          setEmail(e.target.value);
          setErrors({ ...errors, email: "" });
        }}
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        value={password}
        error={!!errors.password}
        helperText={errors.password}
        onChange={(e) => {
          setPassword(e.target.value);
          setErrors({ ...errors, password: "" });
        }}
      />

      <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={submit}>
        Login
      </Button>

      <Typography mt={2} fontSize={14}>
        Don’t have an account?{" "}
        <Link to="/register" style={{ textDecoration: "none", color: "#1976d2" }}>
          Register
        </Link>
      </Typography>
    </Box>
  );
}
