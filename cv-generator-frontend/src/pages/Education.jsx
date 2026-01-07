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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SchoolIcon from "@mui/icons-material/School";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import api from "../api/api";
import EmptyState from "../components/EmptyState";

const emptyForm = {
  degree: "",
  branch: "",
  university: "",
  institution: "",
  cgpa: "",
  startDate: null,
  endDate: null,
};

const Education = () => {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(emptyForm);

  const fetchData = async () => {
    const res = await api.get("/education?offset=0&limit=10");
    const items = res?.data?.data?.items || [];
    setList(items);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validate = () => {
    const e = {};
    if (!form.degree) e.degree = "Required";
    if (!form.branch) e.branch = "Required";
    if (!form.university) e.university = "Required";
    if (!form.institution) e.institution = "Required";
    if (!form.cgpa) e.cgpa = "Required";
    if (!form.startDate) e.startDate = "Required";
    if (!form.endDate) e.endDate = "Required";
    setErrors(e);

    if (Object.keys(e).length) {
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

  const openEditDialog = (e) => {
    setEditId(e._id);
    setForm({
      ...e,
      startDate: dayjs(e.startDate),
      endDate: dayjs(e.endDate),
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
      ...form,
      startDate: dayjs(form.startDate).toDate(),
      endDate: dayjs(form.endDate).toDate(),
    };

    try {
      if (editId) {
        await api.put(`/education/${editId}`, payload);
        toast.success("Education updated");
      } else {
        await api.post("/education", payload);
        toast.success("Education added");
      }

      closeDialog();
      fetchData();
    } catch {
      toast.error("Failed to save education");
    }
  };

  const remove = async () => {
    try {
      await api.delete(`/education/${confirmId}`);
      toast.success("Education deleted");
      setConfirmId(null);
      fetchData();
    } catch {
      toast.error("Failed to delete education");
    }
  };

  return (
    <Box>
      
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h4">
          Education
        </Typography>

        <Button variant="contained" onClick={openAddDialog}>
          ADD EDUCATION
        </Button>
      </Box>

      {list.length === 0 ? (
        <EmptyState text="No education added yet." />
      ) : (
        <Box mt={3}>
          <Stack spacing={3} alignItems="center">
            {list.map((e) => (
              <Card
                key={e._id}
                sx={{
                  width: "100%",
                  maxWidth: 850,
                  p: 3,
                  borderRadius: 4,
                  position: "relative",
                  
                  background:
                    "linear-gradient(135deg, #E8F5E9 0%, #E0F2F1 100%)",
                  boxShadow: "0 10px 28px rgba(0,0,0,0.12)",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 16px 36px rgba(0,0,0,0.18)",
                  },
                }}
              >
                <Box position="absolute" top={12} right={12}>
                  <IconButton onClick={() => openEditDialog(e)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => setConfirmId(e._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <Stack direction="row" spacing={1} alignItems="center">
                  <SchoolIcon color="success" />
                  <Typography fontWeight={700}>
                    {e.degree} ({e.branch})
                  </Typography>
                </Stack>

                <Typography mt={0.5}>{e.university}</Typography>
                <Typography color="text.secondary">
                  {e.institution}
                </Typography>

                <Divider sx={{ my: 1.5 }} />

                <Stack direction="row" spacing={3} flexWrap="wrap">
                  <Typography fontWeight={600}>
                    CGPA: {e.cgpa}
                  </Typography>
                  <Typography fontSize={13} color="text.secondary">
                    {dayjs(e.startDate).format("DD/MM/YYYY")} –{" "}
                    {dayjs(e.endDate).format("DD/MM/YYYY")}
                  </Typography>
                </Stack>
              </Card>
            ))}
          </Stack>
        </Box>
      )}

      {/* ADD / EDIT DIALOG */}
      <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {editId ? "Edit Education" : "Add Education"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Stack direction="row" spacing={2}>
              <TextField
                label="DEGREE"
                sx={{ width: "40%" }}
                value={form.degree}
                error={!!errors.degree}
                helperText={errors.degree}
                onChange={(e) =>
                  setForm({ ...form, degree: e.target.value })
                }
              />

              <TextField
                label="BRANCH"
                sx={{ width: "40%" }}
                value={form.branch}
                error={!!errors.branch}
                helperText={errors.branch}
                onChange={(e) =>
                  setForm({ ...form, branch: e.target.value })
                }
              />
            </Stack>

            <TextField
              label="UNIVERSITY"
              fullWidth
              value={form.university}
              error={!!errors.university}
              helperText={errors.university}
              onChange={(e) =>
                setForm({ ...form, university: e.target.value })
              }
            />

            <TextField
              label="INSTITUTION"
              fullWidth
              value={form.institution}
              error={!!errors.institution}
              helperText={errors.institution}
              onChange={(e) =>
                setForm({ ...form, institution: e.target.value })
              }
            />

            <Stack direction="row" spacing={2}>
              <TextField
                label="CGPA"
                sx={{ width: "25%" }}
                value={form.cgpa}
                error={!!errors.cgpa}
                helperText={errors.cgpa}
                onChange={(e) =>
                  setForm({ ...form, cgpa: e.target.value })
                }
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  format="DD/MM/YYYY"
                  value={form.startDate}
                  onChange={(v) =>
                    setForm({ ...form, startDate: v })
                  }
                  slotProps={{
                    textField: {
                      sx: { width: "30%" },
                      error: !!errors.startDate,
                      helperText: errors.startDate,
                    },
                  }}
                />

                <DatePicker
                  label="End Date"
                  format="DD/MM/YYYY"
                  value={form.endDate}
                  onChange={(v) =>
                    setForm({ ...form, endDate: v })
                  }
                  slotProps={{
                    textField: {
                      sx: { width: "30%" },
                      error: !!errors.endDate,
                      helperText: errors.endDate,
                    },
                  }}
                />
              </LocalizationProvider>
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
        <DialogTitle>Delete education?</DialogTitle>
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

export default Education;
