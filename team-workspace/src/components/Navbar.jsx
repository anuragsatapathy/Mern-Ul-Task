import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import {
  DashboardCustomize,
  CorporateFare,
  FolderCopy,
  AssignmentTurnedIn,
  Timeline,
  Logout,
  FolderOpen,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../auth/useAuth";
import RoleGuard from "./RoleGuard";

const drawerWidth = 260;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const activeWorkspace = localStorage.getItem("activeWorkspace");
  const activeProject = localStorage.getItem("activeProject");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItem = (label, icon, path, onClick) => {
    const active = location.pathname.startsWith(path);

    return (
      <ListItem disablePadding sx={{ mb: 1 }}>
        <ListItemButton
          onClick={onClick}
          sx={{
            borderRadius: 2,
            bgcolor: active ? "rgba(99,102,241,0.15)" : "transparent",
            color: active ? "#818cf8" : "#94a3b8",
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.05)",
              color: "#fff",
            },
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
            {icon}
          </ListItemIcon>
          <ListItemText
            primary={label}
            primaryTypographyProps={{
              fontSize: "0.95rem",
              fontWeight: active ? 600 : 500,
            }}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          bgcolor: "#0f172a",
          color: "white",
          borderRight: "none",
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={800}>
          Team Workspace
        </Typography>
        <Typography variant="caption" sx={{ color: "#94a3b8" }}>
          {user?.name} • {user?.role}
        </Typography>
      </Box>

      <Divider sx={{ bgcolor: "rgba(255,255,255,0.06)", mx: 2, mb: 2 }} />

      {/* Navigation */}
      <List sx={{ px: 2, flexGrow: 1 }}>
        {menuItem(
          "Dashboard",
          <DashboardCustomize />,
          "/dashboard",
          () => navigate("/dashboard")
        )}

        {menuItem(
          "Workspaces",
          <CorporateFare />,
          "/workspaces",
          () => navigate("/workspaces")
        )}

           {menuItem(
          "Projects",
          <FolderCopy />,
          "/projects",
          () => {
            if (activeWorkspace) {
              navigate(`/projects/${activeWorkspace}`);
            } else {
              navigate("/workspaces"); // force user to pick workspace
            }
          }
        )}

          
        {/* {activeProject &&
          menuItem(
            "Project Preview",
            <FolderOpen />,
            "/project-preview",
            () => navigate(`/project-preview/${activeProject}`)
          )} */}

        {activeProject &&
          menuItem(
            "Tasks",
            <AssignmentTurnedIn />,
            "/tasks",
            () => navigate(`/tasks/${activeProject}`)
          )}

        {menuItem(
          "Activity",
          <Timeline />,
          "/activity",
          () => navigate("/activity")
        )}
      </List>

      {/* Footer */}
      <Box sx={{ p: 2, pb: 3 }}>
        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: 2,
            color: "#f87171",
            "&:hover": { bgcolor: "rgba(248,113,113,0.1)" },
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default Navbar;
