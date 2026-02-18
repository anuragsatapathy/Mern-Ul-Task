import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { socket } from "../../context/SocketContext";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  TextField,
  Typography,
  Avatar,
  Badge,
  InputAdornment,
  Divider,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CircleIcon from '@mui/icons-material/Circle';

export default function Sidebar({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Logic remains untouched
  const fetchUsers = async () => {
    try {
      const res = await axios.get("/user");
      setUsers(res.data.data);
    } catch (err) {
      console.log("Failed to fetch users");
    }
  };

  const searchUsers = async (keyword) => {
    try {
      const res = await axios.get(`/user/search?keyword=${keyword}`);
      setUsers(res.data.data);
    } catch (err) {
      console.log("Search failed");
    }
  };

  useEffect(() => {
    if (search.trim() === "") {
      fetchUsers();
    } else {
      searchUsers(search);
    }
  }, [search]);

  useEffect(() => {
    socket.on("refresh_sidebar", fetchUsers);
    return () => {
      socket.off("refresh_sidebar", fetchUsers);
    };
  }, []);

  useEffect(() => {
    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });
    return () => {
      socket.off("online_users");
    };
  }, []);

  return (
    <Box
      sx={{
        width: 320, // Slightly wider for a more professional feel
        height: "100vh",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderRight: "1px solid rgba(0, 0, 0, 0.08)",
        display: "flex",
        flexDirection: "column",
        boxShadow: "4px 0 15px rgba(0,0,0,0.02)",
      }}
    >
      {/* Search Header Area */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#1e529e", mb: 2 }}>
          Messages
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Search names.."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#999", fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: '#f4f7fa',
              '& fieldset': { border: 'none' },
            },
          }}
        />
      </Box>

      <Divider sx={{ mx: 2, opacity: 0.6 }} />

      {/* User List */}
      <List sx={{ overflowY: "auto", flexGrow: 1, pt: 1 }}>
        {users.length === 0 && (
          <Typography sx={{ p: 3, textAlign: "center", color: "#999" }}>
            No users found
          </Typography>
        )}

        {users.map((u) => {
          const isOnline = onlineUsers.includes(u._id);
          
          return (
            <ListItem key={u._id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton 
                onClick={() => onSelectUser(u)}
                sx={{
                  mx: 1,
                  borderRadius: "12px",
                  transition: "0.2s",
                  "&:hover": {
                    backgroundColor: "rgba(61, 133, 211, 0.08)",
                  },
                }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  invisible={!isOnline}
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#44b700',
                      color: '#44b700',
                      boxShadow: `0 0 0 2px white`,
                    },
                  }}
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: "#1e529e", 
                      width: 45, 
                      height: 45,
                      fontSize: '1rem',
                      fontWeight: 600 
                    }}
                  >
                    {u.name.charAt(0).toUpperCase()}
                  </Avatar>
                </Badge>

                <Box sx={{ ml: 2, overflow: "hidden" }}>
                  <Typography 
                    sx={{ 
                      fontWeight: 600, 
                      fontSize: "0.95rem", 
                      color: "#333",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                  >
                    {u.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {isOnline ? (
                      <Typography
                        variant="caption"
                        sx={{ color: "#44b700", display: "flex", alignItems: "center", fontWeight: 500 }}
                      >
                        <CircleIcon sx={{ fontSize: 8, mr: 0.5 }} /> Active now
                      </Typography>
                    ) : (
                      <Typography variant="caption" sx={{ color: "#999" }}>
                        Offline
                      </Typography>
                    )}
                  </Box>
                </Box>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}