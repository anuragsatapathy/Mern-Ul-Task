import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import Navbar, { SIDEBAR_WIDTH } from "../components/Navbar";
import api from "../api/api";

export default function Budget() {
  const [month, setMonth] = useState("");
  const [limit, setLimit] = useState("");
  const [spent, setSpent] = useState(0);

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("budget"));
    if (saved) {
      setMonth(saved.month);
      setLimit(saved.limit);
    }

    api.get("/expenses").then((res) => {
      const total = res.data.data.items.reduce(
        (sum, e) => sum + Number(e.amount),
        0
      );
      setSpent(total);
    });
  }, []);

  const saveBudget = () => {
    localStorage.setItem(
      "budget",
      JSON.stringify({ month, limit })
    );
  };

  const percent = limit ? (spent / limit) * 100 : 0;

  useEffect(() => {
    let count = 0;

    if (month === currentMonth) {
      if (percent >= 80) count++;
      if (percent >= 100) count++;
    }

    localStorage.setItem("notificationCount", String(count));
    window.dispatchEvent(new Event("storage"));
  }, [percent, month]);

  return (
    <>
      <Navbar />

      <Box sx={{ ml: `${SIDEBAR_WIDTH}px`, p: 4 }}>
        <Button onClick={() => window.history.back()}>
          Back
        </Button>

        <Typography variant="h5" mb={3}>
          Monthly Budget
        </Typography>

        {/* INPUT ROW */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 3,
            maxWidth: 520,
          }}
        >
          <TextField
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            size="small"
          />

          <TextField
            label="Limit"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            size="small"
          />

          <Button
            variant="contained"
            onClick={saveBudget}
            sx={{ height: 40 }}
          >
            Save
          </Button>
        </Box>

        {/* SUMMARY */}
        <Box mb={2}>
          <Typography>
            Month: {month}
          </Typography>
          <Typography>
            Limit: ₹ {limit}
          </Typography>
          <Typography>
            Spent: ₹ {spent}
          </Typography>
        </Box>

        {/* WARNING */}
        {month === currentMonth && percent >= 80 && (
          <Typography
            color={percent >= 100 ? "error" : "warning.main"}
          >
            {percent >= 100
              ? "Budget exceeded!"
              : "Warning: 80% of budget used"}
          </Typography>
        )}
      </Box>
    </>
  );
}
