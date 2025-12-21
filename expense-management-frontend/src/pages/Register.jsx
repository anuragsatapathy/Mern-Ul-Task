import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  AppBar,
  Toolbar,
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
  const [toast, setToast] = useState({ open: false, msg: "", type: "error" });
  const navigate = useNavigate();

  const submit = async () => {
    if (!form.name || !form.email || !form.password) {
      setToast({ open: true, msg: "All fields are required", type: "error" });
      return;
    }

    try {
      await api.post("/users", form);
      setToast({ open: true, msg: "Registration successful", type: "success" });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setToast({
          open: true,
          msg: "User already exists. Please login.",
          type: "error",
        });
      } else {
        setToast({ open: true, msg: "Something went wrong", type: "error" });
      }
    }
  };

  return (
    <>
    
      <AppBar position="fixed">
        <Toolbar sx={{ justifyContent: "center" }}>
          <Typography variant="h6">Expense Management System</Typography>
        </Toolbar>
      </AppBar>

    
      <Box
        sx={{
          width: 380,
          margin: "120px auto",
          padding: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "#fff",
          textAlign: "center",
        }}
      >
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

        <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={submit}>
          Register
        </Button>

        <Typography mt={2} fontSize={14}>
          Already registered? <Link to="/">Login</Link>
        </Typography>
      </Box>

     
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.type} variant="filled">
          {toast.msg}
        </Alert>
      </Snackbar>
    </>
  );
}
