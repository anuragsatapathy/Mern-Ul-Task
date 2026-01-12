import { useEffect, useState, useRef } from "react";
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
  Stack,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import api from "../api/api";
import EmptyState from "../components/EmptyState";

//detect overflow
const OverflowTooltip = ({ text, variant, fontWeight, sx }) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef(null);

  const checkOverflow = () => {
    const element = textRef.current;
    if (element) {
      setIsOverflowing(element.scrollWidth > element.clientWidth);
    }
  };

  useEffect(() => {
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [text]);

  return (
    <Tooltip title={text} disableHoverListener={!isOverflowing} arrow>
      <Typography
        ref={textRef}
        variant={variant}
        fontWeight={fontWeight}
        sx={{
          ...sx,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {text}
      </Typography>
    </Tooltip>
  );
};

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
    try {
      const res = await api.get("/skills");
      const items = res?.data?.data?.items ?? res?.data?.data ?? [];
      setList(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error("Error fetching skills:", error);
      setList([]);
    }
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

    try {
      if (editId) {
        await api.put(`/skills/${editId}`, form);
        toast.success("Skill updated");
      } else {
        await api.post("/skills", form);
        toast.success("Skill added");
      }
      closeDialog();
      fetchData();
    } catch (error) {
      toast.error("Failed to save skill");
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/skills/${deleteId}`);
      toast.success("Skill deleted");
      setDeleteId(null);
      fetchData();
    } catch (error) {
      toast.error("Failed to delete skill");
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          Skills
        </Typography>

        <Button variant="contained" onClick={openAddDialog} sx={{ px: 3 }}>
          ADD SKILL
        </Button>
      </Box>

      {list.length === 0 ? (
        <EmptyState text="No skills added yet." />
      ) : (
        <Grid container spacing={3}>
          {list.map((s) => (
            <Grid item key={s._id}>
              <Card
                sx={{
                  p: 2,
                  width: 260,
                  height: 100,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  background: "linear-gradient(135deg, #F3E5F5 0%, #EDE7F6 100%)",
                  position: "relative",
                  borderRadius: 3,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                  border: "1px solid rgba(0,0,0,0.03)",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
                    borderColor: "primary.main",
                  },
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    display: "flex",
                    gap: 0,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => openEditDialog(s)}
                    sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => setDeleteId(s._id)}
                    sx={{ "&:hover": { bgcolor: "error.lighter" } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Typography
                  variant="caption"
                  fontWeight={800}
                  sx={{
                    color: "primary.dark",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    mb: 0.5,
                  }}
                >
                  {s.title}
                </Typography>

                <OverflowTooltip
                  text={s.name}
                  variant="body1"
                  fontWeight={600}
                  sx={{
                    color: "text.primary",
                    pr: 4,
                  }}
                />

                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", fontStyle: "italic" }}
                >
                  {s.level}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ADD / EDIT DIALOG */}
      <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editId ? "Edit Skill" : "Add Skill"}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Category (e.g., Language, Database)"
              placeholder="e.g. LANGUAGE"
              value={form.title}
              error={!!errors.title}
              helperText={errors.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <TextField
              fullWidth
              label="Skill Name"
              placeholder="e.g. Mern"
              value={form.name}
              error={!!errors.name}
              helperText={errors.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              fullWidth
              select
              label="Proficiency Level"
              value={form.level}
              error={!!errors.level}
              helperText={errors.level}
              onChange={(e) => setForm({ ...form, level: e.target.value })}
            >
              <MenuItem value="Beginner">Beginner</MenuItem>
              <MenuItem value="Intermediate">Intermediate</MenuItem>
              <MenuItem value="Advanced">Advanced</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={closeDialog} color="inherit">
            Cancel
          </Button>
          <Button variant="contained" onClick={save} sx={{ px: 4 }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRMATION */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete this skill?</DialogTitle>
        <DialogActions sx={{ p: 2 }}>
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