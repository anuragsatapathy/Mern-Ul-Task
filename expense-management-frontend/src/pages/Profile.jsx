import { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  TextField,
  Button,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import api from "../api/api";
import MainLayout from "../components/MainLayout";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [toast, setToast] = useState(false);

  useEffect(() => {
    api.get("/users/me").then((res) => setUser(res.data.data)).catch(() => setUser(false));
  }, []);

  if (user === null) return null;

  if (user === false) {
    return (
      <MainLayout>
        <Paper sx={{ p: 4, maxWidth: 400, mx: "auto" }}>
          <Typography color="error">
            Session expired. Please login again.
          </Typography>
        </Paper>
      </MainLayout>
    );
  }

  const updatePassword = async () => {
    if (!password.currentPassword || !password.newPassword) return;
    await api.post("/users/reset-password", password);
    setToast(true);
    setPassword({ currentPassword: "", newPassword: "" });
  };

  return (
    <MainLayout>
      <Paper sx={{ p: 4, maxWidth: 520, mx: "auto", borderRadius: 2 }}>
        <Typography variant="h5" fontWeight={600} mb={2}>
          My Profile
        </Typography>

        <Typography><b>Name:</b> {user.name}</Typography>
        <Typography><b>Email:</b> {user.email}</Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" mb={1}>
          Reset Password
        </Typography>

        <TextField
          fullWidth
          type="password"
          label="Current Password"
          margin="normal"
          value={password.currentPassword}
          onChange={(e) =>
            setPassword({ ...password, currentPassword: e.target.value })
          }
        />

        <TextField
          fullWidth
          type="password"
          label="New Password"
          margin="normal"
          value={password.newPassword}
          onChange={(e) =>
            setPassword({ ...password, newPassword: e.target.value })
          }
        />

        <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={updatePassword}>
          Update Password
        </Button>
      </Paper>

      <Snackbar open={toast} autoHideDuration={2000}>
        <Alert severity="success" variant="filled">
          Password updated successfully
        </Alert>
      </Snackbar>
    </MainLayout>
  );
}
