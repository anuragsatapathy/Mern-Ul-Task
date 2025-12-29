import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import AuthNavbar from "../components/AuthNavbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [notifDialog, setNotifDialog] = useState(false);

  const navigate = useNavigate();

  const submit = async () => {
    const err = {};
    if (!email) err.email = "Email required";
    if (!password) err.password = "Password required";
    setErrors(err);
    if (Object.keys(err).length) return;

   
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setToast({
        open: true,
        message: "Please enter a valid email address",
        severity: "error",
      });
      return;
    }

    if (!/[!@#$%^&*]/.test(password)) {
      setToast({
        open: true,
        message: "Password must contain at least one special character",
        severity: "error",
      });
      return;
    }

    try {
      const res = await api.post("/users/login", { email, password });
      localStorage.setItem("token", res.data.data.token);

      setToast({
        open: true,
        message: "Login successful",
        severity: "success",
      });

      setNotifDialog(true);
    } catch {
      setToast({
        open: true,
        message: "Invalid email or password",
        severity: "error",
      });
    }
  };

  const proceed = async (allow) => {
    setNotifDialog(false);

    if (allow && "Notification" in window) {
      await Notification.requestPermission();
    }

    navigate("/dashboard");
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
          <Typography
            variant="h5"
            fontWeight={600}
            textAlign="center"
            mb={3}
          >
            Login
          </Typography>

          <TextField
            fullWidth
            label="Email"
            margin="normal"
            error={!!errors.email}
            helperText={errors.email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            error={!!errors.password}
            helperText={errors.password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            fullWidth
            size="large"
            variant="contained"
            sx={{ mt: 3 }}
            onClick={submit}
          >
            Login
          </Button>

          <Typography mt={2} textAlign="center">
            Don’t have an account?{" "}
            <span
              style={{ color: "#1976d2", cursor: "pointer" }}
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </Typography>
        </Paper>
      </Box>

      <Dialog open={notifDialog}>
        <DialogTitle>Enable Notifications?</DialogTitle>
        <DialogContent>
          You will receive alerts for all important updates (budget warnings and more).
        </DialogContent>
        <DialogActions>
          <Button onClick={() => proceed(false)}>Close</Button>
          <Button variant="contained" onClick={() => proceed(true)}>
            Allow
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={toast.open} autoHideDuration={2000}>
        <Alert severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
