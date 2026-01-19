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
  Stack,
  IconButton,
  Grid,
  styled,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BusinessCenterRoundedIcon from "@mui/icons-material/BusinessCenterRounded";
import PhoneEnabledRoundedIcon from "@mui/icons-material/PhoneEnabledRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import { toast } from "react-toastify";
import api from "../api/api";
import EmptyState from "../components/EmptyState";

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  background: "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)", 
  borderRadius: "20px",
  position: "relative",
  boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
  border: "none",
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "scale(1.01)",
  },
}));

const emptyForm = {
  name: "",
  designation: "",
  organization: "",
  phone: "",
  email: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10}$/;

const Reference = () => {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const fetchData = async () => {
    const res = await api.get("/references");
    const items = res?.data?.data?.items ?? [];
    setList(items);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.designation.trim()) e.designation = "Designation is required";
    if (!form.organization.trim()) e.organization = "Organization is required";
    if (!form.phone.trim()) {
      e.phone = "Phone is required";
    } else if (!phoneRegex.test(form.phone)) {
      e.phone = "Must be 10 digits";
    }
    if (!form.email.trim()) {
      e.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      e.email = "Invalid email";
    }
    setErrors(e);
    if (Object.keys(e).length) {
      toast.error("Please fix validation errors");
      return false;
    }
    return true;
  };

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setErrors({});
    setOpen(true);
  };

  const openEdit = (x) => {
    setEditId(x._id);
    setForm({
      name: x.name,
      designation: x.designation,
      organization: x.organization,
      phone: x.phone,
      email: x.email,
    });
    setErrors({});
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setEditId(null);
    setForm(emptyForm);
    setErrors({});
  };

  const save = async () => {
    if (!validate()) return;
    try {
      if (editId) {
        await api.put(`/references/${editId}`, form);
        toast.success("Reference updated");
      } else {
        await api.post("/references", form);
        toast.success("Reference added");
      }
      close();
      fetchData();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const remove = async () => {
    try {
      await api.delete(`/references/${confirmId}`);
      toast.success("Reference deleted");
      setConfirmId(null);
      fetchData();
    } catch {
      toast.error("Failed to delete reference");
    }
  };

  return (
    <Box width="100%" p={4} bgcolor="#ffffff" minHeight="100vh">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
        <Typography variant="h4" fontWeight={700} color="#000">
          References
        </Typography>
        <Button
          variant="contained"
          onClick={openAdd}
          sx={{
            bgcolor: "#1976D2", 
            "&:hover": { bgcolor: "#1976D2" },
            borderRadius: "8px",
            fontWeight: "bold",
            px: 4,
          }}
        >
          ADD REFERENCE
        </Button>
      </Box>

      {list.length === 0 ? (
        <EmptyState text="No references added yet." />
      ) : (
        <Grid container spacing={4}>
          {list.map((x) => (
            <Grid item xs={12} key={x._id}>
              <StyledCard>
              
                <Box sx={{ position: "absolute", top: 20, right: 20, display: "flex", gap: 1 }}>
                  <IconButton size="small" onClick={() => openEdit(x)} sx={{ color: "#757575" }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => setConfirmId(x._id)} sx={{ color: "#d32f2f" }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Box display="flex" flexDirection="column" gap={0.5}>
                  <Typography variant="h4" fontWeight={900} color="#1a1a1a">
                    {x.name}
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="#1976d2" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
                    {x.designation} @ {x.organization}
                  </Typography>
                </Box>

                <Box
                  display="flex"
                  flexWrap="wrap"
                  alignItems="center"
                  gap={3}
                  mt={3}
                  pt={2}
                  sx={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <EmailRoundedIcon sx={{ fontSize: 18, color: "#546e7a" }} />
                    <Typography variant="body2" fontWeight={600}>{x.email}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <PhoneEnabledRoundedIcon sx={{ fontSize: 18, color: "#546e7a" }} />
                    <Typography variant="body2" fontWeight={600}>{x.phone}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <BusinessCenterRoundedIcon sx={{ fontSize: 18, color: "#546e7a" }} />
                    <Typography variant="body2" fontWeight={600}>{x.organization}</Typography>
                  </Box>
                </Box>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      )}


      <Dialog open={open} onClose={close} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: "16px" } }}>
        <DialogTitle sx={{ fontWeight: 800, pt: 3 }}>
          {editId ? "Edit Reference" : "New Reference"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Full Name"
              fullWidth
              variant="outlined"
              value={form.name}
              error={!!errors.name}
              helperText={errors.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              label="Designation"
              fullWidth
              value={form.designation}
              error={!!errors.designation}
              helperText={errors.designation}
              onChange={(e) => setForm({ ...form, designation: e.target.value })}
            />
            <TextField
              label="Organization"
              fullWidth
              value={form.organization}
              error={!!errors.organization}
              helperText={errors.organization}
              onChange={(e) => setForm({ ...form, organization: e.target.value })}
            />
            <TextField
              label="Email Address"
              fullWidth
              value={form.email}
              error={!!errors.email}
              helperText={errors.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <TextField
              label="Phone Number"
              sx={{ width: "75%" }}
              value={form.phone}
              error={!!errors.phone}
              helperText={errors.phone}
              inputProps={{ maxLength: 10 }}
              onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={close} sx={{ color: "#666", fontWeight: "bold" }}>Cancel</Button>
          <Button variant="contained" onClick={save} sx={{ bgcolor: "#1976D2", "&:hover": { bgcolor: "#1976D2" }, borderRadius: "8px", px: 3 }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!confirmId} onClose={() => setConfirmId(null)} PaperProps={{ sx: { borderRadius: "12px" } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete reference?</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to remove this reference contact?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setConfirmId(null)} color="inherit">Cancel</Button>
          <Button color="error" variant="contained" onClick={remove} sx={{ borderRadius: "8px" }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reference;