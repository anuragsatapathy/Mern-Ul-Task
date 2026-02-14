import { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import toast from "react-hot-toast";
import { connectSocket } from "../context/SocketContext";


export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let temp = {};

    if (!form.email) temp.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      temp.email = "Invalid email format";

    if (!form.password) temp.password = "Password is required";
    else if (form.password.length < 6)
      temp.password = "Minimum 6 characters required";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
            try {
            const res = await axios.post("/auth/login", form);

            localStorage.setItem("token", res.data.data.token);
            localStorage.setItem("userId", res.data.data.user._id);
            connectSocket();

            toast.success("Login successful");
            navigate("/chat");
            } catch (err) {

      toast.error(
        err.response?.data?.message || "Invalid credentials"
      );
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper sx={{ p: 4, width: 400 }} elevation={3}>
        <Typography variant="h5" mb={3} align="center">
          Login
        </Typography>

        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          error={!!errors.email}
          helperText={errors.email}
        />

        <TextField
          fullWidth
          type="password"
          label="Password"
          margin="normal"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          error={!!errors.password}
          helperText={errors.password}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleSubmit}
        >
          Login
        </Button>

        <Typography mt={2} align="center">
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </Typography>
      </Paper>
    </Box>
  );
}
