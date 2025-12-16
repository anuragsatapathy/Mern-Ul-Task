import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import api from "../api/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "developer",
  });

  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    await api.post("/auth/register", form);
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
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <TextField
        fullWidth
        label="Email"
        margin="normal"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <TextField
        select
        fullWidth
        label="Register As"
        margin="normal"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <MenuItem value="developer">Developer</MenuItem>
        <MenuItem value="tester">Tester</MenuItem>
        <MenuItem value="admin">Admin</MenuItem>
      </TextField>

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
