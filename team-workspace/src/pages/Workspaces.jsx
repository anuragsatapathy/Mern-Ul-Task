import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import RoleGuard from "../components/RoleGuard";
import ConfirmDialog from "../components/ConfirmDialog";
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Chip,
  MenuItem,
  Container,
  Paper,
  Avatar,
  AvatarGroup,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  GroupAdd as GroupIcon,
  ArrowForward,
  Workspaces as WorkspaceIcon,
} from "@mui/icons-material";
import { showSuccess, showError } from "../utils/toast";

const Workspaces = () => {
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Edit
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Delete
  const [deleteId, setDeleteId] = useState(null);

  // Members
  const [memberDialog, setMemberDialog] = useState(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/workspaces");
      setWorkspaces(res.data.data || []);
    } catch(error) {
      showError("Failed to load workspaces");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);
console.log(workspaces);
  const createWorkspace = async () => {
    if (!name.trim()) return showError("Workspace name is required");
    try {
      await axios.post("/workspaces", { name, description });
      showSuccess("Workspace created");
      setName("");
      setDescription("");
      fetchWorkspaces();
    } catch {
      showError("Failed to create workspace");
    }
  };

  const updateWorkspace = async () => {
    try {
      await axios.put(`/workspaces/${editId}`, {
        name: editName,
        description: editDescription,
      });
      showSuccess("Workspace updated");
      setEditId(null);
      fetchWorkspaces();
    } catch {
      showError("Failed to update workspace");
    }
  };

  const deleteWorkspace = async () => {
    try {
      await axios.delete(`/workspaces/${deleteId}`);
      showSuccess("Workspace deleted");
      setDeleteId(null);
      fetchWorkspaces();
    } catch {
      showError("Failed to delete workspace");
    }
  };

  const addMember = async () => {
    if (!email.trim()) return showError("Email is required");
    try {
      await axios.post(`/workspaces/${memberDialog.id}/invite`, {
        email,
        role,
      });
      showSuccess("Invitation sent successfully");
      setEmail("");
      setRole("MEMBER");
      setMemberDialog(null);
    } catch {
      showError("Failed to send invitation");
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ py: 8, px: { md: 10 } }}>
        {/* HEADER SECTION */}
        <Box sx={{ mb: 6 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
            <WorkspaceIcon sx={{ color: "#6366f1", fontSize: 32 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, color: "#0f172a", letterSpacing: '-0.03em' }}>
              Workspaces
            </Typography>
          </Stack>
          <Typography variant="body1" sx={{ color: "#64748b", fontSize: "1.1rem" }}>
            Create and manage collaborative environments for your team projects.
          </Typography>
        </Box>

        {/* CREATE WORKSPACE BAR */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 2.5, mb: 8, borderRadius: '24px', 
            border: "1px solid #e2e8f0", 
            bgcolor: "#ffffff",
            display: 'flex', gap: 2,
            alignItems: 'center',
            boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)'
          }}
        >
          <TextField
            fullWidth placeholder="Workspace Name (e.g. Marketing Team)" size="medium"
            value={name} onChange={(e) => setName(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: '16px', bgcolor: '#f8fafc' } }}
          />
          <TextField
            fullWidth placeholder="Short description..." size="medium"
            value={description} onChange={(e) => setDescription(e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: '16px', bgcolor: '#f8fafc' } }}
          />
          <Button 
            variant="contained" 
            onClick={createWorkspace}
            sx={{ 
              borderRadius: '16px', px: 5, py: 1.8, textTransform: "none", fontWeight: 700, 
              bgcolor: "#6366f1", fontSize: '1rem',
              "&:hover": { bgcolor: "#4f46e5", boxShadow: '0 8px 20px -4px rgba(99, 102, 241, 0.4)' }
            }}
          >
            Create
          </Button>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress thickness={5} sx={{ color: "#6366f1" }} />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {workspaces.map((w) => (
              <Grid item xs={12} sm={6} lg={4} key={w.id}>
                <Card 
                  elevation={0}
                  sx={{ 
                    position: "relative", borderRadius: '24px', border: '1px solid #e2e8f0',
                    bgcolor: '#fff',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    "&:hover": { 
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                      borderColor: '#6366f1' 
                    }
                  }}
                >
                  <CardContent sx={{ p: 4, flexGrow: 1 }}>
                    {editId === w.id ? (
                      /* EDITING UI */
                      <Stack spacing={2.5}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EditIcon sx={{ color: '#6366f1', fontSize: 18 }} />
                          <Typography variant="overline" sx={{ fontWeight: 900, color: '#6366f1', letterSpacing: 1.2 }}>
                            Edit Workspace
                          </Typography>
                        </Box>
                        <TextField
                          fullWidth label="Name"
                          value={editName} onChange={(e) => setEditName(e.target.value)}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: '12px' } }}
                        />
                        <TextField
                          fullWidth label="Description" multiline rows={2}
                          value={editDescription} onChange={(e) => setEditDescription(e.target.value)}
                          sx={{ "& .MuiOutlinedInput-root": { borderRadius: '12px' } }}
                        />
                        <Stack direction="row" spacing={1.5}>
                          <Button fullWidth variant="contained" onClick={updateWorkspace} sx={{ borderRadius: '12px', bgcolor: '#6366f1', textTransform: 'none', fontWeight: 700 }}>Save</Button>
                          <Button fullWidth variant="text" onClick={() => setEditId(null)} sx={{ borderRadius: '12px', color: '#64748b', textTransform: 'none' }}>Cancel</Button>
                        </Stack>
                      </Stack>
                    ) : (
                      /* VIEWING UI */
                      <>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                          <Chip 
                            label={w.myRole?.toLowerCase() || "member"}
                            size="small" 
                            sx={{ 
                              fontSize: '11px', fontWeight: 800, textTransform: 'uppercase',
                              bgcolor: w.myRole === 'OWNER' ? '#eef2ff' : '#f1f5f9', 
                              color: w.myRole === 'OWNER' ? '#6366f1' : '#64748b', 
                              borderRadius: '8px', px: 0.5
                            }} 
                          />
                          <RoleGuard allow={["owner", "admin"]} role={w.myRole}>
                            <Stack direction="row" spacing={0.5}>
                              <IconButton
                                size="small"
                                onClick={() => { setEditId(w.id); setEditName(w.name); setEditDescription(w.description || ""); }}
                                sx={{ color: '#94a3b8', "&:hover": { color: '#6366f1', bgcolor: '#f0f2ff' } }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => setDeleteId(w.id)}
                                sx={{ color: '#94a3b8', "&:hover": { color: '#ef4444', bgcolor: '#fef2f2' } }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </RoleGuard>
                        </Box>

                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', mb: 1.5, lineHeight: 1.3 }}>
                          {w.name}
                        </Typography>
                        
                        <Typography variant="body2" sx={{ color: "#64748b", mb: 4, lineHeight: 1.7, fontSize: '0.95rem' }}>
                          {w.description || "No description provided for this workspace."}
                        </Typography>

                        <Divider sx={{ my: 3, opacity: 0.6 }} />

                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <AvatarGroup max={3} sx={{ "& .MuiAvatar-root": { width: 34, height: 34, fontSize: '14px', border: '2px solid #fff' } }}>
                              {w.members?.map((m) => (
                                <Tooltip key={m.id} title={`${m.user.name} (${m.role})`}>
                                  <Avatar sx={{ bgcolor: '#818cf8', fontWeight: 600 }}>{m.user.name.charAt(0)}</Avatar>
                                </Tooltip>
                              ))}
                            </AvatarGroup>
                            <RoleGuard allow={["owner", "admin"]} role={w.myRole}>
                              <Tooltip title="Add Members">
                                <IconButton 
                                  size="small" 
                                  onClick={() => setMemberDialog(w)} 
                                  sx={{ bgcolor: '#f1f5f9', color: '#64748b', "&:hover": { bgcolor: '#eef2ff', color: '#6366f1' } }}
                                >
                                  <GroupIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </RoleGuard>
                          </Stack>

                          <Button
                            variant="text"
                            onClick={() => {
                              localStorage.setItem("activeWorkspace", w.id);
                              localStorage.removeItem("activeProject");
                              localStorage.setItem("workspaceRole", w.myRole.toLowerCase());

                              navigate(`/projects/${w.id}`);
                            }}
                            endIcon={<ArrowForward sx={{ transition: '0.2s', transform: 'translateX(0px)' }} />}
                            sx={{ 
                              fontWeight: 800, color: '#6366f1', textTransform: 'none', fontSize: '0.95rem',
                              "&:hover": { bgcolor: 'transparent', "& .MuiButton-endIcon": { transform: 'translateX(4px)' } } 
                            }}
                          >
                            Enter
                          </Button>
                        </Box>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* INVITE MEMBER DIALOG */}
      <Dialog 
        open={!!memberDialog} 
        onClose={() => setMemberDialog(null)}
        PaperProps={{ sx: { borderRadius: '28px', p: 2, width: '100%', maxWidth: '440px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#1e293b', fontSize: '1.5rem', pb: 1 }}>Invite Team Member</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
            Send an invitation to join <Typography component="span" sx={{ fontWeight: 700, color: '#475569' }}>{memberDialog?.name}</Typography>.
          </Typography>
          <Stack spacing={2.5}>
            <TextField
              fullWidth label="User Email" placeholder="abc@gmail.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: '14px' } }}
            />
            <TextField
              fullWidth select label="Role" value={role}
              onChange={(e) => setRole(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: '14px' } }}
            >
              <MenuItem value="MEMBER">Member</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setMemberDialog(null)} sx={{ color: '#64748b', fontWeight: 700, textTransform: 'none', px: 3 }}>Cancel</Button>
          <Button variant="contained" onClick={addMember} sx={{ borderRadius: '12px', px: 4, py: 1.2, bgcolor: '#6366f1', textTransform: 'none', fontWeight: 700, boxShadow: 'none' }}>
            Send Invitation
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Workspace?"
        message="All projects, tasks, and data within this workspace will be permanently erased."
        confirmText="Delete Workspace"
        onConfirm={deleteWorkspace}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  );
};

export default Workspaces;