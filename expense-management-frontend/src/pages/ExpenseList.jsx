import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar, { SIDEBAR_WIDTH } from "../components/Navbar";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [deleteId, setDeleteId] = useState(null);

  // pagination state
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // toast state
  const [toast, setToast] = useState({
    open: false,
    message: "",
    type: "success",
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

    // update toast
    setToast({
      open: true,
      message: "Expense updated successfully",
      type: "success",
    });
  };

  const confirmDelete = async () => {
    await api.delete(`/expenses/${deleteId}`);
    setDeleteId(null);
    loadExpenses();

    // delete toast
    setToast({
      open: true,
      message: "Expense deleted successfully",
      type: "success",
    });
  };

  // pagination calculation
  const totalPages = Math.ceil(expenses.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentExpenses = expenses.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <>
      <Navbar />
      <Box sx={{ ml: `${SIDEBAR_WIDTH}px`, p: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5">My Expenses</Typography>
          <Button variant="contained" onClick={() => navigate("/add-expense")}>
            Create Expense
          </Button>
        </Box>


        {currentExpenses.map((e) => (
          <Box key={e._id} sx={{ mt: 2, p: 2, boxShadow: 1 }}>
            {editId === e._id ? (
              <>
                <TextField
                  size="small"
                  value={editData.amount}
                  onChange={(ev) =>
                    setEditData({ ...editData, amount: ev.target.value })
                  }
                  sx={{ mr: 1 }}
                />
                <TextField
                  size="small"
                  value={editData.category}
                  onChange={(ev) =>
                    setEditData({ ...editData, category: ev.target.value })
                  }
                  sx={{ mr: 1 }}
                />
                <Button size="small" onClick={updateExpense}>
                  Update
                </Button>
                <Button size="small" onClick={() => setEditId(null)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Typography fontWeight="bold">
                  ₹ {e.amount}
                </Typography>
                <Typography>{e.category}</Typography>

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
        ))}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              mt: 4,
            }}
          >
            <Button
              variant="outlined"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>

            <Typography>
              Page {page} of {totalPages}
            </Typography>

            <Button
              variant="outlined"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </Box>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
          <DialogTitle>
            Are you sure you want to delete this expense?
          </DialogTitle>
          <DialogActions>
            <Button onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button color="error" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={2000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toast.type} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
