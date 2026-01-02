import {
  Card,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import api from "../api/api";

const Profile = () => {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    summary: "",
  });

  const [isEdit, setIsEdit] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    api.get("/profile").then((res) => {
      if (res.data.data) {
        setForm(res.data.data);
        setIsEdit(false);
      } else {
        setIsEdit(true);
      }
    });
  }, []);

  const handleUpdate = async () => {
    if (!form.fullName || !form.phone || !form.address || !form.summary) {
      setToast({
        open: true,
        message: "All fields are required",
        severity: "error",
      });
      return;
    }

    await api.post("/profile", form);
    setIsEdit(false);
    setToast({
      open: true,
      message: "Profile saved successfully",
      severity: "success",
    });
  };

  const handleCancel = () => {
    api.get("/profile").then((res) => {
      if (res.data.data) {
        setForm(res.data.data);
      }
      setIsEdit(false);
    });
  };

  // Safe delete (clear profile)
  const handleDelete = async () => {
    await api.post("/profile", {
      fullName: "",
      phone: "",
      address: "",
      summary: "",
    });

    setForm({
      fullName: "",
      phone: "",
      address: "",
      summary: "",
    });

    setIsEdit(true);
    setConfirmOpen(false);

    setToast({
      open: true,
      message: "Profile cleared successfully",
      severity: "success",
    });
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>

      <Card sx={{ maxWidth: 900, p: 3 }}>
        <TextField
          label="Full Name"
          fullWidth
          margin="normal"
          value={form.fullName}
          disabled={!isEdit}
          onChange={(e) =>
            setForm({ ...form, fullName: e.target.value })
          }
        />

        <TextField
          label="Phone"
          fullWidth
          margin="normal"
          value={form.phone}
          disabled={!isEdit}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <TextField
          label="Address"
          fullWidth
          margin="normal"
          value={form.address}
          disabled={!isEdit}
          onChange={(e) =>
            setForm({ ...form, address: e.target.value })
          }
        />

        <TextField
          label="Summary"
          fullWidth
          margin="normal"
          multiline
          rows={3}
          value={form.summary}
          disabled={!isEdit}
          onChange={(e) =>
            setForm({ ...form, summary: e.target.value })
          }
        />

        <Stack direction="row" spacing={2} mt={2}>
          {isEdit ? (
            <>
              <Button variant="contained" onClick={handleUpdate}>
                Update
              </Button>
              <Button variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <IconButton
                color="primary"
                onClick={() => setIsEdit(true)}
              >
                <EditIcon />
              </IconButton>

              <IconButton
                color="error"
                onClick={() => setConfirmOpen(true)}
              >
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </Stack>
      </Card>

      <Dialog open={confirmOpen}>
        <DialogTitle>Clear profile details?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.severity}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Profile;
