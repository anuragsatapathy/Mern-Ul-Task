import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Grid,
  styled,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import api from "../api/api";
import EmptyState from "../components/EmptyState";

const HobbyCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: "#f3effb", 
  borderRadius: "12px",
  position: "relative",
  boxShadow: "none",
  border: "1px solid rgba(0,0,0,0.05)",
  transition: "all 0.3s ease",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0px 8px 20px rgba(0,0,0,0.1)",
    backgroundColor: "#ece6f8",
  },
}));

const Hobby = () => {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const fetchData = async () => {
    const res = await api.get("/hobbies");
    const items = res?.data?.data?.items ?? [];
    setList(items);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAdd = () => {
    setEditId(null);
    setName("");
    setError("");
    setOpen(true);
  };

  const openEdit = (x) => {
    setEditId(x._id);
    setName(x.name);
    setError("");
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setEditId(null);
    setName("");
    setError("");
  };

  const save = async () => {
    if (!name.trim()) {
      setError("Hobby is required");
      toast.error("Please enter hobby");
      return;
    }

    try {
      if (editId) {
        await api.put(`/hobbies/${editId}`, { name });
        toast.success("Hobby updated");
      } else {
        await api.post("/hobbies", { name });
        toast.success("Hobby added");
      }
      close();
      fetchData();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const remove = async () => {
    try {
      await api.delete(`/hobbies/${confirmId}`);
      toast.success("Hobby deleted");
      setConfirmId(null);
      fetchData();
    } catch {
      toast.error("Failed to delete hobby");
    }
  };

  return (
    <Box width="100%" p={3}>
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight={600} sx={{ color: "#1a1a1a" }}>
          Hobbies
        </Typography>
        <Button 
          variant="contained" 
          onClick={openAdd}
          sx={{ 
            borderRadius: "6px", 
            textTransform: "uppercase", 
            px: 3,
            backgroundColor: "#1976d2", 
            fontWeight: "bold"
          }}
        >
          ADD HOBBY
        </Button>
      </Box>

    
      {list.length === 0 ? (
        <EmptyState text="No hobbies added yet." />
      ) : (
        <Grid container spacing={3}>
          {list.map((x) => (
            <Grid item xs={12} sm={6} md={4} key={x._id}>
              <HobbyCard>
                
                <Box position="absolute" top={12} right={12}>
                  <IconButton 
                    size="small" 
                    onClick={() => openEdit(x)}
                    sx={{ color: "#555", "&:hover": { color: "#1976d2" } }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => setConfirmId(x._id)}
                    sx={{ "&:hover": { color: "#d32f2f" } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
            <Box>
                <Typography 
                  variant="overline" 
                  display="block" 
                  sx={{ color: "#1976d2", fontWeight: 700, letterSpacing: 1 }}
                >
                  INTEREST
                </Typography>
                
                <Typography 
                  variant="h6" 
                  sx={{ fontWeight: 800, textTransform: "uppercase", color: "#333", mt: 0.5 }}
                >
                  {x.name}
                </Typography>
                </Box>
              </HobbyCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={close} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editId ? "Edit Hobby" : "Add Hobby"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="What is your hobby?"
            fullWidth
            variant="outlined"
            size="small"
            value={name}
            error={!!error}
            helperText={error}
            onChange={(e) => setName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={close} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={save} sx={{ borderRadius: "6px" }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!confirmId} onClose={() => setConfirmId(null)}>
        <DialogTitle sx={{ fontWeight: 600 }}>Delete hobby?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to remove this hobby?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setConfirmId(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={remove} sx={{ borderRadius: "6px" }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Hobby;