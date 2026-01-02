import {
  Card,
  TextField,
  Button,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogActions,
  Stack,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import api from "../api/api";

const Education = () => {
  const [list, setList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast] = useState({
    open: false,
    msg: "",
    type: "success",
  });

  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    degree: "",
    branch: "",
    institution: "",
    cgpa: "",
    startYear: null,
    endYear: null,
  });

  const load = async () => {
    const res = await api.get("/education?offset=0&limit=10");
    setList(res.data.data.items);
  };

  useEffect(() => {
    load();
  }, []);

  const validate = () => {
    const err = {};
    if (!form.degree) err.degree = true;
    if (!form.branch) err.branch = true;
    if (!form.institution) err.institution = true;
    if (!form.cgpa) err.cgpa = true;
    if (!form.startYear) err.startYear = true;
    if (!form.endYear) err.endYear = true;

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = async () => {
    if (!validate()) {
      setToast({
        open: true,
        msg: "Please fill all required fields",
        type: "error",
      });
      return;
    }

    const payload = {
      degree: form.degree,
      branch: form.branch,
      institution: form.institution,
      cgpa: form.cgpa,
      startYear: form.startYear.year(),
      endYear: form.endYear.year(),
    };

    if (editId) {
      await api.put(`/education/${editId}`, payload);
    } else {
      await api.post("/education", payload);
    }

    setEditId(null);
    setForm({
      degree: "",
      branch: "",
      institution: "",
      cgpa: "",
      startYear: null,
      endYear: null,
    });
    setErrors({});
    load();

    setToast({
      open: true,
      msg: "Education saved successfully",
      type: "success",
    });
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Education
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Card sx={{ maxWidth: 900, p: 3 }}>
          <TextField
            label="Degree"
            fullWidth
            margin="normal"
            value={form.degree}
            error={errors.degree}
            onChange={(e) =>
              setForm({ ...form, degree: e.target.value })
            }
          />

          <TextField
            label="Branch / Stream"
            fullWidth
            margin="normal"
            value={form.branch}
            error={errors.branch}
            onChange={(e) =>
              setForm({ ...form, branch: e.target.value })
            }
          />

          <TextField
            label="Institution"
            fullWidth
            margin="normal"
            value={form.institution}
            error={errors.institution}
            onChange={(e) =>
              setForm({ ...form, institution: e.target.value })
            }
          />

          <TextField
            label="CGPA / Percentage"
            fullWidth
            margin="normal"
            value={form.cgpa}
            error={errors.cgpa}
            onChange={(e) =>
              setForm({ ...form, cgpa: e.target.value })
            }
          />

          <Stack direction="row" spacing={2} mt={2}>
            <DatePicker
              views={["year"]}
              label="Start Year"
              value={form.startYear}
              onChange={(v) =>
                setForm({ ...form, startYear: v })
              }
            />
            <DatePicker
              views={["year"]}
              label="End Year"
              value={form.endYear}
              onChange={(v) =>
                setForm({ ...form, endYear: v })
              }
            />
          </Stack>

          <Stack direction="row" spacing={2} mt={3}>
            <Button variant="contained" onClick={submit}>
              {editId ? "Update" : "Add"}
            </Button>

            {editId && (
              <Button
                variant="outlined"
                onClick={() => {
                  setEditId(null);
                  setForm({
                    degree: "",
                    branch: "",
                    institution: "",
                    cgpa: "",
                    startYear: null,
                    endYear: null,
                  });
                  setErrors({});
                }}
              >
                Cancel
              </Button>
            )}
          </Stack>
        </Card>
      </LocalizationProvider>

      {list.map((e) => (
        <Card key={e._id} sx={{ maxWidth: 917, p: 2, mt: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography fontWeight={600}>
                {e.degree} ({e.branch})
              </Typography>
              <Typography>{e.institution}</Typography>
              <Typography>CGPA / %: {e.cgpa}</Typography>
              <Typography variant="body2">
                {e.startYear} – {e.endYear}
              </Typography>
            </Box>

            <Stack direction="row">
              <IconButton
                color="primary"
                onClick={() => {
                  setEditId(e._id);
                  setForm({
                    degree: e.degree,
                    branch: e.branch,
                    institution: e.institution,
                    cgpa: e.cgpa,
                    startYear: dayjs().year(e.startYear),
                    endYear: dayjs().year(e.endYear),
                  });
                }}
              >
                <EditIcon />
              </IconButton>

              <IconButton
                color="error"
                onClick={() => setConfirmId(e._id)}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Card>
      ))}

      <Dialog open={!!confirmId}>
        <DialogTitle>Delete this education?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmId(null)}>
            Cancel
          </Button>
          <Button
            color="error"
            onClick={async () => {
              await api.delete(`/education/${confirmId}`);
              setConfirmId(null);
              load();
              setToast({
                open: true,
                msg: "Education deleted successfully",
                type: "success",
              });
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.type}>{toast.msg}</Alert>
      </Snackbar>
    </>
  );
};

export default Education;
