import { useEffect, useState, useMemo } from "react";
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
  CircularProgress,
  Chip,
  MenuItem,
  Select,
  Grid,
  Card,
  CardContent,
  Container,
  Tooltip,
  Pagination,
  InputAdornment,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  FolderOpen,
  Assignment as ProjectIcon,
  ChevronRight,
  Search as SearchIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { showSuccess, showError } from "../utils/toast";

const ITEMS_PER_PAGE = 10;

const Projects = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const workspaceRole = localStorage.getItem("workspaceRole");

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create Project State
  const [openCreate, setOpenCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState("");

  // Edit/Delete State
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  
  // Search & Debounce State
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

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
      await axios.post("/projects", { name, description, workspaceId });
      showSuccess("Project created");
      handleCloseCreate();
      loadProjects();
    } catch {
      showError("Failed to create project");
    }
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
    setName("");
    setDescription("");
    setNameError("");
  };

  const updateProject = async () => {
    try {
      await axios.put(`/projects/${editId}`, { name: editName, description: editDescription });
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

  // Filter uses debounced value
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => p.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
  }, [projects, debouncedSearch]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);

  const paginatedProjects = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProjects, page]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* TOP SECTION */}
        <Box sx={{ mb: 6 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={5}>
              <Typography variant="h3" sx={{ fontWeight: 800, color: "#1e293b", mb: 1, letterSpacing: "-1px" }}>
                Workspace Projects
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Chip
                  label={`ID: ${workspaceId}`}
                  size="small"
                  sx={{ bgcolor: "#6366f1", color: "#fff", fontWeight: 700, px: 1 }}
                />
                <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
                  Managing {projects.length} project(s)
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={7} sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              alignItems: 'center', 
              gap: 2 
            }}>
              <TextField
                placeholder="Search projects..."
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#94a3b8" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  flexGrow: 1,
                  maxWidth: "400px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    bgcolor: "#fff",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
                  },
                }}
              />
              
              <RoleGuard allow={["owner", "admin"]} role={workspaceRole}>
                <Button
                  variant="contained"
                  disableElevation
                  startIcon={<AddIcon />}
                  onClick={() => setOpenCreate(true)}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    whiteSpace: 'nowrap',
                    textTransform: "none",
                    fontWeight: 800,
                    bgcolor: "#6366f1",
                    "&:hover": { bgcolor: "#4f46e5" },
                    height: '40px'
                  }}
                >
                  Add Project
                </Button>
              </RoleGuard>
            </Grid>
          </Grid>
        </Box>

        {/* PROJECTS GRID */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress thickness={5} sx={{ color: "#6366f1" }} />
          </Box>
          ) : projects.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 12, bgcolor: "#fff", borderRadius: 8, border: "2px dashed #e2e8f0" }}>
                <FolderOpen sx={{ fontSize: 80, color: "#cbd5e1", mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: "#94a3b8" }}>
                  Empty Workspace
                </Typography>
                <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
                  Start by creating your first project.
                </Typography>
              </Box>
            ) : filteredProjects.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 12 }}>
                <Typography variant="h6" sx={{ color: "#94a3b8", fontWeight: 700 }}>
                  No projects found
                </Typography>
                <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
                  Try a different search keyword.
                </Typography>
              </Box>
            ) : (

          <>
            <Grid container spacing={4}>
              {paginatedProjects.map((p) => (
                <Grid item xs={12} sm={6} key={p.id}>
                  <Card
                    onClick={() => {
                      if (editId === p.id) return;
                      localStorage.setItem("activeProject", p.id);
                      navigate(`/project-preview/${p.id}`);
                    }}
                    sx={{
                      borderRadius: 5,
                      border: "1px solid #e2e8f0",
                      borderLeft: `6px solid ${p.status === 'archived' ? '#f87171' : '#6366f1'}`,
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      cursor: "pointer",
                      position: "relative",
                      overflow: "visible",
                      "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                        borderColor: "#6366f1",
                      },
                    }}
                  >
                    {/* Floating Action Buttons */}
                    {editId !== p.id && (
                      <Box sx={{ position: "absolute", top: -15, right: 15, display: "flex", gap: 1 }}>
                        <RoleGuard allow={["owner", "admin"]} role={workspaceRole}>
                          <Tooltip title="Edit">
                            <Avatar sx={{ bgcolor: "#fff", color: "#64748b", width: 32, height: 32, boxShadow: 2, cursor: 'pointer', "&:hover": { color: "#6366f1" } }}
                              onClick={(e) => { e.stopPropagation(); setEditId(p.id); setEditName(p.name); setEditDescription(p.description || ""); }}>
                              <EditIcon sx={{ fontSize: 18 }} />
                            </Avatar>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <Avatar sx={{ bgcolor: "#fff", color: "#fca5a5", width: 32, height: 32, boxShadow: 2, cursor: 'pointer', "&:hover": { color: "#ef4444" } }}
                              onClick={(e) => { e.stopPropagation(); setDeleteId(p.id); }}>
                              <DeleteIcon sx={{ fontSize: 18 }} />
                            </Avatar>
                          </Tooltip>
                        </RoleGuard>
                      </Box>
                    )}

                    <CardContent sx={{ p: 4 }}>
                      {editId === p.id ? (
                        <Box>
                          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 800, color: "#6366f1" }}>MODIFYING PROJECT</Typography>
                          <TextField fullWidth size="small" label="Name" value={editName} onChange={(e) => setEditName(e.target.value)} sx={{ mb: 2 }} />
                          <TextField fullWidth size="small" label="Description" multiline rows={2} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} sx={{ mb: 2 }} />
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button variant="contained" size="small" onClick={updateProject} sx={{ borderRadius: 2, bgcolor: "#6366f1", textTransform: 'none' }}>Save</Button>
                            <Button variant="text" size="small" onClick={() => setEditId(null)} sx={{ textTransform: 'none', color: "#64748b" }}>Cancel</Button>
                          </Box>
                        </Box>
                      ) : (
                        <Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                            <Avatar sx={{ bgcolor: "#f1f5f9", color: "#6366f1" }}><ProjectIcon /></Avatar>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b", letterSpacing: "-0.5px" }}>{p.name}</Typography>
                          </Box>

                          <Typography variant="body2" sx={{ color: "#64748b", mb: 3, minHeight: "40px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.6 }}>
                            {p.description || "No description provided for this project."}
                          </Typography>

                          <Divider sx={{ my: 2, opacity: 0.6 }} />

                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <RoleGuard allow={["owner", "admin"]} role={workspaceRole}>
                                  <Box onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                                    <Select
                                      size="small"
                                      variant="standard"
                                      disableUnderline
                                      value={p.status || "active"}
                                      onChange={(e) => updateStatus(p.id, e.target.value)}
                                      sx={{
                                        fontSize: "0.65rem",
                                        fontWeight: 900,
                                        textTransform: "uppercase",
                                        bgcolor: p.status === "archived" ? "#fee2e2" : "#dcfce7",
                                        color: p.status === "archived" ? "#991b1b" : "#166534",
                                        px: 1.5,
                                        borderRadius: 1,
                                      }}
                                    >
                                      <MenuItem value="active">Active</MenuItem>
                                      <MenuItem value="archived">Archived</MenuItem>
                                    </Select>
                                  </Box>
                                </RoleGuard>

                              <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 600 }}>
                               By • {p.createdBy?.name || "Member"}
                              </Typography>
                            </Box>

                            <Button
                              endIcon={<ChevronRight />}
                              onClick={(e) => {
                                e.stopPropagation();
                                localStorage.setItem("activeProject", p.id);
                                navigate(`/tasks/${p.id}`);
                              }}
                              sx={{
                                textTransform: "none",
                                fontWeight: 800,
                                color: "#6366f1",
                                "&:hover": { bgcolor: "transparent", color: "#4f46e5", transform: "translateX(4px)" },
                                transition: "all 0.2s"
                              }}
                            >
                              Tasks
                            </Button>
                          </Box>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, v) => setPage(v)}
                  sx={{
                    "& .MuiPaginationItem-root": { fontWeight: 700, borderRadius: 2 },
                    "& .Mui-selected": { bgcolor: "#6366f1 !important", color: "#fff" }
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>

      {/* CREATE PROJECT DIALOG */}
      <Dialog 
        open={openCreate} 
        onClose={handleCloseCreate}
        PaperProps={{
          sx: { borderRadius: 4, p: 1, width: '100%', maxWidth: '500px' }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>Create New Project</Typography>
          <IconButton onClick={handleCloseCreate} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="Project Name"
              placeholder="e.g. Marketing Campaign"
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError(""); }}
              error={!!nameError}
              helperText={nameError}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />
            <TextField
              fullWidth
              label="Description (Optional)"
              placeholder="What is this project about?"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseCreate} sx={{ color: '#64748b', fontWeight: 700, textTransform: 'none' }}>Cancel</Button>
          <Button 
            onClick={createProject} 
            variant="contained" 
            disableElevation
            sx={{ 
              borderRadius: 2, 
              bgcolor: '#6366f1', 
              fontWeight: 800, 
              textTransform: 'none',
              px: 4,
              "&:hover": { bgcolor: '#4f46e5' }
            }}
          >
            Create Project
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Project ?"
        message="This will permanently delete the project and all associated data.."
        confirmText="Yes, Delete"
        onConfirm={deleteProject}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  );
};

export default Projects;