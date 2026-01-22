import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Box, Button, Typography, TextField } from "@mui/material";
import Navbar from "../components/Navbar";
import { showSuccess } from "../utils/toast";
import { useNavigate } from "react-router-dom";

const Workspaces = () => {
  const [list, setList] = useState([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const fetchWorkspaces = async () => {
    const res = await axios.get("/workspaces");
    setList(res.data.data);
  };

  const createWorkspace = async () => {
    await axios.post("/workspaces", { name });
    showSuccess("Workspace created");
    setName("");
    fetchWorkspaces();
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  return (
    <>
      <Navbar />
      <Box p={3}>
        <Typography variant="h5">Workspaces</Typography>

        <TextField
          label="Workspace name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={createWorkspace}>Create</Button>

        {list.map((w) => (
          <Box key={w.id} mt={2}>
            <Button onClick={() => navigate(`/projects/${w.id}`)}>
              {w.name}
            </Button>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default Workspaces;
