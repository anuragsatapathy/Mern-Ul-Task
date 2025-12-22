import { Box, Typography } from "@mui/material";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <Box sx={{ ml: 28, mt: 4 }}>
        <Typography variant="h4">
          Welcome to Expense Management
        </Typography>
        <Typography mt={1}>
          Use the menu to navigate through the app.
        </Typography>
      </Box>
    </>
  );
}
