import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Stack,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { toast } from "react-toastify";
import api from "../api/api";
import EmptyState from "../components/EmptyState";

const emptyForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  linkedinId: "",
  summary: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10}$/;

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      if (res.data.data) {
        setProfile(res.data.data);
        setForm(res.data.data);
      } else {
        setProfile(null);
        setForm(emptyForm);
      }
    } catch {
      setProfile(null);
      setForm(emptyForm);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const validate = () => {
    const e = {};

    if (!form.fullName) e.fullName = "Full name is required";

    if (!form.email) e.email = "Email is required";
    else if (!emailRegex.test(form.email)) e.email = "Enter a valid email";

    if (!form.phone) e.phone = "Phone is required";
    else if (!phoneRegex.test(form.phone)) e.phone = "Phone must be 10 digits";

    if (!form.address) e.address = "Address is required";
    if (!form.linkedinId) e.linkedinId = "LinkedIn is required";
    if (!form.summary) e.summary = "Summary is required";

    setErrors(e);

    if (Object.keys(e).length) {
      toast.error("Please fix the highlighted errors");
      return false;
    }
    return true;
  };

  const save = async () => {
    if (!validate()) return;

    try {
      await api.post("/profile", form);
      toast.success("Profile saved successfully");
      setOpen(false);
      setErrors({});
      fetchProfile();
    } catch {
      toast.error("Failed to save profile");
    }
  };

  const remove = async () => {
    try {
      await api.delete("/profile");
      toast.success("Profile deleted");
      setProfile(null);
      setForm(emptyForm);
      setConfirmOpen(false);
    } catch {
      toast.error("Failed to delete profile");
    }
  };

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        Profile
      </Typography>

      {!profile && (
        <>
          <Button variant="contained" onClick={() => setOpen(true)}>
            ADD PROFILE
          </Button>
          <EmptyState text="No profile data added yet." />
        </>
      )}

      {profile && (
        <Box display="flex" justifyContent="center">
          <Card
            sx={{
              mt: 3,
              p: 3,
              width: "100%",
              maxWidth: 850,
              minHeight: 420,
              borderRadius: 4,
              position: "relative",
              background:
                "linear-gradient(135deg, #E3F2FD 0%, #FCE4EC 100%)",
              boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
              transition: "0.3s",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
              },
            }}
          >
            {/* ACTIONS */}
            <Box position="absolute" top={12} right={12}>
              <IconButton onClick={() => setOpen(true)}>
                <EditIcon />
              </IconButton>
              <IconButton color="error" onClick={() => setConfirmOpen(true)}>
                <DeleteIcon />
              </IconButton>
            </Box>

            {/* HEADER */}
            <Typography variant="h5" fontWeight={700}>
              {profile.fullName}
            </Typography>

            <Stack direction="row" spacing={3} mt={1} flexWrap="wrap">
              <Stack direction="row" spacing={1} alignItems="center">
                <EmailIcon fontSize="small" />
                <Typography>{profile.email}</Typography>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <PhoneIcon fontSize="small" />
                <Typography>{profile.phone}</Typography>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={1} mt={1} alignItems="center">
              <LocationOnIcon fontSize="small" />
              <Typography>{profile.address}</Typography>
            </Stack>

            <Stack direction="row" spacing={1} mt={1} alignItems="center">
              <LinkedInIcon fontSize="small" color="primary" />
              <Typography color="primary">
                {profile.linkedinId}
              </Typography>
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* SUMMARY */}
            <Typography fontWeight={600} mb={0.5}>
              Professional Summary
            </Typography>
            <Typography color="text.secondary">
              {profile.summary}
            </Typography>
          </Card>
        </Box>
      )}

      {/* ADD / EDIT */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{profile ? "Edit Profile" : "Add Profile"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Full Name"
              fullWidth
              value={form.fullName}
              error={!!errors.fullName}
              helperText={errors.fullName}
              onChange={(e) =>
                setForm({ ...form, fullName: e.target.value })
              }
            />

            <TextField
              label="Email"
              fullWidth
              value={form.email}
              error={!!errors.email}
              helperText={errors.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <TextField
              label="Phone"
              fullWidth
              value={form.phone}
              error={!!errors.phone}
              helperText={errors.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            <TextField
              label="Address"
              fullWidth
              value={form.address}
              error={!!errors.address}
              helperText={errors.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />

            <TextField
              label="LinkedIn Profile"
              fullWidth
              value={form.linkedinId}
              error={!!errors.linkedinId}
              helperText={errors.linkedinId}
              onChange={(e) =>
                setForm({ ...form, linkedinId: e.target.value })
              }
            />

            <TextField
              label="Summary"
              multiline
              rows={3}
              fullWidth
              value={form.summary}
              error={!!errors.summary}
              helperText={errors.summary}
              onChange={(e) =>
                setForm({ ...form, summary: e.target.value })
              }
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRM */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete profile?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={remove}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
