import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h4" mb={3}>
          Welcome to Expense Dashboard
        </Typography>

        <Button sx={{ m: 1 }} variant="contained" onClick={() => navigate("/dashboard")}>
          Dashboard
        </Button>
        <Button sx={{ m: 1 }} variant="outlined" onClick={() => navigate("/add-expense")}>
          Add Expense
        </Button>
        <Button sx={{ m: 1 }} variant="outlined" onClick={() => navigate("/expenses")}>
          Expenses
        </Button>
        <Button sx={{ m: 1 }} variant="outlined" onClick={() => navigate("/budget")}>
          Budget
        </Button>
      </Box>
    </>
  );
}
