import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Stack,
  InputBase,
  Pagination,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  LayersOutlined,
  FolderSpecialOutlined as FolderIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Assignment as ProjectIcon,
  EditOutlined as EditIcon,
  DeleteOutline as DeleteIcon,
  ArrowForwardRounded as ArrowIcon,
} from "@mui/icons-material";
import { showError, showSuccess } from "../utils/toast";

const AllProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
// const user = JSON.parse(localStorage.getItem("user") || "{}");
// const userRole = user?.role?.toLowerCase();

const canEditProject = (project) => {
  return ["owner", "admin"].includes(project.myRole);
};


  
  // UI States
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Dialog States
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Form States
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Debouncing Search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const loadAllProjects = async () => {
    try {
      setLoading(true);
      const wsRes = await axios.get("/workspaces");
      const workspaces = wsRes.data.data || [];

      let allProjects = [];
      for (const ws of workspaces) {
        const projRes = await axios.get("/projects", { params: { workspaceId: ws.id } });
        const workspaceProjects = (projRes.data.data || []).map((p) => ({
          ...p,
          workspaceName: ws.name,
          wsId: ws.id,
          myRole: ws.myRole
        }));
        allProjects.push(...workspaceProjects);
      }
      const uniqueProjects = Array.from(new Map(allProjects.map((p) => [p.id, p])).values());
      setProjects(uniqueProjects);
    } catch (err) {
      showError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllProjects();
  }, []);

  // Handlers
  const handleOpenEdit = (project) => {
    setSelectedProject(project);
    setFormName(project.name);
    setFormDesc(project.description || "");
    setIsEditing(true);
    setOpenCreate(true);
  };

  const handleDeleteClick = (project) => {
    setSelectedProject(project);
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/projects/${selectedProject.id}`);
      showSuccess("Project removed successfully");
      setOpenDelete(false);
      loadAllProjects();
    } catch (err) {
      showError("Could not delete project");
    }
  };

  const handleSaveProject = async () => {
    if (!formName.trim()) return showError("Name is required");
    try {
      if (isEditing) {
        await axios.put(`/projects/${selectedProject.id}`, { name: formName, description: formDesc });
        showSuccess("Project updated");
      } else {
        const wsId = localStorage.getItem("activeWorkspace") || projects[0]?.wsId;
        await axios.post("/projects", { name: formName, description: formDesc, workspaceId: wsId });
        showSuccess("Project created");
      }
      setOpenCreate(false);
      setFormName("");
      setFormDesc("");
      loadAllProjects();
    } catch (err) {
      showError("Action failed");
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((p) =>
      p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(debouncedSearch.toLowerCase()))
    );
  }, [projects, debouncedSearch]);

  const currentData = filteredProjects.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ py: 6, px: { md: 8 } }}>
        {/* HEADER */}
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems="center" spacing={3} mb={6}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: "white", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", display: "flex" }}>
              <LayersOutlined sx={{ fontSize: "2.2rem", color: "#6366f1" }} />
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 900, color: "#0f172a", letterSpacing: "-1.5px" }}>Project Directory</Typography>
              <Typography variant="body1" sx={{ color: "#64748b", fontWeight: 500 }}>Manage and track all projects across your workspaces</Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Paper elevation={0} sx={{ p: "6px 16px", display: "flex", alignItems: "center", width: 350, borderRadius: 4, border: "1px solid #e2e8f0" }}>
              <SearchIcon sx={{ color: "#94a3b8", mr: 1 }} />
              <InputBase fullWidth placeholder="Search projects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </Paper>
           {projects.some(p => ["owner","admin"].includes(p.myRole)) && (


              <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setIsEditing(false); setOpenCreate(true); }} sx={{ bgcolor: "#6366f1", borderRadius: 3, px: 3, fontWeight: 800 }}>
                Add Project
              </Button>
            )}
          </Stack>
        </Stack>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 20 }}><CircularProgress thickness={5} size={60} /></Box>
        ) : (
          <Grid container spacing={4}>
            {currentData.map((project) => (
              <Grid item xs={12} sm={6} lg={4} key={project.id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4, height: "100%", borderRadius: 6, border: "1px solid #e2e8f0", bgcolor: "white",
                    position: "relative", overflow: "hidden", transition: "all 0.3s ease",
                    "&:hover": { transform: "translateY(-8px)", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", borderColor: "#6366f1" }
                  }}
                >
                  {/* TOP ACTIONS */}
                  <Stack direction="row" justifyContent="space-between" mb={3}>
                    <Chip label={project.workspaceName} size="small" sx={{ bgcolor: "#eef2ff", color: "#6366f1", fontWeight: 800, fontSize: "0.6rem" }} />
                    {canEditProject(project) && (

                      <Stack direction="row" spacing={0.5}>
                        <IconButton size="small" onClick={() => handleOpenEdit(project)} sx={{ color: "#94a3b8", "&:hover": { color: "#6366f1", bgcolor: "#eef2ff" } }}><EditIcon fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => handleDeleteClick(project)} sx={{ color: "#94a3b8", "&:hover": { color: "#ef4444", bgcolor: "#fef2f2" } }}><DeleteIcon fontSize="small" /></IconButton>
                      </Stack>
                    )}
                  </Stack>

                  {/* PROJECT INFO */}
                  <Stack direction="row" alignItems="center" spacing={1.5} mb={1}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>{project.name}</Typography>
                    <Chip label={project.status || "active"} size="small" sx={{ height: 20, fontSize: "0.6rem", fontWeight: 900, bgcolor: "#dcfce7", color: "#15803d" }} />
                  </Stack>

                  <Typography variant="body2" sx={{ color: "#64748b", mb: 4, height: 40, overflow: "hidden" }}>{project.description || "No description provided for this project."}</Typography>

                  {/* FOOTER & NAVIGATION */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 3, borderTop: "1px solid #f1f5f9" }}>
                    <Box>
                      <Typography variant="caption" sx={{ color: "#94a3b8", display: "block", fontWeight: 700 }}>OWNER</Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#334155" }}>{project.createdBy?.name || "Team Member"}</Typography>
                    </Box>
                    <Button 
                      variant="text" 
                      endIcon={<ArrowIcon />} 
                     onClick={() => {
                        localStorage.setItem("activeProject", project.id);
                        navigate(`/tasks/${project.id}`);
                      }}

                      sx={{ color: "#6366f1", fontWeight: 800, textTransform: "none", borderRadius: 2, "&:hover": { bgcolor: "#eef2ff" } }}
                    >
                      View Tasks
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* CREATE/EDIT DIALOG */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} PaperProps={{ sx: { borderRadius: 5, p: 2, width: 450 } }}>
        <DialogTitle sx={{ fontWeight: 900 }}>{isEditing ? "Edit Project" : "New Project"}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} mt={1}>
            <TextField fullWidth label="Project Name" value={formName} onChange={(e) => setFormName(e.target.value)} />
            <TextField fullWidth multiline rows={3} label="Description" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveProject} sx={{ bgcolor: "#6366f1", borderRadius: 3 }}>{isEditing ? "Save Changes" : "Create Project"}</Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRMATION */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle sx={{ fontWeight: 800 }}>Delete Project?</DialogTitle>
        <DialogContent><Typography>Are you sure all tasks in <b>{selectedProject?.name}</b> will be lost.</Typography></DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button onClick={confirmDelete} sx={{ color: "#ef4444", fontWeight: 700 }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllProjects;