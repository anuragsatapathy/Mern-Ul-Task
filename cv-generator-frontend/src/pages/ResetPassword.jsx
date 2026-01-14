import {
  Card,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../api/api";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const ResetPassword = () => {
  const [user, setUser] = useState({ name: "", email: "" });

  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // FETCH USER DETAILS 
  useEffect(() => {
    const fetchUser = async () => {
      try {
       
        const res = await api.get("/users/me");
        setUser(res.data.data);
      } catch {
        
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
          if (fbUser) {
            setUser({
              name: fbUser.displayName || "Google User",
              email: fbUser.email,
            });
          } else {
            setToast({
              open: true,
              message: "Failed to load user details",
              severity: "error",
            });
          }
        });

        return () => unsubscribe();
      }
    };

    fetchUser();
  }, []);

  const validate = () => {
    const err = {};

    if (!form.newPassword) err.newPassword = "New password required";
    if (!form.confirmPassword)
      err.confirmPassword = "Confirm password required";

    if (
      form.newPassword &&
      form.confirmPassword &&
      form.newPassword !== form.confirmPassword
    ) {
      err.confirmPassword = "Passwords do not match";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = async () => {
    if (!validate()) {
      setToast({
        open: true,
        message: "Please fix the errors",
        severity: "error",
      });
      return;
    }

    if (!/[!@#$%^&*]/.test(form.newPassword)) {
      setToast({
        open: true,
        message: "Password must contain one special character",
        severity: "error",
      });
      return;
    }

    try {
      await api.post("/users/reset-password", {
        password: form.newPassword,
      });

      setToast({
        open: true,
        message: "Password reset successfully",
        severity: "success",
      });

      setForm({ newPassword: "", confirmPassword: "" });
      setErrors({});
    } catch {
      setToast({
        open: true,
        message: "Failed to reset password",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Reset Password
      </Typography>

      <Card sx={{ maxWidth: 600, p: 3, mb: 3 }}>
        <Typography fontWeight={600}>Name</Typography>
        <Typography mb={2}>{user.name}</Typography>

        <Typography fontWeight={600}>Email</Typography>
        <Typography>{user.email}</Typography>
      </Card>

      {/* RESET FORM */}
      <Card sx={{ maxWidth: 600, p: 3 }}>
        <TextField
          label="New Password"
          type="password"
          fullWidth
          margin="normal"
          value={form.newPassword}
          error={!!errors.newPassword}
          helperText={errors.newPassword}
          onChange={(e) =>
            setForm({ ...form, newPassword: e.target.value })
          }
        />

        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          margin="normal"
          value={form.confirmPassword}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
        />

        <Stack direction="row" mt={2}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#ffb74d",
              color: "#000",
              fontWeight: 600,
              "&:hover": { backgroundColor: "#ffa726" },
            }}
            onClick={submit}
          >
            Update Password
          </Button>
        </Stack>
      </Card>

      {/* TOAST */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ResetPassword;
