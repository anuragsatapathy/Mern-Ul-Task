import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import RoleGuard from "../components/RoleGuard";
import ConfirmDialog from "../components/ConfirmDialog";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  Divider,
  CircularProgress,
  Chip,
  MenuItem,
  Select,
  Grid,
  Card,
  CardContent,
  Container,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  FolderOpen,
  Assignment as ProjectIcon,
  ChevronRight,
} from "@mui/icons-material";
import { showSuccess, showError } from "../utils/toast";

const Projects = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const workspaceRole = localStorage.getItem("workspaceRole");

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState("");

  // Edit
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Delete
  const [deleteId, setDeleteId] = useState(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/projects?workspaceId=${workspaceId}`);
      setProjects(res.data.data || []);
    } catch {
      showError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workspaceId) {
      localStorage.setItem("activeWorkspace", workspaceId);
      loadProjects();
    }
  }, [workspaceId]);

  const createProject = async () => {
    if (!name.trim()) {
      setNameError("Project name is required");
      return;
    }

    try {
      await axios.post("/projects", {
        name,
        description,
        workspaceId,
      });
      showSuccess("Project created");
      setName("");
      setDescription("");
      setNameError("");
      loadProjects();
    } catch {
      showError("Failed to create project");
    }
  };

  const updateProject = async () => {
    try {
      await axios.put(`/projects/${editId}`, {
        name: editName,
        description: editDescription,
      });
      showSuccess("Project updated");
      setEditId(null);
      loadProjects();
    } catch {
      showError("Failed to update project");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/projects/${id}`, { status });
      showSuccess("Status updated");
      loadProjects();
    } catch {
      showError("Failed to update status");
    }
  };

  const deleteProject = async () => {
    try {
      await axios.delete(`/projects/${deleteId}`);
      showSuccess("Project deleted");
      setDeleteId(null);
      loadProjects();
    } catch {
      showError("Failed to delete project");
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f1f5f9" }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* HEADER SECTION */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#0f172a", mb: 1 }}>
            Projects
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
                label={`Workspace: ${workspaceId}`} 
                size="small" 
                sx={{ bgcolor: "#e2e8f0", fontWeight: 600, color: "#475569", borderRadius: 1.5 }} 
            />
            <Typography variant="body2" sx={{ color: "#64748b" }}>
               • Manage your goals and project milestones
            </Typography>
          </Box>
        </Box>

        {/* CREATE PROJECT BAR */}
        <RoleGuard allow={["owner", "admin"]} role={workspaceRole}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 2, mb: 6, borderRadius: 4, 
              border: "1px solid #e2e8f0", 
              bgcolor: "#ffffff",
              display: "flex", gap: 2, alignItems: "center",
              flexWrap: { xs: "wrap", md: "nowrap" },
              boxShadow: "0 2px 10px rgba(0,0,0,0.02)"
            }}
          >
            <TextField
              fullWidth size="small" placeholder="Project title"
              value={name} onChange={(e) => { setName(e.target.value); setNameError(""); }}
              error={!!nameError} helperText={nameError}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: "#f8fafc" } }}
            />
            <TextField
              fullWidth size="small" placeholder="Quick description..."
              value={description} onChange={(e) => setDescription(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3, bgcolor: "#f8fafc" } }}
            />
            <Button
              variant="contained" disableElevation startIcon={<AddIcon />}
              onClick={createProject}
              sx={{ 
                borderRadius: 3, px: 4, py: 1, 
                textTransform: "none", fontWeight: 700, 
                bgcolor: "#6366f1", "&:hover": { bgcolor: "#4f46e5" },
                minWidth: "130px", height: "40px"
              }}
            >
              Create
            </Button>
          </Paper>
        </RoleGuard>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: "#6366f1" }} />
          </Box>
        ) : projects.length === 0 ? (
          <Box sx={{ textAlign: "center", mt: 10, p: 5, bgcolor: '#fff', borderRadius: 4, border: '1px dashed #cbd5e1' }}>
            <FolderOpen sx={{ fontSize: 64, color: "#cbd5e1", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" fontWeight={600}>No projects found</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {projects.map((p) => (
              <Grid item xs={12} sm={6} key={p.id}>
               <Card
                    onClick={() => {
                      localStorage.setItem("activeProject", p.id);
                      navigate(`/project-preview/${p.id}`);
                    }}
                    sx={{
                      cursor: "pointer",
                      borderRadius: 4,
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                      transition: "all 0.2s ease-in-out",
                      position: "relative",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 15px 30px -10px rgba(0,0,0,0.1)",
                        borderColor: "#6366f1",
                      },
                    }}
                  >

                  
                  {/* ACTIONS HIDDEN DURING EDIT */}
                  {editId !== p.id && (
                    <Box sx={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 0.5 }}>
                      <RoleGuard allow={["owner", "admin"]} role={workspaceRole}>
                        <Tooltip title="Edit">
                          <IconButton 
                            size="small" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditId(p.id);
                              setEditName(p.name);
                              setEditDescription(p.description || "");
                            }}
                            sx={{ color: '#94a3b8', '&:hover': { color: '#6366f1', bgcolor: '#f1f5f9' } }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            size="small" 
                            onClick={(e) =>{
                            e.stopPropagation();
                            setDeleteId(p.id)}}
                            sx={{ color: '#fca5a5', '&:hover': { color: '#ef4444', bgcolor: '#fef2f2' } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </RoleGuard>
                    </Box>
                  )}

                  <CardContent sx={{ p: 3 }}>
                    {editId === p.id ? (
                      <Box sx={{ pt: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: '#6366f1' }}>Editing Project</Typography>
                        <TextField
                          fullWidth size="small" label="Name"
                          value={editName} onChange={(e) => setEditName(e.target.value)}
                          sx={{ mb: 1.5 }}
                        />
                        <TextField
                          fullWidth size="small" label="Description"
                          multiline rows={2}
                          value={editDescription} onChange={(e) => setEditDescription(e.target.value)}
                          sx={{ mb: 2 }}
                        />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button 
                            variant="contained" size="small" onClick={updateProject} 
                            sx={{ borderRadius: 2, bgcolor: '#6366f1', textTransform: 'none', px: 3 }}
                          >
                            Save Changes
                          </Button>
                          <Button 
                            variant="text" size="small" onClick={() => setEditId(null)}
                            sx={{ borderRadius: 2, color: '#64748b', textTransform: 'none' }}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                            <Box sx={{ bgcolor: '#f1f5f9', p: 1, borderRadius: 2, display: 'flex' }}>
                                <ProjectIcon sx={{ color: '#6366f1', fontSize: 20 }} />
                            </Box>
                            <Typography 
                                variant="h6" 
                                sx={{ fontWeight: 800, color: "#1e293b", letterSpacing: '-0.3px' }}
                            >
                                {p.name}
                            </Typography>
                        </Box>
                        
                        <Typography variant="body2" sx={{ color: "#64748b", mb: 4, height: '44px', overflow: 'hidden', lineHeight: 1.6 }}>
                          {p.description || "No description provided."}
                        </Typography>

                        <Divider sx={{ mb: 2, opacity: 0.5 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <RoleGuard allow={["owner", "admin"]} role={workspaceRole}>
                                    <Select
                                        size="small" variant="standard" disableUnderline
                                        value={p.status || "active"}
                                        onChange={(e) => updateStatus(p.id, e.target.value)}
                                        sx={{ 
                                            fontSize: '0.7rem', fontWeight: 800, 
                                            textTransform: 'uppercase', 
                                            color: p.status === 'archived' ? '#ef4444' : '#10b981',
                                            bgcolor: p.status === 'archived' ? '#fef2f2' : '#ecfdf5',
                                            px: 1.5, py: 0.5, borderRadius: 1.5
                                        }}
                                    >
                                        <MenuItem value="active">Active</MenuItem>
                                        <MenuItem value="archived">Archived</MenuItem>
                                    </Select>
                                </RoleGuard>
                                
                                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
                                    By: {p.createdBy?.name || "User"}
                                </Typography>
                            </Box>

                            <Button 
                                size="small" 
                                endIcon={<ChevronRight />}
                                onClick={() => {
                                    localStorage.setItem("activeProject", p.id);
                                    navigate(`/tasks/${p.id}`);
                                }}
                                sx={{ 
                                    textTransform: 'none', fontWeight: 700, 
                                    color: '#6366f1', borderRadius: 2,
                                    '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.08)' }
                                }}
                            >
                                View Tasks
                            </Button>
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Project?"
        message="This will permanently delete the project and all associated tasks."
        confirmText="Confirm Delete"
        onConfirm={deleteProject}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  );
};

export default Projects;