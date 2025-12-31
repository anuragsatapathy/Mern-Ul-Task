import { useEffect, useState } from "react";
import { TextField, Button, Card, Snackbar, Alert } from "@mui/material";
import api from "../api/api";

const Profile = () => {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    summary: "",
  });
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ open: false, msg: "", type: "success" });

  useEffect(() => {
    api.get("/profile").then((res) => {
      if (res.data.data) setForm(res.data.data);
    });
  }, []);

  const validate = () => {
    const err = {};
    if (!form.fullName) err.fullName = "Required";
    if (!form.phone) err.phone = "Required";
    if (!form.address) err.address = "Required";
    if (!form.summary) err.summary = "Required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    await api.post("/profile", form);
    setToast({ open: true, msg: "Profile saved", type: "success" });
  };

  return (
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 3 }}>
      <TextField label="Full Name" fullWidth margin="normal"
        value={form.fullName}
        error={!!errors.fullName}
        helperText={errors.fullName}
        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
      />
      <TextField label="Phone" fullWidth margin="normal"
        value={form.phone}
        error={!!errors.phone}
        helperText={errors.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <TextField label="Address" fullWidth margin="normal"
        value={form.address}
        error={!!errors.address}
        helperText={errors.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />
      <TextField label="Summary" fullWidth multiline rows={3} margin="normal"
        value={form.summary}
        error={!!errors.summary}
        helperText={errors.summary}
        onChange={(e) => setForm({ ...form, summary: e.target.value })}
      />

      <Button variant="contained" onClick={submit}>Save</Button>

      <Snackbar open={toast.open} autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.type}>{toast.msg}</Alert>
      </Snackbar>
    </Card>
  );
};

export default Profile;
