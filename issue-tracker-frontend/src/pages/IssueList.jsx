import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Box,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchIssues } from "../features/issues/issueSlice";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function IssueList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const issues = useSelector((state) => state.issues.list);
  const user = JSON.parse(localStorage.getItem("user"));

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    dispatch(fetchIssues());
  }, [dispatch]);

  // Load users only when Admin / Tester edits
  useEffect(() => {
    if (editId && (user.role === "admin" || user.role === "tester")) {
      api.get("/users").then((res) => {
        setUsers(res.data.data.items);
      });
    }
  }, [editId, user.role]);

  const filteredIssues = issues.filter((i) => {
    const createdById =
      typeof i.createdBy === "object" ? i.createdBy?._id : i.createdBy;

    const assignedToId =
      typeof i.assignedTo === "object" ? i.assignedTo?._id : i.assignedTo;

    if (user.role === "admin") return true;

    if (user.role === "tester") {
      return createdById === user._id || assignedToId === user._id;
    }

    if (user.role === "developer") {
      return assignedToId === user._id;
    }

    return false;
  });

  const priorityColor = (p) =>
    p === "high" ? "error" : p === "medium" ? "warning" : "success";

  const startEdit = (issue) => {
    setEditId(issue._id);
    setEditData({
      title: issue.title,
      status: issue.status,
      priority: issue.priority,
      assignedTo:
        typeof issue.assignedTo === "object"
          ? issue.assignedTo?._id
          : issue.assignedTo || "",
    });
  };

  const saveEdit = async (id) => {
    await api.put(`/issues/${id}`, editData);
    setEditId(null);
    dispatch(fetchIssues());
  };

  const deleteIssue = async () => {
    await api.delete(`/issues/${deleteId}`);
    setDeleteId(null);
    dispatch(fetchIssues());
  };

  return (
    <Box sx={{ width: "90%", margin: "40px auto" }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">
          Hi {user.name} ({user.role})
        </Typography>

        {(user.role === "admin" || user.role === "tester") && (
          <Button variant="contained" onClick={() => navigate("/issues/new")}>
            Create Issue
          </Button>
        )}
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Priority</TableCell>
            <TableCell>Assigned To</TableCell>
            <TableCell>Assigned By</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredIssues.map((i) => (
            <TableRow
              key={i._id}
              sx={{
                backgroundColor:
                  i.status === "resolved"
                    ? "#e8f5e9"
                    : i.status === "in-progress"
                    ? "#fff3e0"
                    : "inherit",
              }}
            >
              {/* TITLE */}
              <TableCell>
                {editId === i._id &&
                (user.role === "admin" || user.role === "tester") ? (
                  <TextField
                    size="small"
                    value={editData.title}
                    onChange={(e) =>
                      setEditData({ ...editData, title: e.target.value })
                    }
                  />
                ) : (
                  i.title
                )}
              </TableCell>

              {/* STATUS */}
              <TableCell>
                {editId === i._id ? (
                  <Select
                    size="small"
                    value={editData.status}
                    onChange={(e) =>
                      setEditData({ ...editData, status: e.target.value })
                    }
                  >
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="resolved">Resolved</MenuItem>
                  </Select>
                ) : (
                  i.status
                )}
              </TableCell>

              {/* PRIORITY */}
              <TableCell align="center">
                {editId === i._id && user.role !== "developer" ? (
                  <Select
                    size="small"
                    sx={{ width: 110 }}
                    value={editData.priority}
                    onChange={(e) =>
                      setEditData({ ...editData, priority: e.target.value })
                    }
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                ) : (
                  <Chip
                    label={i.priority}
                    color={priorityColor(i.priority)}
                    sx={{ width: 90, textTransform: "capitalize" }}
                  />
                )}
              </TableCell>

              {/* ASSIGNED TO */}
              <TableCell>
                {editId === i._id &&
                (user.role === "admin" || user.role === "tester") ? (
                  <Select
                    size="small"
                    sx={{ minWidth: 140 }}
                    value={editData.assignedTo}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        assignedTo: e.target.value,
                      })
                    }
                  >
                    <MenuItem value="">Unassigned</MenuItem>
                    {users.map((u) => (
                      <MenuItem key={u._id} value={u._id}>
                        {u.name}
                      </MenuItem>
                    ))}
                  </Select>
                ) : (
                  i.assignedTo?.name || "-"
                )}
              </TableCell>

              {/* ASSIGNED BY */}
              <TableCell>{i.createdBy?.name || "-"}</TableCell>

              {/* ACTIONS */}
              <TableCell align="center">
                {editId === i._id ? (
                  <Button size="small" onClick={() => saveEdit(i._id)}>
                    Save
                  </Button>
                ) : (
                  <IconButton onClick={() => startEdit(i)}>
                    <EditIcon />
                  </IconButton>
                )}

                {user.role !== "developer" && (
                  <IconButton
                    color="error"
                    onClick={() => setDeleteId(i._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* DELETE CONFIRMATION */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Are you sure you want to delete this issue?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" onClick={deleteIssue}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
