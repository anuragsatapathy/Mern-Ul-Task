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
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import WorkIcon from "@mui/icons-material/Work";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import api from "../api/api";
import EmptyState from "../components/EmptyState";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Experience = () => {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});

  const emptyForm = {
    company: "",
    location: "",
    role: "",
    description: "",
    from: null,
    to: null,
    currentlyWorking: false,
  };

  const [form, setForm] = useState(emptyForm);

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

  const openAddDialog = () => {
    setEditId(null);          
    setForm(emptyForm);       
    setErrors({});
    setOpen(true);
  };

  const openEditDialog = (x) => {
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
    setErrors({});
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setEditId(null);          
    setErrors({});
    setForm(emptyForm);
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

      closeDialog();
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
    <Box width="100%">
      
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h4">
          Experience
        </Typography>

        <Button variant="contained" onClick={openAddDialog}>
          ADD EXPERIENCE
        </Button>
      </Box>

      {list.length === 0 ? (
        <EmptyState text="No experience added yet." />
      ) : (
        <Box mt={3} width="100%">
          <Stack spacing={3}>
            {list.map((x) => (
              <Card
                key={x._id}
                sx={{
                  width: "94%",
                  p: 5,
                  borderRadius: 4,
                  position: "relative",
                  background:
                    "linear-gradient(135deg, #EDE7F6 0%, #E8EAF6 100%)",
                  boxShadow: "0 10px 28px rgba(0,0,0,0.12)",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 16px 36px rgba(0,0,0,0.18)",
                  },
                }}
              >
                {/* ACTIONS */}
                <Box position="absolute" top={12} right={12}>
                  <IconButton onClick={() => openEditDialog(x)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => setConfirmId(x._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <Stack direction="row" spacing={1} alignItems="center">
                  <WorkIcon color="primary" />
                  <Typography fontWeight={700}>
                    {x.role} @ {x.company}
                  </Typography>
                </Stack>

                <Typography color="text.secondary">
                  {x.location}
                </Typography>

                <Typography fontSize={13} color="text.secondary">
                  {x.toDate
                    ? `${dayjs(x.fromDate).format("DD/MM/YYYY")} – ${dayjs(
                        x.toDate
                      ).format("DD/MM/YYYY")}`
                    : dayjs(x.fromDate).format("DD/MM/YYYY")}
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Box
                  sx={{ "& p": { marginBottom: "8px" } }}
                  dangerouslySetInnerHTML={{ __html: x.description }}
                />
              </Card>
            ))}
          </Stack>
        </Box>
      )}

      {/* ADD / EDIT DIALOG */}
      <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {editId ? "Edit Experience" : "Add Experience"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Company"
              fullWidth
              value={form.company}
              error={!!errors.company}
              helperText={errors.company}
              onChange={(e) =>
                setForm({ ...form, company: e.target.value })
              }
            />

            <TextField
              label="Location"
              fullWidth
              value={form.location}
              error={!!errors.location}
              helperText={errors.location}
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
              }
            />

            <TextField
              label="Role"
              sx={{ width: "40%" }}
              value={form.role}
              error={!!errors.role}
              helperText={errors.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
            />

            <Box>
              <Typography variant="body2" mb={0.5}>
                Description
              </Typography>
              <ReactQuill
                theme="snow"
                value={form.description}
                onChange={(value) =>
                  setForm({ ...form, description: value })
                }
              />
              {errors.description && (
                <Typography color="error" fontSize={12} mt={0.5}>
                  {errors.description}
                </Typography>
              )}
            </Box>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack direction="row" spacing={2}>
                <DatePicker
                  label="From"
                  format="DD/MM/YYYY"
                  value={form.from}
                  onChange={(v) =>
                    setForm({ ...form, from: v })
                  }
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
                    onChange={(v) =>
                      setForm({ ...form, to: v })
                    }
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
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained" onClick={save}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRM */}
      <Dialog open={!!confirmId} onClose={() => setConfirmId(null)}>
        <DialogTitle>Delete experience?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmId(null)}>Cancel</Button>
          <Button color="error" onClick={remove}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Experience;
