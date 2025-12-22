import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
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

    // show success toast
    setOpen(true);

    // redirect after short delay
    setTimeout(() => {
      navigate("/");
    }, 1200);
  };

  return (
    <>
      <AuthNavbar />

      <Box sx={{ width: 360, mx: "auto", mt: 8 }}>
        <Typography variant="h5" mb={2} textAlign="center">
          Register
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

        <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={submit}>
          REGISTER
        </Button>

        <Typography mt={2} fontSize={14} textAlign="center">
          Already registered? <Link to="/">Login</Link>
        </Typography>
      </Box>

      {/* Success Toast */}
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          Registration successful
        </Alert>
      </Snackbar>
    </>
  );
}
