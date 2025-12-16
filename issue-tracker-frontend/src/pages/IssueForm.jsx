import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
} from "@mui/material";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function IssueForm() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignedTo: "",
  });

  useEffect(() => {
    if (user.role === "admin" || user.role === "tester") {
      api.get("/users").then((res) => {
        setUsers(res.data.data.items);
      });
    }
  }, [user.role]);

  const submit = async () => {
    // Frontend validation 
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (user.role === "tester" && !form.assignedTo) {
      toast.error("Tester must assign the issue");
      return;
    }

    try {
      await api.post("/issues", form);
      toast.success("Issue created successfully");
      navigate("/issues");
    } catch (err) {
      toast.error("Failed to create issue");
    }
  };

  return (
    <Box sx={{ width: 500, margin: "40px auto" }}>
      <Typography variant="h5" mb={2}>
        Create Issue
      </Typography>

      <TextField
        fullWidth
        label="Title"
        margin="normal"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      <TextField
        fullWidth
        label="Description"
        margin="normal"
        multiline
        rows={3}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <TextField
        select
        fullWidth
        label="Priority"
        margin="normal"
        value={form.priority}
        onChange={(e) =>
          setForm({ ...form, priority: e.target.value })
        }
      >
        <MenuItem value="low">Low</MenuItem>
        <MenuItem value="medium">Medium</MenuItem>
        <MenuItem value="high">High</MenuItem>
      </TextField>

      {(user.role === "admin" || user.role === "tester") && (
        <TextField
          select
          fullWidth
          label="Assign To"
          margin="normal"
          value={form.assignedTo}
          onChange={(e) =>
            setForm({ ...form, assignedTo: e.target.value })
          }
        >
          <MenuItem value="">Unassigned</MenuItem>
          {users.map((u) => (
            <MenuItem key={u._id} value={u._id}>
              {u.name} ({u.role})
            </MenuItem>
          ))}
        </TextField>
      )}

      <Button variant="contained" sx={{ mt: 2 }} onClick={submit}>
        Create Issue
      </Button>
    </Box>
  );
}
