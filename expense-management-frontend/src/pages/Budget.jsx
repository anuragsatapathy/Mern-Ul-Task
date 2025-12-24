import { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Divider,
  Box,
} from "@mui/material";
import api from "../api/api";
import MainLayout from "../components/MainLayout";

const getCurrentMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export default function Budget() {
  const currentMonth = getCurrentMonth();

  const [month, setMonth] = useState(currentMonth);
  const [limit, setLimit] = useState("");
  const [spent, setSpent] = useState(0);
  const [savedBudget, setSavedBudget] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("budget"));
    if (saved) {
      setSavedBudget(saved);
      setMonth(saved.month);
      setLimit(saved.limit);
    }

    api.get("/expenses").then((res) => {
      const total = res.data.data.items.reduce(
        (s, e) => s + Number(e.amount),
        0
      );
      setSpent(total);
    });
  }, []);

  const saveBudget = async () => {
    if (!limit || Number(limit) <= 0) {
      setError("Limit must be greater than 0");
      return;
    }

    setError("");

    // browser permission 
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }

    const data = { month, limit };
    localStorage.setItem("budget", JSON.stringify(data));
    setSavedBudget(data);
  };

  const percent = limit ? (spent / limit) * 100 : 0;

  useEffect(() => {
    // NOT current month → clear notification
    if (month !== currentMonth) {
      localStorage.setItem("notificationCount", "0");
      localStorage.removeItem("notification");
      localStorage.removeItem("notificationMonth");
      window.dispatchEvent(new Event("storage"));
      return;
    }

    let message = "";
    let count = 0;

    if (percent >= 100) {
      message = "Budget exceeded!";
      count = 1;
    } else if (percent >= 80) {
      message = "Warning: 80% of budget used";
      count = 1;
    }

    localStorage.setItem("notificationCount", count.toString());
    localStorage.setItem("notification", message);
    localStorage.setItem("notificationMonth", currentMonth);
    window.dispatchEvent(new Event("storage"));

    //  browser notification
    if (
      message &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification("Expense Management", {
        body: message,
        icon: "/favicon.ico",
      });
    }
  }, [percent, month, limit, currentMonth]);

  return (
    <MainLayout>
      <Paper sx={{ maxWidth: 560, mx: "auto", p: 4, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight={600} mb={3}>
          Monthly Budget
        </Typography>

        <TextField
          type="month"
          fullWidth
          margin="normal"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />

        <TextField
          label="Budget Limit"
          fullWidth
          margin="normal"
          value={limit}
          error={!!error}
          helperText={error}
          onChange={(e) => setLimit(e.target.value)}
        />

        <Button
          fullWidth
          size="large"
          variant="contained"
          sx={{ mt: 3 }}
          onClick={saveBudget}
        >
          Save Budget
        </Button>

        {savedBudget && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box>
              <Typography><b>Month:</b> {savedBudget.month}</Typography>
              <Typography><b>Limit:</b> ₹ {savedBudget.limit}</Typography>
              <Typography mt={1}><b>Total Spent:</b> ₹ {spent}</Typography>
            </Box>
          </>
        )}

        {month === currentMonth && percent >= 80 && (
          <Alert severity={percent >= 100 ? "error" : "warning"} sx={{ mt: 3 }}>
            {percent >= 100
              ? "Budget exceeded!"
              : "80% of budget used"}
          </Alert>
        )}
      </Paper>
    </MainLayout>
  );
}
