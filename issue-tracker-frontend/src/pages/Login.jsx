import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const submit = async () => {
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

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 2 }}
        onClick={submit}
      >
        Login
      </Button>

      <Typography mt={2} fontSize={14}>
        Don’t have an account?{" "}
        <Link
          to="/register"
          style={{ textDecoration: "none", color: "#1976d2" }}
        >
          Register
        </Link>
      </Typography>
    </Box>
  );
}
