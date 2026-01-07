import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import api from "../api/api";
import EmptyState from "../components/EmptyState";

const Skill = () => {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    title: "",
    name: "",
    level: "",
  });

  const fetchData = async () => {
    const res = await api.get("/skills");
    const items = res?.data?.data?.items ?? res?.data?.data ?? [];
    setList(Array.isArray(items) ? items : []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validate = () => {
    const e = {};
    if (!form.title) e.title = "Required";
    if (!form.name) e.name = "Required";
    if (!form.level) e.level = "Required";
    setErrors(e);

    if (Object.keys(e).length) {
      toast.error("Please fill all required fields");
      return false;
    }
    return true;
  };

  const openAddDialog = () => {
    setEditId(null);
    setForm({ title: "", name: "", level: "" });
    setErrors({});
    setOpen(true);
  };

  const openEditDialog = (s) => {
    setEditId(s._id);
    setForm({
      title: s.title,
      name: s.name,
      level: s.level,
    });
    setErrors({});
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setEditId(null);
    setForm({ title: "", name: "", level: "" });
    setErrors({});
  };

  const save = async () => {
    if (!validate()) return;

    if (editId) {
      await api.put(`/skills/${editId}`, form);
      toast.success("Skill updated");
    } else {
      await api.post("/skills", form);
      toast.success("Skill added");
    }

    closeDialog();
    fetchData();
  };

  const confirmDelete = async () => {
    await api.delete(`/skills/${deleteId}`);
    toast.success("Skill deleted");
    setDeleteId(null);
    fetchData();
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
        <Typography variant="h4">Skills</Typography>

        <Button variant="contained" onClick={openAddDialog}>
          ADD SKILL
        </Button>
      </Box>

      {list.length === 0 ? (
        <EmptyState text="No skills added yet." />
      ) : (
        <Grid container spacing={2}>
          {list.map((s) => (
            <Grid item xs={12} md={4} key={s._id}>
              <Card
                sx={{
                  p: 1.5,
                  bgcolor: "#F3E5F5",
                  position: "relative",
                  borderRadius: 4,
                  pr: 6,
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 16px 36px rgba(0,0,0,0.18)",
                  },
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    display: "flex",
                    gap: 0.5,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => openEditDialog(s)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setDeleteId(s._id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Typography fontWeight={600} fontSize={14}>
                  {s.title}
                </Typography>
                <Typography fontSize={13}>
                  {s.name} ({s.level})
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/*  ADD / EDIT DIALOG */}
      <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {editId ? "Edit Skill" : "Add Skill"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            margin="dense"
            value={form.title}
            error={!!errors.title}
            helperText={errors.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />
          <TextField
            fullWidth
            label="Skill"
            margin="dense"
            value={form.name}
            error={!!errors.name}
            helperText={errors.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
          <TextField
            fullWidth
            select
            label="Level"
            margin="dense"
            value={form.level}
            error={!!errors.level}
            helperText={errors.level}
            onChange={(e) =>
              setForm({ ...form, level: e.target.value })
            }
          >
            <MenuItem value="Beginner">Beginner</MenuItem>
            <MenuItem value="Intermediate">Intermediate</MenuItem>
            <MenuItem value="Advanced">Advanced</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button variant="contained" onClick={save}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRMATION  */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete skill?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Skill;
