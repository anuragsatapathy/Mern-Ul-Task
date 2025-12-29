import { useEffect, useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Divider,
  Box,
  Snackbar,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import api from "../api/api";
import MainLayout from "../components/MainLayout";

const getCurrentMonth = () => dayjs().format("YYYY-MM");

export default function Budget() {
  
  const [month, setMonth] = useState(null);

  const [limit, setLimit] = useState("");
  const [spent, setSpent] = useState(0);
  const [savedBudget, setSavedBudget] = useState(null);
  const [toast, setToast] = useState(false);

  const currentMonth = getCurrentMonth();

  /* LOAD BUDGET + EXPENSES */
  useEffect(() => {
    api.get("/budget").then((res) => {
      if (res.data.data) {
        setSavedBudget(res.data.data);
        setLimit(res.data.data.limit);

       
        setMonth(dayjs(res.data.data.month));
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

  /* SAVE BUDGET */
  const saveBudget = async () => {
    const payload = {
      month: month.format("YYYY-MM"),
      limit: Number(limit),
    };

    const res = await api.post("/budget", payload);

    setSavedBudget(res.data.data);
    setToast(true);

    
    window.dispatchEvent(new Event("refresh-notifications"));
  };

  const percent = limit ? (spent / limit) * 100 : 0;

  return (
    <MainLayout>
      <Paper
        sx={{
          maxWidth: 560,
          mx: "auto",
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" fontWeight={600} mb={3}>
          Monthly Budget
        </Typography>

       
        {month && (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={["month"]}
              value={month}
              onChange={setMonth}
              minDate={dayjs().startOf("year")}
              maxDate={dayjs().endOf("year")}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                },
              }}
            />
          </LocalizationProvider>
        )}

        <TextField
          label="Budget Limit"
          fullWidth
          margin="normal"
          type="number"
          value={limit}
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

        {/* SAVED DETAILS */}
        {savedBudget && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box>
              <Typography>
                <b>Month:</b> {savedBudget.month}
              </Typography>
              <Typography>
                <b>Limit:</b> ₹{savedBudget.limit}
              </Typography>
              <Typography>
                <b>Total Spent:</b> ₹{spent}
              </Typography>
            </Box>
          </>
        )}

       
        {savedBudget?.month === currentMonth && percent >= 80 && (
          <Alert
            severity={percent >= 100 ? "error" : "warning"}
            sx={{ mt: 3 }}
          >
            {percent >= 100
              ? "Budget exceeded!"
              : "You have used more than 80% of your budget"}
          </Alert>
        )}
      </Paper>

      {/* TOAST */}
      <Snackbar
        open={toast}
        autoHideDuration={2000}
        onClose={() => setToast(false)}
      >
        <Alert severity="success" variant="filled">
          Budget saved successfully
        </Alert>
      </Snackbar>
    </MainLayout>
  );
}
