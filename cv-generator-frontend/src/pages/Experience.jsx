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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import api from "../api/api";

const Experience = () => {
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
    company: "",
    role: "",
    from: null,
    to: null,
  });

  const load = async () => {
    const res = await api.get("/experience?offset=0&limit=10");
    setList(res.data.data.items);
  };

  useEffect(() => {
    load();
  }, []);

  const validate = () => {
    const err = {};
    if (!form.company) err.company = true;
    if (!form.role) err.role = true;
    if (!form.from) err.from = true;
    if (!form.to) err.to = true;

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
      company: form.company,
      role: form.role,
      duration: `${form.from.format("MMM YYYY")} - ${form.to.format(
        "MMM YYYY"
      )}`,
    };

    if (editId) {
      await api.put(`/experience/${editId}`, payload);
    } else {
      await api.post("/experience", payload);
    }

    setEditId(null);
    setForm({ company: "", role: "", from: null, to: null });
    setErrors({});
    load();

    setToast({
      open: true,
      msg: "Experience saved successfully",
      type: "success",
    });
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Experience
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Card sx={{ maxWidth: 900, p: 3 }}>
          <TextField
            label="Company"
            fullWidth
            margin="normal"
            value={form.company}
            error={errors.company}
            onChange={(e) =>
              setForm({ ...form, company: e.target.value })
            }
          />

          <TextField
            label="Role"
            fullWidth
            margin="normal"
            value={form.role}
            error={errors.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
          />

          <Stack direction="row" spacing={2} mt={2}>
            <DatePicker
              views={["year", "month"]}
              label="From"
              value={form.from}
              onChange={(v) =>
                setForm({ ...form, from: v })
              }
            />
            <DatePicker
              views={["year", "month"]}
              label="To"
              value={form.to}
              onChange={(v) =>
                setForm({ ...form, to: v })
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
                    company: "",
                    role: "",
                    from: null,
                    to: null,
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
            <Typography>
              {e.role} @ {e.company} ({e.duration})
            </Typography>

            <Stack direction="row">
              <IconButton
                color="primary"
                onClick={() => {
                  setEditId(e._id);
                  const [from, to] = e.duration.split(" - ");
                  setForm({
                    company: e.company,
                    role: e.role,
                    from: dayjs(from, "MMM YYYY"),
                    to: dayjs(to, "MMM YYYY"),
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
        <DialogTitle>Delete this experience?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmId(null)}>
            Cancel
          </Button>
          <Button
            color="error"
            onClick={async () => {
              await api.delete(`/experience/${confirmId}`);
              setConfirmId(null);
              load();
              setToast({
                open: true,
                msg: "Experience deleted successfully",
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
        onClose={() =>
          setToast({ ...toast, open: false })
        }
      >
        <Alert severity={toast.type}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Experience;
