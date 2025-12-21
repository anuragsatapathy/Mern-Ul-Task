import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [deleteId, setDeleteId] = useState(null);

  const loadExpenses = async () => {
    const res = await api.get("/expenses");
    setExpenses(res.data.data.items);
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const startEdit = (expense) => {
    setEditId(expense._id);
    setEditData({
      amount: expense.amount,
      category: expense.category,
      paymentType: expense.paymentType,
    });
  };

  const updateExpense = async () => {
    await api.put(`/expenses/${editId}`, editData);
    setEditId(null);
    loadExpenses();
  };

  const deleteExpense = async () => {
    await api.delete(`/expenses/${deleteId}`);
    setDeleteId(null);
    loadExpenses();
  };

  return (
    <>
      <Navbar />

      <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
        <Typography variant="h5" mb={3}>
          My Expenses
        </Typography>

        {expenses.map((e) => (
          <Box
            key={e._id}
            sx={{
              p: 2,
              mb: 2,
              boxShadow: 2,
              borderRadius: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
          
            {editId === e._id ? (
              <Box sx={{ flex: 1 }}>
                <TextField
                  label="Amount"
                  fullWidth
                  margin="dense"
                  value={editData.amount}
                  onChange={(ev) =>
                    setEditData({ ...editData, amount: ev.target.value })
                  }
                />
                <TextField
                  label="Category"
                  fullWidth
                  margin="dense"
                  value={editData.category}
                  onChange={(ev) =>
                    setEditData({ ...editData, category: ev.target.value })
                  }
                />
                <TextField
                  label="Payment Type"
                  fullWidth
                  margin="dense"
                  value={editData.paymentType}
                  onChange={(ev) =>
                    setEditData({
                      ...editData,
                      paymentType: ev.target.value,
                    })
                  }
                />

                <Button size="small" onClick={updateExpense}>
                  Update
                </Button>
                <Button size="small" onClick={() => setEditId(null)}>
                  Cancel
                </Button>
              </Box>
            ) : (
              <Box sx={{ flex: 1 }}>
                <Typography fontWeight="bold">₹ {e.amount}</Typography>
                <Typography>{e.category}</Typography>
                <Typography variant="body2">
                  {new Date(e.date).toDateString()}
                </Typography>

             
                {e.bill && (
                  <Typography mt={1}>
                    <a
                      href={`http://localhost:5000/api/files/${e.bill}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Bill
                    </a>
                  </Typography>
                )}
              </Box>
            )}

            {editId !== e._id && (
              <Box>
                <IconButton onClick={() => startEdit(e)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => setDeleteId(e._id)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Box>
            )}
          </Box>
        ))}

        <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
          <DialogTitle>
            Are you sure you want to delete this expense?
          </DialogTitle>
          <DialogActions>
            <Button onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button color="error" onClick={deleteExpense}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
