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
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import api from "../api/api";
import EmptyState from "../components/EmptyState";

const Experience = () => {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    company: "",
    location: "",
    role: "",
    description: "",
    from: null,
    to: null,
    currentlyWorking: false,
  });

  // FETCH
  const fetchData = async () => {
    const res = await api.get("/experience");
    const items = res?.data?.data?.items ?? res?.data?.data ?? [];
    setList(Array.isArray(items) ? items : []);
  };

  useEffect(() => {
    fetchData();
  }, []);

 
  const validate = () => {
    const e = {};

    if (!form.company.trim()) e.company = "Company is required";
    if (!form.location.trim()) e.location = "Location is required";
    if (!form.role.trim()) e.role = "Role is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.from) e.from = "Start date is required";
    if (!form.currentlyWorking && !form.to)
      e.to = "End date is required";

    setErrors(e);

    if (Object.keys(e).length > 0) {
      toast.error("Please fill all required fields");
      return false;
    }
    return true;
  };

  
  const save = async () => {
    if (!validate()) return;

    const payload = {
      company: form.company,
      location: form.location,
      role: form.role,
      description: form.description,
      fromDate: dayjs(form.from).toDate(),
      toDate: form.currentlyWorking ? null : dayjs(form.to).toDate(),
      currentlyWorking: form.currentlyWorking,
    };

    try {
      if (editId) {
        await api.put(`/experience/${editId}`, payload);
        toast.success("Experience updated");
      } else {
        await api.post("/experience", payload);
        toast.success("Experience added");
      }

      setOpen(false);
      setEditId(null);
      setErrors({});
      setForm({
        company: "",
        location: "",
        role: "",
        description: "",
        from: null,
        to: null,
        currentlyWorking: false,
      });
      fetchData();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const remove = async () => {
    try {
      await api.delete(`/experience/${confirmId}`);
      toast.success("Experience deleted");
      setConfirmId(null);
      fetchData();
    } catch {
      toast.error("Failed to delete experience");
    }
  };

  return (
    <Box>
      <Typography variant="h4" mb={2}>Experience</Typography>

      <Button variant="contained" onClick={() => setOpen(true)}>
        ADD EXPERIENCE
      </Button>

      {list.length === 0 ? (
        <EmptyState text="No experience added yet." />
      ) : (
        <Stack spacing={2} mt={2}>
          {list.map((x) => (
            <Card
              key={x._id}
              sx={{ p: 2, bgcolor: "#E8F5E9", position: "relative" }}
            >
              <Box position="absolute" top={6} right={6}>
                <IconButton
                  onClick={() => {
                    setEditId(x._id);
                    setForm({
                      company: x.company,
                      location: x.location,
                      role: x.role,
                      description: x.description,
                      from: dayjs(x.fromDate),
                      to: x.toDate ? dayjs(x.toDate) : null,
                      currentlyWorking: x.currentlyWorking,
                    });
                    setOpen(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => setConfirmId(x._id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>

              <Typography fontWeight="bold">
                {x.role} @ {x.company}
              </Typography>
              <Typography>{x.location}</Typography>

              <Typography fontSize={13}>
                {x.toDate
                  ? `${dayjs(x.fromDate).format("DD/MM/YYYY")} – ${dayjs(
                      x.toDate
                    ).format("DD/MM/YYYY")}`
                  : dayjs(x.fromDate).format("DD/MM/YYYY")}
              </Typography>

              <Typography mt={1}>{x.description}</Typography>
            </Card>
          ))}
        </Stack>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? "Edit Experience" : "Add Experience"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Company"
              fullWidth
              value={form.company}
              error={!!errors.company}
              helperText={errors.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />

            <TextField
              label="Location"
              fullWidth
              value={form.location}
              error={!!errors.location}
              helperText={errors.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />

            <TextField
              label="Role"
              sx={{ width: "40%" }}
              value={form.role}
              error={!!errors.role}
              helperText={errors.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={form.description}
              error={!!errors.description}
              helperText={errors.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack direction="row" spacing={2}>
                <DatePicker
                  label="From"
                  format="DD/MM/YYYY"
                  value={form.from}
                  onChange={(v) => setForm({ ...form, from: v })}
                  slotProps={{
                    textField: {
                      sx: { width: "35%" },
                      error: !!errors.from,
                      helperText: errors.from,
                    },
                  }}
                />

                {!form.currentlyWorking && (
                  <DatePicker
                    label="To"
                    format="DD/MM/YYYY"
                    value={form.to}
                    onChange={(v) => setForm({ ...form, to: v })}
                    slotProps={{
                      textField: {
                        sx: { width: "35%" },
                        error: !!errors.to,
                        helperText: errors.to,
                      },
                    }}
                  />
                )}
              </Stack>
            </LocalizationProvider>

            <FormControlLabel
              control={
                <Checkbox
                  checked={form.currentlyWorking}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      currentlyWorking: e.target.checked,
                    })
                  }
                />
              }
              label="Currently working here"
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>

     
      <Dialog open={!!confirmId} onClose={() => setConfirmId(null)}>
        <DialogTitle>Delete experience?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmId(null)}>Cancel</Button>
          <Button color="error" onClick={remove}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Experience;
