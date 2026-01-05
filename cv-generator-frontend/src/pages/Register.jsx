import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  InputAdornment,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import AuthNavbar from "../components/AuthNavbar";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

 
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const hasSpecialChar = (password) =>
    /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const submit = async (e) => {
    e.preventDefault(); 

    const err = {};
    if (!form.name) err.name = "Name required";
    if (!form.email) err.email = "Email required";
    if (!form.password) err.password = "Password required";
    setErrors(err);

    if (Object.keys(err).length) {
      setToast({
        open: true,
        message: "Please fill all required fields",
        severity: "error",
      });
      return;
    }

    // email validation
    if (!isValidEmail(form.email)) {
      setToast({
        open: true,
        message: "Please enter a valid email address",
        severity: "error",
      });
      return;
    }

    // password validation
    if (!hasSpecialChar(form.password)) {
      setToast({
        open: true,
        message: "Password must contain at least one special character",
        severity: "error",
      });
      return;
    }

    try {
      await api.post("/users", form);

      setToast({
        open: true,
        message: "Registration successful",
        severity: "success",
      });

      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setToast({
        open: true,
        message: err.response?.data?.message || "Registration failed",
        severity: "error",
      });
    }
  };

  return (
    <>
      <AuthNavbar />

      <Box sx={{ minHeight: "calc(100vh - 64px)", display: "flex" }}>
        {/* LEFT PANEL */}
        <Box
          sx={{
            flex: 1,
            bgcolor: "#1e88e5",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderTopRightRadius: "100% 80%",
          }}
        >
          <Typography variant="h4" fontWeight={700}>
            Already have an account?
          </Typography>
          <Typography mt={1}>Sign in to continue</Typography>

          <Button
            variant="outlined"
            sx={{
              mt: 3,
              color: "#fff",
              borderColor: "#fff",
              borderRadius: 20,
              px: 4,
            }}
            onClick={() => navigate("/")}
          >
            LOGIN
          </Button>
        </Box>

        {/* RIGHT FORM */}
        <Box
          component="form"
          onSubmit={submit}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" mb={4}>
            Sign up
          </Typography>

          <TextField
            placeholder="Name"
            sx={{ width: 320, mb: 2 }}
            value={form.name}
            error={!!errors.name}
            helperText={errors.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="disabled" />
                </InputAdornment>
              ),
              sx: { borderRadius: 50, bgcolor: "#f2f2f2" },
            }}
          />

          <TextField
            placeholder="Email"
            sx={{ width: 320, mb: 2 }}
            value={form.email}
            error={!!errors.email}
            helperText={errors.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="disabled" />
                </InputAdornment>
              ),
              sx: { borderRadius: 50, bgcolor: "#f2f2f2" },
            }}
          />

          <TextField
            placeholder="Password"
            type="password"
            sx={{ width: 320, mb: 3 }}
            value={form.password}
            error={!!errors.password}
            helperText={errors.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="disabled" />
                </InputAdornment>
              ),
              sx: { borderRadius: 50, bgcolor: "#f2f2f2" },
            }}
          />

          <Button
            type="submit"
            sx={{
              width: 200,
              borderRadius: 20,
              bgcolor: "#5c9dff",
              color: "#fff",
              fontWeight: 600,
              "&:hover": { bgcolor: "#4a8bf0" },
            }}
          >
            REGISTER
          </Button>
        </Box>
      </Box>

      {/* TOAST */}
      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}

