import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function Budget() {
  const [month, setMonth] = useState("");
  const [limit, setLimit] = useState(0);
  const [spent, setSpent] = useState(0);
  const [open, setOpen] = useState(false);


  useEffect(() => {
    api.get("/budget").then((res) => {
      if (res.data.data) {
        setMonth(res.data.data.month);
        setLimit(res.data.data.limit);
      }
    });

    api.get("/expenses").then((res) => {
      const total = res.data.data.items.reduce(
        (sum, e) => sum + Number(e.amount),
        0
      );
      setSpent(total);
    });
  }, []);

  const save = async () => {
    await api.post("/budget", { month, limit });
    setOpen(true); 
  };

  const percent = limit ? (spent / limit) * 100 : 0;

  return (
    <>
      <Navbar />

      <Box sx={{ width: 420, mx: "auto", mt: 4 }}>
        <Typography variant="h5" mb={3} textAlign="center">
          Monthly Budget
        </Typography>

        <TextField
          fullWidth
          label="Month (e.g. Dec 2025)"
          margin="normal"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />

        <TextField
          fullWidth
          label="Limit"
          margin="normal"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={save}
        >
          Save
        </Button>

        <Box mt={3}>
          <Typography>Total Spent: ₹ {spent}</Typography>
          <Typography>Extra Spent: ₹ {limit - spent}</Typography>

          {percent >= 80 && percent < 100 && (
            <Typography color="warning.main">
              Warning: 80% of budget used
            </Typography>
          )}

          {percent >= 100 && (
            <Typography color="error">
              Budget exceeded!
            </Typography>
          )}
        </Box>
      </Box>

    
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Budget saved successfully</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpen(false)} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
