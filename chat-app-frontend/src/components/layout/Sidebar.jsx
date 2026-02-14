import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { Box, List, ListItem, ListItemButton } from "@mui/material";

export default function Sidebar({ onSelectUser }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("/user").then((res) => setUsers(res.data.data));
  }, []);

  return (
    <Box sx={{ width: 250, borderRight: "1px solid #eee" }}>
      <List>
        {users.map((u) => (
          <ListItem key={u._id} disablePadding>
            <ListItemButton onClick={() => onSelectUser(u)}>
              {u.name}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
