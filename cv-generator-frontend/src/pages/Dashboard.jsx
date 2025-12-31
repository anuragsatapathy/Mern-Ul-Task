import { Box, Button, Typography, Stack, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
     
      <Box
        sx={{
          width: 240,
          backgroundColor: "#1e293b", 
          color: "#fff",
          p: 3,
        }}
      >
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          CV Generator
        </Typography>

        <Stack spacing={2}>
          <Button
            fullWidth
            variant="contained"
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

          <Button
            fullWidth
            variant="contained"
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

          <Button
            fullWidth
            variant="contained"
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

          <Button
            fullWidth
            variant="contained"
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

          <Button
            fullWidth
            variant="contained"
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

    
      <Box sx={{ flex: 1, p: 4, backgroundColor: "#f8fafc" }}>
        <Typography variant="h4" gutterBottom>
          Welcome 
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Use the menu on the left to manage your profile details and generate
          your professional CV.
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
