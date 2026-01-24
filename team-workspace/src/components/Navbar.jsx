import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  DashboardCustomize, 
  FolderCopy, 
  Logout, 
  CorporateFare, 
  AssignmentTurnedIn 
} from "@mui/icons-material";
import { showError } from "../utils/toast";

const drawerWidth = 260;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("activeWorkspace");
    navigate("/login");
  };

  const getActiveWorkspace = () => localStorage.getItem("activeWorkspace");

  const goToProjects = () => {
    const workspaceId = getActiveWorkspace();
    if (!workspaceId) {
      showError("Please select a workspace first");
      navigate("/workspaces");
      return;
    }
    navigate(`/projects/${workspaceId}`);
  };

  const goToTasks = () => {
    const workspaceId = getActiveWorkspace();
    // Logic check: Tasks usually belong to a project, 
    // but here we redirect based on workspace context
    if (!workspaceId) {
      showError("Please select a workspace first");
      navigate("/workspaces");
      return;
    }
    // Note: If your routing requires a projectId for tasks, 
    // you might need to handle that logic here.
    navigate(`/tasks/${workspaceId}`); 
  };

  const menuItems = [
    { 
      text: "Workspaces", 
      icon: <CorporateFare />, 
      path: "/workspaces", 
      action: () => navigate("/workspaces") 
    },
    { 
      text: "Projects", 
      icon: <FolderCopy />, 
      path: "/projects", 
      action: goToProjects 
    },
    { 
      text: "Tasks", 
      icon: <AssignmentTurnedIn />, 
      path: "/tasks", 
      action: goToTasks 
    },
  ];

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
      <Box sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ 
          width: 32, 
          height: 32, 
          bgcolor: '#6366f1', 
          borderRadius: 1.5, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <DashboardCustomize sx={{ fontSize: 20 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 0.5 }}>
          Workspace
        </Typography>
      </Box>

      <Divider sx={{ bgcolor: "rgba(255,255,255,0.06)", mx: 2, mb: 2 }} />
      
      <List sx={{ px: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={item.action}
                sx={{
                  borderRadius: "10px",
                  bgcolor: isActive ? "rgba(99, 102, 241, 0.15)" : "transparent",
                  color: isActive ? "#818cf8" : "#94a3b8",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.04)", color: "#fff" },
                }}
              >
                <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: isActive ? 600 : 500 }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 2, pb: 4 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{ 
            borderRadius: "10px", 
            color: "#f87171", 
            "&:hover": { bgcolor: "rgba(248,113,113,0.08)" } 
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}><Logout /></ListItemIcon>
          <ListItemText 
            primary="Logout" 
            primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: 500 }} 
          />
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default Navbar;