import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Assignment as TaskIcon,
  Edit,
  Delete,
  Save,
  Close,
} from "@mui/icons-material";
import { showError, showSuccess } from "../utils/toast";

const Tasks = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const [deleteId, setDeleteId] = useState(null);

  const load = async () => {
    try {
      const res = await axios.get(`/tasks?projectId=${projectId}`);
      setTasks(res.data.data || []);
    } catch {
      showError("Failed to load tasks");
    }
  };

  const create = async () => {
    if (!title.trim()) {
      showError("Task title is required");
      return;
    }
    try {
      await axios.post("/tasks", { title, projectId });
      showSuccess("Task added");
      setTitle("");
      load();
    } catch {
      showError("Failed to create task");
    }
  };

  const startEdit = (task) => {
    setEditId(task.id);
    setEditTitle(task.title);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle("");
  };

  const saveEdit = async () => {
    if (!editTitle.trim()) {
      showError("Task title cannot be empty");
      return;
    }
    try {
      await axios.put(`/tasks/${editId}`, { title: editTitle });
      showSuccess("Task updated");
      cancelEdit();
      load();
    } catch {
      showError("Failed to update task");
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/tasks/${deleteId}`);
      showSuccess("Task deleted");
      setDeleteId(null);
      load();
    } catch {
      showError("Failed to delete task");
    }
  };

  useEffect(() => {
    load();
  }, [projectId]);

  return (
    <Box sx={{ display: "flex", bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <Navbar />

      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper 
          sx={{ 
            p: 4, 
            borderRadius: 4, 
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)", 
            border: "1px solid #e2e8f0",
            bgcolor: "#fff"
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b", mb: 1 }}>
              Tasks
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
              Manage and track your project deliverables
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
            <TextField
              fullWidth
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              size="small"
              sx={{ 
                "& .MuiOutlinedInput-root": { 
                  borderRadius: 3,
                  bgcolor: "#fcfdfe" 
                } 
              }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={create}
              sx={{ 
                px: 3, 
                borderRadius: 3, 
                fontWeight: 600, 
                textTransform: "none",
                bgcolor: "#6366f1",
                "&:hover": { bgcolor: "#4f46e5" }
              }}
            >
              Add Task
            </Button>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Task List */}
          {tasks.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 10 }}>
              <TaskIcon sx={{ fontSize: 60, color: "#e2e8f0", mb: 2 }} />
              <Typography sx={{ color: "#94a3b8", fontWeight: 500 }}>
                No tasks found. Start by adding one above!
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {tasks.map((t) => (
                <ListItem
                  key={t.id}
                  sx={{
                    mb: 2,
                    border: "1px solid #f1f5f9",
                    borderRadius: 3,
                    transition: "all 0.2s ease",
                    "&:hover": { 
                      borderColor: "#6366f1",
                      bgcolor: "#f8faff",
                      transform: "translateX(4px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
                    },
                  }}
                  secondaryAction={
                    editId === t.id ? (
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton onClick={saveEdit} color="primary" size="small">
                          <Save fontSize="small" />
                        </IconButton>
                        <IconButton onClick={cancelEdit} color="error" size="small">
                          <Close fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton onClick={() => startEdit(t)} size="small" sx={{ color: "#94a3b8" }}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => setDeleteId(t.id)} size="small" sx={{ color: "#fca5a5" }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    )
                  }
                >
                  <ListItemIcon sx={{ minWidth: 48 }}>
                    <Checkbox 
                      sx={{ 
                        color: "#cbd5e1", 
                        "&.Mui-checked": { color: "#6366f1" } 
                      }} 
                    />
                  </ListItemIcon>

                  {editId === t.id ? (
                    <TextField
                      fullWidth
                      size="small"
                      autoFocus
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      sx={{ mr: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    />
                  ) : (
                    <ListItemText 
                      primary={t.title} 
                      primaryTypographyProps={{ 
                        fontWeight: 500, 
                        color: "#334155",
                        fontSize: "0.95rem"
                      }} 
                    />
                  )}
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Container>

      <Dialog 
        open={!!deleteId} 
        onClose={() => setDeleteId(null)}
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Task?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#64748b" }}>
            This action is permanent and cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ color: "#64748b", textTransform: 'none' }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={confirmDelete}
            sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tasks;