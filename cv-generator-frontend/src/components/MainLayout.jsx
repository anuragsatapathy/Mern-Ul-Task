import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import Topbar from "./Topbar";

const menu = [
  { label: "PROFILE", path: "/profile" },
  { label: "EDUCATION", path: "/education" },
  { label: "EXPERIENCE", path: "/experience" },
  { label: "SKILLS", path: "/skills" },
  { label: "HOBBIES", path: "/hobbies" },
  { label: "REFERENCES", path: "/references" },
  { label: "CONFERENCES & COURSES", path: "/conference-and-courses" },
  { label: "CERTIFICATES", path: "/certificates" },
  { label: "PREVIEW CV", path: "/cv" },
];

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <Topbar />

      <Box sx={{ display: "flex", pt: "64px" }}>
        <Box
          sx={{
            width: '270px!important',
            bgcolor: "#1e293b",
            minHeight: "calc(100vh - 64px)",
            p: 3,
          }}
        >
          <Typography color="#fff" fontWeight={600} mb={3}>
            Menu
          </Typography>

          <Stack spacing={1}>
            {menu.map((m) => (
              <Button
                key={m.path}
                fullWidth
                onClick={() => navigate(m.path)}
                sx={{
                  justifyContent: "flex-start",
                  bgcolor: pathname === m.path ? "#ffb74d" : "transparent",
                  color: pathname === m.path ? "#000" : "#fff",
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#ffb74d", color: "#000" },
                }}
              >
                {m.label}
              </Button>
            ))}
          </Stack>
        </Box>

        <Box sx={{ flex: 1, p: 4 }}>{children}</Box>
      </Box>
    </Box>
  );
}
