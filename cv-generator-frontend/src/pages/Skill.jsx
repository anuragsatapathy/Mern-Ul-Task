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
  MenuItem,
  Stack,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import api from "../api/api";

const Skill = () => {
  const [list, setList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const [toast, setToast] = useState({
    open: false,
    msg: "",
    type: "success",
  });

  const [form, setForm] = useState({
    name: "",
    level: "",
  });

  const load = async () => {
    const res = await api.get("/skills?offset=0&limit=10");
    setList(res.data.data.items);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    if (!form.name || !form.level) {
      setToast({
        open: true,
        msg: "All fields are required",
        type: "error",
      });
      return;
    }

    if (editId) {
      await api.put(`/skills/${editId}`, form);
    } else {
      await api.post("/skills", form);
    }

    setEditId(null);
    setForm({ name: "", level: "" });
    load();

    setToast({
      open: true,
      msg: "Skill saved successfully",
      type: "success",
    });
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Skills
      </Typography>

      <Card sx={{ maxWidth: 880, p: 3 }}>
        <TextField
          label="Skill"
          fullWidth
          margin="normal"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <TextField
          select
          label="Level"
          fullWidth
          margin="normal"
          value={form.level}
          onChange={(e) =>
            setForm({ ...form, level: e.target.value })
          }
        >
          <MenuItem value="Beginner">Beginner</MenuItem>
          <MenuItem value="Intermediate">Intermediate</MenuItem>
          <MenuItem value="Advanced">Advanced</MenuItem>
        </TextField>

        <Stack direction="row" spacing={2} mt={2}>
          <Button variant="contained" onClick={submit}>
            {editId ? "Update" : "Add"}
          </Button>

          {editId && (
            <Button
              variant="outlined"
              onClick={() => {
                setEditId(null);
                setForm({ name: "", level: "" });
              }}
            >
              Cancel
            </Button>
          )}
        </Stack>
      </Card>

      {list.map((s) => (
        <Card key={s._id} sx={{ maxWidth: 900, p: 2, mt: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography>
              {s.name} - {s.level}
            </Typography>

            <Stack direction="row">
              <IconButton
                color="primary"
                onClick={() => {
                  setEditId(s._id);
                  setForm({
                    name: s.name,
                    level: s.level,
                  });
                }}
              >
                <EditIcon />
              </IconButton>

              <IconButton
                color="error"
                onClick={() => setConfirmId(s._id)}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Card>
      ))}

      <Dialog open={!!confirmId}>
        <DialogTitle>Delete this skill?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmId(null)}>
            Cancel
          </Button>
          <Button
            color="error"
            onClick={async () => {
              await api.delete(`/skills/${confirmId}`);
              setConfirmId(null);
              load();
              setToast({
                open: true,
                msg: "Skill deleted successfully",
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

export default Skill;
