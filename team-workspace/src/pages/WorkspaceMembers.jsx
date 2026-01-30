import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import Navbar from "../components/Navbar";
import RoleGuard from "../components/RoleGuard";
import ConfirmDialog from "../components/ConfirmDialog";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { showSuccess, showError } from "../utils/toast";


const WorkspaceMembers = () => {
  const { workspaceId } = useParams();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [emailError, setEmailError] = useState("");

  const [removeId, setRemoveId] = useState(null);

 
  const loadMembers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/workspaces/${workspaceId}/members`
      );
      setMembers(res.data.data || []);
    } catch {
      showError("Failed to load workspace members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [workspaceId]);

  
  const addMember = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setEmailError("Email is required");
      return;
    }

    if (!emailRegex.test(email)) {
      setEmailError("Enter a valid email address");
      return;
    }

    try {
      await axios.post(
        `/workspaces/${workspaceId}/members`,
        { email, role }
      );
      showSuccess("Member added to workspace");
      setEmail("");
      setRole("member");
      setEmailError("");
      loadMembers();
    } catch (err) {
      showError(
        err.response?.data?.message ||
          "Failed to add member"
      );
    }
  };

  
  const updateRole = async (userId, newRole) => {
    try {
      await axios.put(
        `/workspaces/${workspaceId}/members/${userId}`,
        { role: newRole }
      );
      showSuccess("Member role updated");
      loadMembers();
    } catch {
      showError("Failed to update role");
    }
  };

 
  const removeMember = async () => {
    try {
      await axios.delete(
        `/workspaces/${workspaceId}/members/${removeId}`
      );
      showSuccess("Member removed from workspace");
      setRemoveId(null);
      loadMembers();
    } catch {
      showError("Failed to remove member");
    }
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <Navbar />

      <Box sx={{ flexGrow: 1, p: 4 }}>
        <Typography variant="h4" fontWeight={800} mb={3}>
          Workspace Members
        </Typography>

        {/* Add Member (Owner/Admin only) */}
        <RoleGuard allow={["owner", "admin"]}>
          <Paper
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 3,
              border: "1px solid #e2e8f0",
            }}
          >
            <Typography fontWeight={600} mb={2}>
              Add Member
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                placeholder="User email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError("");
                }}
                error={!!emailError}
                helperText={emailError}
                size="small"
                sx={{ width: 300 }}
              />

              <Select
                size="small"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="member">Member</MenuItem>
              </Select>

              <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={addMember}
              >
                Add
              </Button>
            </Box>
          </Paper>
        </RoleGuard>

        {/* Members List */}
        {loading ? (
          <Box sx={{ mt: 8, textAlign: "center" }}>
            <CircularProgress />
          </Box>
        ) : members.length === 0 ? (
          <Typography color="text.secondary">
            No members found.
          </Typography>
        ) : (
          <Paper
            sx={{
              borderRadius: 3,
              border: "1px solid #e2e8f0",
            }}
          >
            <List>
              {members.map((m) => (
                <ListItem
                  key={m.user.id}
                  secondaryAction={
                    <RoleGuard allow={["owner", "admin"]}>
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() => setRemoveId(m.user.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </RoleGuard>
                  }
                >
                  <ListItemText
                    primary={`${m.user.name} (${m.user.email})`}
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <RoleGuard allow={["owner", "admin"]}>
                          <Select
                            size="small"
                            value={m.role}
                            onChange={(e) =>
                              updateRole(
                                m.user.id,
                                e.target.value
                              )
                            }
                          >
                            <MenuItem value="owner">Owner</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                            <MenuItem value="member">Member</MenuItem>
                          </Select>
                        </RoleGuard>

                        {!["owner", "admin"].includes(m.role) && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Role: {m.role}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Box>

      <ConfirmDialog
        open={!!removeId}
        title="Remove Member?"
        message="This user will lose access to the workspace."
        confirmText="Remove"
        onConfirm={removeMember}
        onCancel={() => setRemoveId(null)}
      />
    </Box>
  );
};

export default WorkspaceMembers;
