import { useEffect, useState } from "react";
import axios from "../api/axios";
import {
  Box, Button, Typography, TextField, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Grid, Card, CardContent, Container
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import Navbar from "../components/Navbar";
import { showSuccess, showError } from "../utils/toast";
import { useNavigate } from "react-router-dom";

const Workspaces = () => {
  const [list, setList] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const navigate = useNavigate();

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/workspaces");
      setList(res.data.data || []);
    } catch {
      showError("Failed to load workspaces");
    } finally {
      setLoading(false);
    }
  };

  const createWorkspace = async () => {
    if (!name.trim()) {
      showError("Workspace name is required");
      return;
    }
    try {
      await axios.post("/workspaces", { name });
      showSuccess("Workspace created");
      setName("");
      fetchWorkspaces();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to create workspace");
    }
  };

  const openEdit = (workspace) => {
    setEditId(workspace.id);
    setEditName(workspace.name);
    setEditOpen(true);
  };

  const updateWorkspace = async () => {
    if (!editName.trim()) {
      showError("Workspace name is required");
      return;
    }
    try {
      await axios.put(`/workspaces/${editId}`, { name: editName });
      showSuccess("Workspace updated");
      setEditOpen(false);
      fetchWorkspaces();
    } catch {
      showError("Failed to update workspace");
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const deleteWorkspace = async () => {
    try {
      await axios.delete(`/workspaces/${deleteId}`);
      showSuccess("Workspace deleted");
      setDeleteOpen(false);
      fetchWorkspaces();
    } catch {
      showError("Failed to delete workspace");
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  return (
    <Box sx={{ display: "flex", bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#1e293b" }}>Workspaces</Typography>
            <Typography variant="body1" sx={{ color: "#64748b" }}>Manage your team environments</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              placeholder="Workspace name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="small"
              sx={{ bgcolor: "white", borderRadius: 2, "& fieldset": { border: "none" }, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
            />
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={createWorkspace}
              sx={{ borderRadius: 2, px: 3, textTransform: 'none', fontWeight: 600, bgcolor: "#6366f1" }}
            >
              Create
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Typography sx={{ color: "#64748b" }}>Loading workspaces...</Typography>
        ) : list.length === 0 ? (
          <Typography sx={{ color: "#64748b", textAlign: 'center', mt: 10 }}>No workspaces found. Create your first workspace above.</Typography>
        ) : (
          <Grid container spacing={3}>
            {list.map((w) => (
              <Grid item xs={12} sm={6} md={4} key={w.id}>
                <Card sx={{ 
                  borderRadius: 4, 
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                  bgcolor: "white",
                  transition: 'all 0.3s ease', 
                  '&:hover': { 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', 
                    transform: 'translateY(-4px)',
                    bgcolor: "#f1f5ff", 
                    borderColor: "#6366f1" 
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: "#1e293b" }}>{w.name}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Button 
                        size="small"
                        onClick={() => {
                          localStorage.setItem("activeWorkspace", w.id);
                          navigate(`/projects/${w.id}`);
                        }}
                        sx={{ fontWeight: 600, textTransform: 'none' }}
                      >
                        Enter Workspace
                      </Button>
                      <Box>
                        <IconButton size="small" onClick={() => openEdit(w)} sx={{ color: '#64748b' }}><EditIcon fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => confirmDelete(w.id)} sx={{ color: '#ef4444' }}><DeleteIcon fontSize="small" /></IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Rename Workspace</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="New Name" value={editName} onChange={(e) => setEditName(e.target.value)} margin="normal" />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditOpen(false)} sx={{ color: '#64748b' }}>Cancel</Button>
          <Button variant="contained" onClick={updateWorkspace} sx={{ borderRadius: 2 }}>Update</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} PaperProps={{ sx: { borderRadius: 3, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Workspace?</DialogTitle>
        <DialogContent><Typography color="#64748b">Are you sure you want to remove this Workspace permanently.</Typography></DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteOpen(false)} sx={{ color: '#64748b' }}>Keep it</Button>
          <Button color="error" variant="contained" onClick={deleteWorkspace} sx={{ borderRadius: 2 }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Workspaces;