import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Paper,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReceiptIcon from "@mui/icons-material/Receipt";
import api from "../api/api";
import MainLayout from "../components/MainLayout";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 10;

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [page, setPage] = useState(1);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  const loadExpenses = async () => {
    const res = await api.get("/expenses");
    setExpenses(res.data.data.items);
    setPage(1);
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const updateExpense = async () => {
    await api.put(`/expenses/${editId}`, editData);
    setEditId(null);
    loadExpenses();
    setToast({ open: true, message: "Expense updated", severity: "success" });
  };

  const deleteExpense = async () => {
    await api.delete(`/expenses/${deleteId}`);
    setDeleteId(null);
    loadExpenses();
    setToast({ open: true, message: "Expense deleted", severity: "success" });
  };

  const totalPages = Math.ceil(expenses.length / ITEMS_PER_PAGE);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const currentExpenses = expenses.slice(start, start + ITEMS_PER_PAGE);

  return (
    <MainLayout>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h5" fontWeight={600}>
          My Expenses
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/add-expense")}
        >
          Add Expense
        </Button>
      </Box>

      {/* Expense cards */}
      {currentExpenses.map((e) => (
        <Paper
          key={e._id}
          sx={{
            p: 3,
            pl: 4,      
            mb: 3,
            borderRadius: 2,
          }}
        >
          <Box display="flex" justifyContent="space-between">
            <Box>
              {editId === e._id ? (
                <>
                  <TextField
                    size="small"
                    type="number"
                    value={editData.amount}
                    sx={{ mr: 1 }}
                    onChange={(ev) =>
                      setEditData({
                        ...editData,
                        amount: ev.target.value,
                      })
                    }
                  />
                  <TextField
                    size="small"
                    value={editData.category}
                    onChange={(ev) =>
                      setEditData({
                        ...editData,
                        category: ev.target.value,
                      })
                    }
                  />
                </>
              ) : (
                <>
                  <Typography fontWeight={600}>
                    ₹ {e.amount}
                  </Typography>
                  <Typography color="text.secondary">
                    {e.category}
                  </Typography>

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
                  <Button size="small" onClick={() => setEditId(null)}>
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

      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete this expense?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" onClick={deleteExpense}>
            Delete
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
