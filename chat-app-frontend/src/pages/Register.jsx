import { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let temp = {};

    if (!form.name) temp.name = "Name is required";

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
      await axios.post("/auth/register", form);
      toast.success("Registration successful");
      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed"
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
          Register
        </Typography>

        <TextField
          fullWidth
          label="Name"
          margin="normal"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          error={!!errors.name}
          helperText={errors.name}
        />

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
          Register
        </Button>

        <Typography mt={2} align="center">
          Already have an account?{" "}
          <Link to="/">Login</Link>
        </Typography>
      </Paper>
    </Box>
  );
}
