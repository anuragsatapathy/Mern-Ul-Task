import { Box } from "@mui/material";
import Navbar, { SIDEBAR_WIDTH } from "./Navbar";
import Topbar from "./Topbar";

export default function MainLayout({ children }) {
  return (
    <>
      <Topbar />
      <Navbar />

      <Box
        sx={{
          ml: `${SIDEBAR_WIDTH}px`,
          mt: "64px",
          px: 6,      
          py: 4,
          minHeight: "100vh",
          bgcolor: "#f3f4f6",
        }}
      >
        {children}
      </Box>
    </>
  );
}
