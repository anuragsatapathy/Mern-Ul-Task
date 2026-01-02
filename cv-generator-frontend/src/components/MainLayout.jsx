import { Box, Button, Typography, Stack, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Topbar from "./Topbar";

const MainLayout = ({ children }) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* TOP BAR */}
      <Topbar />

      <Box sx={{ display: "flex", pt: "64px" }}>
        {/* VERTICAL NAVBAR */}
        <Box
          sx={{
            width: 240,
            backgroundColor: "#1e293b",
            color: "#fff",
            p: 3,
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Menu
          </Typography>

          <Stack spacing={2}>
            {/* PROFILE */}
            <Button
              fullWidth
              sx={{
                backgroundColor: "#ffb74d",
                color: "#000",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#ffa726" },
              }}
              onClick={() => navigate("/profile")}
            >
              Profile
            </Button>

            {/* EDUCATION */}
            <Button
              fullWidth
              sx={{
                backgroundColor: "#81d4fa",
                color: "#000",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#4fc3f7" },
              }}
              onClick={() => navigate("/education")}
            >
              Education
            </Button>

            {/* EXPERIENCE */}
            <Button
              fullWidth
              sx={{
                backgroundColor: "#a5d6a7",
                color: "#000",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#81c784" },
              }}
              onClick={() => navigate("/experience")}
            >
              Experience
            </Button>

            {/* SKILLS */}
            <Button
              fullWidth
              sx={{
                backgroundColor: "#ce93d8",
                color: "#000",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#ba68c8" },
              }}
              onClick={() => navigate("/skills")}
            >
              Skills
            </Button>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

            {/* CV PREVIEW */}
            <Button
              fullWidth
              sx={{
                backgroundColor: "#4db6ac",
                color: "#000",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#26a69a" },
              }}
              onClick={() => navigate("/cv")}
            >
              Preview CV
            </Button>
          </Stack>
        </Box>

        {/* PAGE CONTENT */}
        <Box sx={{ flex: 1, p: 4 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
