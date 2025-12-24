import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Box,
  Divider,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/MainLayout";

export default function AddExpense() {
  const [form, setForm] = useState({
    amount: "",
    category: "",
    paymentType: "",
    date: "",
    bill: null,
  });

  const [errors, setErrors] = useState({});
  const [toastOpen, setToastOpen] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const err = {};
    if (!form.amount) err.amount = "Amount is required";
    if (!form.category) err.category = "Category is required";
    if (!form.paymentType) err.paymentType = "Payment type is required";
    if (!form.date) err.date = "Date is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;

    const data = new FormData();
    Object.keys(form).forEach((k) => {
      if (form[k]) data.append(k, form[k]);
    });

    await api.post("/expenses", data);
    setToastOpen(true);
    setTimeout(() => navigate("/expenses"), 1200);
  };

  return (
    <MainLayout>
      <Paper
        sx={{
          maxWidth: 520,
          mx: "auto",
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" fontWeight={600} mb={1}>
          Add Expense
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Enter expense details and upload bill if available
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <TextField
          fullWidth
          label="Amount"
          type="number"
          margin="normal"
          error={!!errors.amount}
          helperText={errors.amount}
          onChange={(e) =>
            setForm({ ...form, amount: e.target.value })
          }
        />

        <TextField
          fullWidth
          label="Category (e.g. Food, Travel)"
          margin="normal"
          error={!!errors.category}
          helperText={errors.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />

        <TextField
          fullWidth
          label="Payment Type (Cash / Card / UPI)"
          margin="normal"
          error={!!errors.paymentType}
          helperText={errors.paymentType}
          onChange={(e) =>
            setForm({ ...form, paymentType: e.target.value })
          }
        />

        <TextField
          fullWidth
          type="date"
          label="Expense Date"
          margin="normal"
          InputLabelProps={{ shrink: true }}
          error={!!errors.date}
          helperText={errors.date}
          onChange={(e) =>
            setForm({ ...form, date: e.target.value })
          }
        />

        {/* File Upload */}
        <Box mt={3}>
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
            sx={{ borderStyle: "dashed" }}
            fullWidth
          >
            {form.bill ? "Change Bill" : "Upload Bill (optional)"}
            <input
              hidden
              type="file"
              onChange={(e) =>
                setForm({ ...form, bill: e.target.files[0] })
              }
            />
          </Button>

          {form.bill && (
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              mt={1}
              textAlign="center"
            >
              Selected file: {form.bill.name}
            </Typography>
          )}
        </Box>

        <Button
          fullWidth
          size="large"
          variant="contained"
          sx={{ mt: 4 }}
          onClick={submit}
        >
          Save Expense
        </Button>
      </Paper>

      <Snackbar open={toastOpen} autoHideDuration={2000}>
        <Alert severity="success" variant="filled">
          Expense added successfully
        </Alert>
      </Snackbar>
    </MainLayout>
  );
}
