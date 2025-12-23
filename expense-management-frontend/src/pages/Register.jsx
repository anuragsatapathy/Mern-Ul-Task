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
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    const err = {};
    if (!form.name) err.name = "Name required";
    if (!form.email) err.email = "Email required";
    if (!form.password) err.password = "Password required";
    setErrors(err);
    if (Object.keys(err).length) return;

    await api.post("/users", form);
    setOpen(true);

    setTimeout(() => navigate("/"), 1200);
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
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={!!errors.password}
            helperText={errors.password}
          />

          <Button fullWidth size="large" variant="contained" sx={{ mt: 3 }} onClick={submit}>
            Register
          </Button>

          <Typography mt={3} fontSize={14} textAlign="center">
            Already registered? <Link to="/">Login</Link>
          </Typography>
        </Paper>
      </Box>

      <Snackbar open={open} autoHideDuration={2000}>
        <Alert severity="success" variant="filled">
          Registration successful
        </Alert>
      </Snackbar>
    </>
  );
}
