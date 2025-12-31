import { useState } from "react";
import {
  TextField,
  Button,
  Card,
  Typography,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import api from "../api/api";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    open: false,
    msg: "",
    type: "success",
  });

  const validate = () => {
    const err = {};

    if (!form.email) err.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      err.email = "Invalid email";

    if (!form.password) err.password = "Password is required";
    else if (!/[!@#$%^&*]/.test(form.password))
      err.password = "Password must contain one special character";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;

    try {
      const res = await api.post("/users/login", form);
      localStorage.setItem("token", res.data.data.token);

      setToast({
        open: true,
        msg: "Login successful",
        type: "success",
      });

      setTimeout(() => navigate("/"), 1000);
    } catch {
      setToast({
        open: true,
        msg: "Invalid credentials",
        type: "error",
      });
    }
  };

  return (
    <Card sx={{ width: 400, mx: "auto", mt: 10, p: 3 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Login
      </Typography>

      <TextField
        label="Email"
        fullWidth
        margin="normal"
        value={form.email}
        error={!!errors.email}
        helperText={errors.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={form.password}
        error={!!errors.password}
        helperText={errors.password}
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />
<Button
  fullWidth
  variant="contained"
  sx={{
    mt: 2,
    backgroundColor: "#ffb74d",
    color: "#6d6262ff",
    fontWeight: 600,
    "&:hover": {
      backgroundColor: "#ffa726",
    },
  }}
  onClick={submit}
>
  Login
</Button>


     
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <Typography variant="body2">
          Don’t have an account?{" "}
          <Link to="/register" style={{ textDecoration: "none" }}>
            Register
          </Link>
        </Typography>
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() =>
          setToast({ ...toast, open: false })
        }
      >
        <Alert severity={toast.type}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default Login;
