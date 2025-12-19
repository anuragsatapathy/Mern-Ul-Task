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

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Minimum 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;

    await api.post("/users", form);
    setSuccess(true);

    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <Box sx={{ width: 340, margin: "120px auto", p: 3, boxShadow: 3 }}>
      <Typography variant="h5" mb={2}>
        Register
      </Typography>

      <TextField
        fullWidth
        label="Name"
        margin="normal"
        error={!!errors.name}
        helperText={errors.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <TextField
        fullWidth
        label="Email"
        margin="normal"
        error={!!errors.email}
        helperText={errors.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        error={!!errors.password}
        helperText={errors.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={submit}>
        Register
      </Button>

      <Typography mt={2} fontSize={14}>
        Already registered? <Link to="/">Login</Link>
      </Typography>

      <Snackbar open={success} autoHideDuration={1500}>
        <Alert severity="success">Registration successful!</Alert>
      </Snackbar>
    </Box>
  );
}
