import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReceiptIcon from "@mui/icons-material/Receipt";
import UploadFileIcon from "@mui/icons-material/UploadFile";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import api from "../api/api";
import MainLayout from "../components/MainLayout";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [open, setOpen] = useState(false);

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [deleteId, setDeleteId] = useState(null);

  const [form, setForm] = useState({
    amount: "",
    category: "",
    paymentType: "",
    date: null,
    bill: null,
  });

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadExpenses = async () => {
    const res = await api.get("/expenses");
    setExpenses(res.data.data.items);
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const submit = async () => {
    const err = {};
    if (!form.amount) err.amount = "Required";
    if (!form.category) err.category = "Required";
    if (!form.paymentType) err.paymentType = "Required";
    if (!form.date) err.date = "Required";

    setErrors(err);
    if (Object.keys(err).length) return;

    try {
      const data = new FormData();
      data.append("amount", form.amount);
      data.append("category", form.category);
      data.append("paymentType", form.paymentType);
      data.append("date", form.date.format("YYYY-MM-DD"));
      if (form.bill) data.append("bill", form.bill);

      await api.post("/expenses", data);

    
      window.dispatchEvent(new Event("refresh-notifications"));

      setToast({
        open: true,
        message: "Expense added successfully",
        severity: "success",
      });

      setOpen(false);
      setForm({
        amount: "",
        category: "",
        paymentType: "",
        date: null,
        bill: null,
      });

      loadExpenses();
    } catch {
      setToast({
        open: true,
        message: "Failed to add expense",
        severity: "error",
      });
    }
  };

  const updateExpense = async () => {
    await api.put(`/expenses/${editId}`, editData);

  
    window.dispatchEvent(new Event("refresh-notifications"));

    setEditId(null);
    loadExpenses();

    setToast({
      open: true,
      message: "Expense updated",
      severity: "success",
    });
  };

  const deleteExpense = async () => {
    await api.delete(`/expenses/${deleteId}`);

    
    window.dispatchEvent(new Event("refresh-notifications"));

    setDeleteId(null);
    loadExpenses();

    setToast({
      open: true,
      message: "Expense deleted",
      severity: "success",
    });
  };

  return (
    <MainLayout>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Typography variant="h5" fontWeight={600}>
          My Expenses
        </Typography>

        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Expense
        </Button>
      </Box>

      {expenses.map((e) => (
        <Paper key={e._id} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Box display="flex" justifyContent="space-between">
            <Box>
              {editId === e._id ? (
                <>
                  <TextField
                    size="small"
                    type="number"
                    sx={{ mr: 1 }}
                    value={editData.amount}
                    onChange={(ev) =>
                      setEditData({ ...editData, amount: ev.target.value })
                    }
                  />
                  <TextField
                    size="small"
                    value={editData.category}
                    onChange={(ev) =>
                      setEditData({ ...editData, category: ev.target.value })
                    }
                  />
                </>
              ) : (
                <>
                  <Typography fontWeight={600}>₹ {e.amount}</Typography>
                  <Typography color="text.secondary">{e.category}</Typography>

                  {e.bill && (
                    <Button
                      size="small"
                      startIcon={<ReceiptIcon />}
                      href={`http://localhost:5000/api/files/${e.bill}`}
                      target="_blank"
                      sx={{ mt: 1 }}
                    >
                      View Bill
                    </Button>
                  )}
                </>
              )}
            </Box>

            <Box>
              {editId === e._id ? (
                <>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{ mr: 1 }}
                    onClick={updateExpense}
                  >
                    Save
                  </Button>
                  <Button
                    size="small"
                    sx={{ ml: 1 }}
                    onClick={() => setEditId(null)}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <IconButton
                    onClick={() => {
                      setEditId(e._id);
                      setEditData({
                        amount: e.amount,
                        category: e.category,
                      });
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => setDeleteId(e._id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </>
              )}
            </Box>
          </Box>
        </Paper>
      ))}

      {/* DELETE CONFIRM */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete this expense?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" onClick={deleteExpense}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* ADD EXPENSE */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Expense</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Amount"
            type="number"
            margin="normal"
            error={!!errors.amount}
            helperText={errors.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />

          <TextField
            fullWidth
            label="Category"
            margin="normal"
            error={!!errors.category}
            helperText={errors.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <TextField
            fullWidth
            label="Payment Type"
            margin="normal"
            error={!!errors.paymentType}
            helperText={errors.paymentType}
            onChange={(e) => setForm({ ...form, paymentType: e.target.value })}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Expense Date"
              value={form.date}
              onChange={(newValue) =>
                setForm({ ...form, date: newValue })
              }
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                  error: !!errors.date,
                  helperText: errors.date,
                },
              }}
            />
          </LocalizationProvider>

          <Box mt={3}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFileIcon />}
              fullWidth
              sx={{ borderStyle: "dashed" }}
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
                display="block"
                mt={1}
                textAlign="center"
              >
                Selected: {form.bill.name}
              </Typography>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submit}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={2000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
}
