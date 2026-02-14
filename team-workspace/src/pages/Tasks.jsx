import { useEffect, useState, useMemo } from "react";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Container,
  Divider,
  TextField,
  Pagination,
  InputAdornment,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Paper,
  Fade,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { showError, showSuccess } from "../utils/toast";

const ITEMS_PER_PAGE = 9;

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [openCreate, setOpenCreate] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [errors, setErrors] = useState({});

  const workspaceRole = localStorage.getItem("workspaceRole")?.toLowerCase() || "member";
  const canCreateTask = ["owner", "admin"].includes(workspaceRole);

  const [form, setForm] = useState({
    title: "",
    description: "",
    workspaceId: "",
    projectId: "",
    assigneeId: "",
    status: "todo",
    priority: "medium",
    dueDate: "",
  });

  /* LOGIC (UNCHANGED) */
  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/tasks");
      const taskData = res.data.data || [];
      setTasks(taskData);
      if (taskData.length > 0) {
        const role = taskData[0]?.project?.workspace?.role?.toLowerCase?.();
        if (role) localStorage.setItem("workspaceRole", role);
      }
    } catch (err) {
      showError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTasks(); }, []);

  const loadWorkspaces = async () => {
    const res = await axios.get("/workspaces");
    const data = res.data.data || [];
    setWorkspaces(data);
    return data;
  };

  const loadProjects = async (workspaceId) => {
    const res = await axios.get("/projects", { params: { workspaceId } });
    setProjects(res.data.data || []);
  };

  const loadMembersByProject = async (projectId) => {
    const res = await axios.get(`/workspaces/members/by-project/${projectId}`);
    setMembers(res.data.data || []);
  };

  const validate = () => {
    const newErr = {};
    Object.keys(form).forEach(key => {
      if (!form[key]) newErr[key] = "Required";
    });
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleCreateTask = async () => {
    if (!validate()) {
      showError("All fields are mandatory");
      return;
    }
    try {
      await axios.post("/tasks", { ...form });
      showSuccess("Task created");
      setOpenCreate(false);
      resetForm();
      loadTasks();
    } catch {
      showError("Create failed");
    }
  };

  const handleUpdateTask = async () => {
    if (!validate()) {
      showError("All fields are mandatory");
      return;
    }
    try {
      await axios.put(`/tasks/${editingTaskId}`, { ...form });
      showSuccess("Task updated");
      setOpenCreate(false);
      resetForm();
      loadTasks();
    } catch {
      showError("Update failed");
    }
  };

  const handleDelete = async (task) => {
    if (workspaceRole === "member") return;
    try {
      await axios.delete(`/tasks/${task.id}`);
      showSuccess("Task deleted");
      loadTasks();
    } catch {
      showError("Delete failed");
    }
  };

  const handleEdit = async (task) => {
    const wsList = await loadWorkspaces();
    const workspace = wsList.find(w => w.name === task.project?.workspace?.name);
    const workspaceId = workspace?.id || "";
    const projectId = task.project?.id || "";

    if (workspaceId) {
      const res = await axios.get("/projects", { params: { workspaceId } });
      setProjects(res.data.data || []);
    }
    if (projectId) {
      const res = await axios.get(`/workspaces/members/by-project/${projectId}`);
      setMembers(res.data.data || []);
    }

    setForm({
      title: task.title || "",
      description: task.description || "",
      workspaceId,
      projectId,
      assigneeId: task.user?.id || "",
      status: task.status?.toLowerCase().replace("_", "-") || "todo",
      priority: task.priority?.toLowerCase() || "medium",
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
    });

    setEditingTaskId(task.id);
    setIsEditMode(true);
    setOpenCreate(true);
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      workspaceId: "",
      projectId: "",
      assigneeId: "",
      status: "todo",
      priority: "medium",
      dueDate: "",
    });
    setErrors({});
    setIsEditMode(false);
    setEditingTaskId(null);
  };

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => t.title.toLowerCase().includes(debouncedSearch.toLowerCase()));
  }, [tasks, debouncedSearch]);

  const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
  const paginatedTasks = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredTasks.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTasks, page]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F1F5F9" }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ py: 6, px: { md: 8 }, mt: 2 }}>
        {/* HEADER SECTION */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: { md: "center" }, mb: 5, gap: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Paper elevation={0} sx={{ p: 1, bgcolor: "#6366F1", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AssignmentOutlinedIcon sx={{ color: "white", fontSize: "2rem" }} />
            </Paper>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "#1E293B", letterSpacing: "-0.02em" }}>Tasks</Typography>
              <Typography variant="body2" sx={{ color: "#64748B" }}>Manage and track your team's progress</Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: { xs: "100%", md: "auto" } }}>
            <TextField
              placeholder="Search tasks..."
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                width: { md: 300 }
              }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#94A3B8" }} /></InputAdornment>
              }}
            />

            {canCreateTask && (
              <Button
                variant="contained"
                disableElevation
                startIcon={<AddRoundedIcon />}
                onClick={() => { loadWorkspaces(); resetForm(); setOpenCreate(true); }}
                sx={{
                  bgcolor: "#6366F1",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  borderRadius: 2,
                  "&:hover": { bgcolor: "#4F46E5" }
                }}
              >
                Add Task
              </Button>
            )}
          </Stack>
        </Box>

        <Divider sx={{ mb: 5, borderColor: "#E2E8F0" }} />

        {/* CONTENT SECTION */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 20 }}>
            <CircularProgress thickness={5} sx={{ color: "#6366F1" }} />
          </Box>
        ) : (
          <Fade in={!loading}>
            <Grid container spacing={3}>
              {paginatedTasks.length > 0 ? (
                paginatedTasks.map((task) => (
                  <Grid item xs={12} sm={6} lg={4} key={task.id}>
                    <TaskCard
                      task={task}
                      role={workspaceRole}
                      onDelete={workspaceRole !== "member" ? handleDelete : null}
                      onEdit={workspaceRole !== "member" ? handleEdit : null}
                      onUpdate={loadTasks}
                    />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: "center", py: 10 }}>
                    <Typography variant="h6" color="textSecondary">No tasks found.</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Fade>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, v) => setPage(v)}
              shape="rounded"
              color="primary"
              sx={{ "& .MuiPaginationItem-root": { fontWeight: 600 } }}
            />
          </Box>
        )}
      </Container>

      {/* CREATE/EDIT DIALOG */}
      <Dialog
        open={openCreate}
        onClose={() => { setOpenCreate(false); resetForm(); }}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: 3, p: 1 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: "1.5rem", color: "#1E293B" }}>
          {isEditMode ? "Edit Task" : "Create New Task"}
        </DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2, pb: 2 }}>
          <TextField
            label="Title"
            fullWidth
            variant="outlined"
            error={!!errors.title}
            helperText={errors.title}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            error={!!errors.description}
            helperText={errors.description}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          {/* FIXED WORKSPACE & PROJECT VISIBILITY */}
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
            <FormControl fullWidth error={!!errors.workspaceId} variant="outlined">
              <InputLabel id="workspace-label">Workspace</InputLabel>
              <Select
                labelId="workspace-label"
                value={form.workspaceId}
                label="Workspace"
                onChange={(e) => {
                  const wsId = e.target.value;
                  setForm({ ...form, workspaceId: wsId, projectId: "", assigneeId: "" });
                  loadProjects(wsId);
                }}
              >
                {workspaces.map(w => <MenuItem key={w.id} value={w.id}>{w.name}</MenuItem>)}
              </Select>
              {errors.workspaceId && <FormHelperText>{errors.workspaceId}</FormHelperText>}
            </FormControl>

            <FormControl fullWidth error={!!errors.projectId} variant="outlined" disabled={!form.workspaceId}>
              <InputLabel id="project-label">Project</InputLabel>
              <Select
                labelId="project-label"
                value={form.projectId}
                label="Project"
                onChange={(e) => {
                  const pId = e.target.value;
                  setForm({ ...form, projectId: pId });
                  loadMembersByProject(pId);
                }}
              >
                {projects.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
              </Select>
              {errors.projectId && <FormHelperText>{errors.projectId}</FormHelperText>}
            </FormControl>
          </Box>

          <FormControl fullWidth error={!!errors.assigneeId} variant="outlined" disabled={!form.projectId}>
            <InputLabel id="assign-label">Assign To</InputLabel>
            <Select
              labelId="assign-label"
              value={form.assigneeId}
              label="Assign To"
              onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}
            >
              {members.map(m => (
                <MenuItem key={m.user.id} value={m.user.id}>
                  {m.user.name} ({m.role})
                </MenuItem>
              ))}
            </Select>
            {errors.assigneeId && <FormHelperText>{errors.assigneeId}</FormHelperText>}
          </FormControl>

          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                value={form.status}
                label="Status"
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <MenuItem value="todo">To Do</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="done">Done</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel id="priority-label">Priority</InputLabel>
              <Select
                labelId="priority-label"
                value={form.priority}
                label="Priority"
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TextField
            type="date"
            label="Due Date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            error={!!errors.dueDate}
            helperText={errors.dueDate}
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => { setOpenCreate(false); resetForm(); }} sx={{ color: "#64748B", fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={isEditMode ? handleUpdateTask : handleCreateTask}
            sx={{ bgcolor: "#6366F1", px: 4, borderRadius: 2, fontWeight: 600 }}
          >
            {isEditMode ? "Update Task" : "Create Task"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tasks;