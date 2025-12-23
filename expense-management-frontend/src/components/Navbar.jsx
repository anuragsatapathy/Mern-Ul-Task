import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

export const SIDEBAR_WIDTH = 200;
const TOPBAR_HEIGHT = 64;

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Add Expense", path: "/add-expense" },
    { label: "Expenses", path: "/expenses" },
    { label: "Budget", path: "/budget" },
  ];

  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        height: `calc(100vh - ${TOPBAR_HEIGHT}px)`,
        position: "fixed",
        top: `${TOPBAR_HEIGHT}px`,   
        left: 0,
        bgcolor: "#ffffff",
        borderRight: "1px solid #e5e7eb",

        px: 2.5,
        pt: 4,   
        pb: 4,
      }}
    >
     { /*<Typography
        variant="subtitle1"
        fontWeight={700}
        mb={4}
        sx={{ color: "#2563eb" }}
      >
        Expense Manager
      </Typography>*/}

      <List disablePadding>
        {menu.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              borderRadius: 1.5,
              mb: 1,
              py: 1.2,
              "&.Mui-selected": {
                bgcolor: "#e3f2fd",
                color: "#2563eb",
                fontWeight: 600,
              },
              "&:hover": {
                bgcolor: "#f1f5f9",
              },
            }}
          >
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontSize: 14 }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
