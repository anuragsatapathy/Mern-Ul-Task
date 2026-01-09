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
  Divider,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import api from "../api/api";
import EmptyState from "../components/EmptyState";

const Certificates = () => {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});

  const emptyForm = {
    title: "",
    description: "",
    date: null,
    isNoExpiry: false,
  };

  const [form, setForm] = useState(emptyForm);

  const fetchData = async () => {
    const res = await api.get("/certificates");
    const items = res?.data?.data?.items ?? res?.data?.data ?? [];
    setList(Array.isArray(items) ? items : []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.isNoExpiry && !form.date) e.date = "Date is required";

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
      title: x.title,
      description: x.description,
      date: x.date ? dayjs(x.date) : null,
      isNoExpiry: !x.date,
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
      title: form.title,
      description: form.description,
      date: form.isNoExpiry ? null : dayjs(form.date).toDate(),
    };

    try {
      if (editId) {
        await api.put(`/certificates/${editId}`, payload);
        toast.success("Certificate updated");
      } else {
        await api.post("/certificates", payload);
        toast.success("Certificate added");
      }

      closeDialog();
      fetchData();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const remove = async () => {
    try {
      await api.delete(`/certificates/${confirmId}`);
      toast.success("Certificate deleted");
      setConfirmId(null);
      fetchData();
    } catch {
      toast.error("Failed to delete certificate");
    }
  };

  return (
    <Box width="100%">
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4">Certificates</Typography>
        <Button variant="contained" onClick={openAddDialog}>
          ADD CERTIFICATE
        </Button>
      </Box>

      {list.length === 0 ? (
        <EmptyState text="No certificates added yet." />
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
                  background: "linear-gradient(135deg, #FFF8E1 0%, #FFFDE7 100%)",
                  boxShadow: "0 10px 28px rgba(0,0,0,0.12)",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 16px 36px rgba(0,0,0,0.18)",
                  },
                }}
              >
                <Box position="absolute" top={12} right={12}>
                  <IconButton onClick={() => openEditDialog(x)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => setConfirmId(x._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <Stack direction="row" spacing={1} alignItems="center">
                  <WorkspacePremiumIcon color="warning" />
                  <Typography fontWeight={700}>{x.title}</Typography>
                </Stack>

                <Typography fontSize={13} color="text.secondary">
                  {x.date ? dayjs(x.date).format("DD/MM/YYYY") : "No Expiry Date"}
                </Typography>

                <Divider sx={{ my: 1.5 }} />
                <Typography>{x.description}</Typography>
              </Card>
            ))}
          </Stack>
        </Box>
      )}

      {/* ADD / EDIT DIALOG */}
      <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? "Edit Certificate" : "Add Certificate"}</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Title"
              fullWidth
              value={form.title}
              error={!!errors.title}
              helperText={errors.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={form.description}
              error={!!errors.description}
              helperText={errors.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <Stack direction="row" spacing={2} alignItems="center">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date"
                  disabled={form.isNoExpiry}
                  value={form.date}
                  onChange={(v) => setForm({ ...form, date: v })}
                  slotProps={{
                    textField: {
                      sx: { width: "100%" },
                      error: !!errors.date,
                      helperText: errors.date,
                    },
                  }}
                />
              </LocalizationProvider>

             
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.isNoExpiry}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setForm((prev) => ({
                        ...prev,
                        isNoExpiry: checked,
                        date: checked ? null : prev.date,
                      }));
                    }}
                  />
                }
                label="No expiry date"
                sx={{ minWidth: "160px" }}
              />
            </Stack>
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
        <DialogTitle>Delete certificate?</DialogTitle>
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

export default Certificates;
