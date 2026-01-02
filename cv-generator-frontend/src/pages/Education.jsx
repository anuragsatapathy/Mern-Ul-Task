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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import api from "../api/api";
import EmptyState from "../components/EmptyState";

const Education = () => {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    degree: "",
    branch: "",
    university: "",
    institution: "",
    cgpa: "",
    startDate: null,
    endDate: null,
  });

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

  const save = async () => {
    if (!validate()) return;

    const payload = {
      ...form,
      startDate: dayjs(form.startDate).format("DD/MM/YYYY"),
      endDate: dayjs(form.endDate).format("DD/MM/YYYY"),
    };

    if (editId) {
      await api.put(`/education/${editId}`, payload);
      toast.success("Education updated");
    } else {
      await api.post("/education", payload);
      toast.success("Education added");
    }

    setOpen(false);
    setEditId(null);
    setErrors({});
    setForm({
      degree: "",
      branch: "",
      university: "",
      institution: "",
      cgpa: "",
      startDate: null,
      endDate: null,
    });
    fetchData();
  };

  const remove = async () => {
    await api.delete(`/education/${confirmId}`);
    toast.success("Education deleted");
    setConfirmId(null);
    fetchData();
  };

  return (
    <Box>
      <Typography variant="h4" mb={2}>
        Education
      </Typography>

      <Button variant="contained" onClick={() => setOpen(true)}>
        ADD EDUCATION
      </Button>

      {list.length === 0 ? (
        <EmptyState text="No education added yet." />
      ) : (
        <Stack spacing={2} mt={2}>
          {list.map((e) => (
            <Card
              key={e._id}
              sx={{ p: 2, bgcolor: "#E3F2FD", position: "relative" }}
            >
              <Box position="absolute" top={6} right={6}>
                <IconButton
                  onClick={() => {
                    setEditId(e._id);
                    setForm({
                      ...e,
                      startDate: dayjs(e.startDate, "DD/MM/YYYY"),
                      endDate: dayjs(e.endDate, "DD/MM/YYYY"),
                    });
                    setOpen(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => setConfirmId(e._id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>

              <Typography fontWeight="bold">
                {e.degree} ({e.branch})
              </Typography>
              <Typography>{e.university}</Typography>
              <Typography>{e.institution}</Typography>
              <Typography>CGPA: {e.cgpa}</Typography>
              <Typography fontSize={13}>
                {dayjs(e.startDate).format("DD/MM/YYYY")} –{" "}
                {dayjs(e.endDate).format("DD/MM/YYYY")}
              </Typography>
            </Card>
          ))}
        </Stack>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? "Edit Education" : "Add Education"}</DialogTitle>
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
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

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
