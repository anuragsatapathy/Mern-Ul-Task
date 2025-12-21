import { useState } from "react";
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
import { useNavigate } from "react-router-dom";

export default function AddExpense() {
  const [form, setForm] = useState({
    amount: "",
    category: "",
    paymentType: "",
    date: "",
    bill: null,
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const validate = (data = form) => {
    const newErrors = {};

    if (!data.amount) newErrors.amount = "Amount is required";
    else if (Number(data.amount) <= 0)
      newErrors.amount = "Amount must be greater than 0";

    if (!data.category) newErrors.category = "Category is required";
    if (!data.paymentType)
      newErrors.paymentType = "Payment type is required";
    if (!data.date) newErrors.date = "Date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    if (submitted) {
      validate(updatedForm);
    }
  };

  const submit = async () => {
    setSubmitted(true);

    if (!validate()) return;

    const data = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) data.append(key, form[key]);
    });

    await api.post("/expenses", data);
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    navigate("/expenses");
  };

  return (
    <>
      <Navbar />

      <Box sx={{ width: 420, mx: "auto", mt: 4 }}>
        <Typography variant="h5" mb={3} textAlign="center">
          Add Expense
        </Typography>

        <TextField
          fullWidth
          name="amount"
          label="Amount"
          type="number"
          margin="normal"
          value={form.amount}
          onChange={handleChange}
          error={!!errors.amount}
          helperText={errors.amount}
        />

        <TextField
          fullWidth
          name="category"
          label="Category"
          margin="normal"
          value={form.category}
          onChange={handleChange}
          error={!!errors.category}
          helperText={errors.category}
        />

        <TextField
          fullWidth
          name="paymentType"
          label="Payment Type"
          margin="normal"
          value={form.paymentType}
          onChange={handleChange}
          error={!!errors.paymentType}
          helperText={errors.paymentType}
        />

        <TextField
          fullWidth
          name="date"
          type="date"
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={form.date}
          onChange={handleChange}
          error={!!errors.date}
          helperText={errors.date}
        />

        <Box mt={2}>
          <input
            type="file"
            onChange={(e) =>
              setForm({ ...form, bill: e.target.files[0] })
            }
          />
        </Box>

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          onClick={submit}
        >
          Save
        </Button>
      </Box>

    
      <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>Expense added successfully</DialogTitle>
        <DialogActions>
          <Button onClick={closeDialog} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
