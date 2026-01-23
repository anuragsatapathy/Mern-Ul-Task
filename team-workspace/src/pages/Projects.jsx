import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import {
  Box, Button, TextField, Typography, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Container, Paper, List, ListItem, ListItemText, Divider
} from "@mui/material";
import { Edit, Delete, Save, Close, FolderOpen } from "@mui/icons-material";
import { showSuccess, showError } from "../utils/toast";

const Projects = () => {
  const { workspaceId } = useParams();
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const load = async () => {
    try {
      const res = await axios.get(`/projects?workspaceId=${workspaceId}`);
      setProjects(res.data.data || []);
    } catch (err) {
      showError("Failed to load projects");
    }
  };

  const create = async () => {
    if (!name.trim()) {
      showError("Project name is required");
      return;
    }
    try {
      await axios.post("/projects", { name, workspaceId });
      showSuccess("Project created");
      setName("");
      load();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to create project");
    }
  };

  const startEdit = (project) => {
    setEditId(project.id);
    setEditName(project.name);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
  };

  const saveEdit = async () => {
    if (!editName.trim()) {
      showError("Project name cannot be empty");
      return;
    }
    try {
      await axios.put(`/projects/${editId}`, { name: editName });
      showSuccess("Project updated");
      cancelEdit();
      load();
    } catch (err) {
      showError("Failed to update project");
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/projects/${deleteId}`);
      showSuccess("Project deleted");
      setDeleteId(null);
      load();
    } catch (err) {
      showError("Failed to delete project");
    }
  };

  useEffect(() => {
    if (workspaceId) {
      localStorage.setItem("activeWorkspace", workspaceId);
    }
    load();
  }, [workspaceId]);

  return (
    <Box sx={{ display: "flex", bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Paper sx={{ p: 4, borderRadius: 4, boxShadow: "0 10px 25px rgba(0,0,0,0.03)", border: "1px solid #e2e8f0" }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, color: "#1e293b" }}>Projects</Typography>
          <Typography variant="body1" sx={{ color: "#64748b", mb: 4 }}>Workspace ID: {workspaceId}</Typography>

          <Box sx={{ display: "flex", gap: 2, mb: 5 }}>
            <TextField
              fullWidth
              label="New Project Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />
            <Button 
              variant="contained" 
              onClick={create}
              sx={{ px: 4, borderRadius: 3, fontWeight: 600, textTransform: 'none', bgcolor: '#6366f1' }}
            >
              Add Project
            </Button>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {projects.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <FolderOpen sx={{ fontSize: 48, color: '#e2e8f0', mb: 1 }} />
              <Typography sx={{ color: "#94a3b8" }}>No projects here yet.</Typography>
            </Box>
          ) : (
            <List disablePadding>
              {projects.map((p) => (
                <ListItem
                  key={p.id}
                  sx={{
                    mb: 1.5,
                    borderRadius: 3,
                    border: '1px solid #f1f5f9',
                    '&:hover': { bgcolor: '#f8fafc' },
                    transition: '0.2s'
                  }}
                  secondaryAction={
                    editId === p.id ? (
                      <Box>
                        <IconButton color="primary" onClick={saveEdit}><Save /></IconButton>
                        <IconButton color="error" onClick={cancelEdit}><Close /></IconButton>
                      </Box>
                    ) : (
                      <Box>
                        <IconButton size="small" onClick={() => startEdit(p)} sx={{ color: '#94a3b8' }}><Edit fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => setDeleteId(p.id)} sx={{ color: '#fca5a5' }}><Delete fontSize="small" /></IconButton>
                      </Box>
                    )
                  }
                >
                  {editId === p.id ? (
                    <TextField
                      size="small"
                      autoFocus
                      fullWidth
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      sx={{ mr: 8 }}
                    />
                  ) : (
                    <ListItemText 
                      primary={p.name} 
                      primaryTypographyProps={{ fontWeight: 600, color: "#334155" }} 
                    />
                  )}
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Container>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Project?</DialogTitle>
        <DialogContent><Typography>Are you sure you want to remove this project permanently.</Typography></DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteId(null)} sx={{ color: '#64748b' }}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete} sx={{ borderRadius: 2 }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Projects;