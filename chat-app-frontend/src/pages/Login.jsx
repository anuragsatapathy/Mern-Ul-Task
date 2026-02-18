import { useState } from "react";
import { Box, TextField, Button, Typography, Checkbox, FormControlLabel, Link as MuiLink, InputAdornment } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import toast from "react-hot-toast";
import { connectSocket } from "../context/SocketContext";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let temp = {};
    if (!form.email) temp.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      temp.email = "Invalid email format";

    if (!form.password) temp.password = "Password is required";
    else if (form.password.length < 6)
      temp.password = "Minimum 6 characters required";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      const res = await axios.post("/auth/login", form);
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("userId", res.data.data.user._id);
      localStorage.setItem("role", res.data.data.user.role);
      connectSocket();
      toast.success("Login successful");
      navigate("/chat");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    }
  };

  const glassInputStyles = {
    '& .MuiOutlinedInput-root': {
      color: 'white',
      borderRadius: '50px',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(8px)',
      paddingLeft: '15px',
      '& fieldset': { border: 'none' },
      '&:hover fieldset': { border: 'none' },
      '&.Mui-focused fieldset': { border: 'none' },
    },
    '& .MuiInputBase-input::placeholder': {
      color: 'rgba(255, 255, 255, 0.7)',
      opacity: 1,
    },
    mb: 2,
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      
        background: "linear-gradient(180deg, #1e529e 0%, #3d85d3 40%, #9bc4e2 100%)",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Header Section */}
      <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.9)", mb: 0.5 }}>
        Have an account?
      </Typography>
      
      <Typography variant="h3" sx={{ color: "white", fontWeight: 400, mb: 5, letterSpacing: 1 }}>
        Login
      </Typography>

      <Box sx={{ width: '100%', maxWidth: 420, px: 4 }}>
      
        <TextField
          fullWidth
          placeholder="Username"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={!!errors.email}
          helperText={errors.email}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlineIcon sx={{ color: 'white', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={glassInputStyles}
        />

      
        <TextField
          fullWidth
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={!!errors.password}
          helperText={errors.password}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon sx={{ color: 'white', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={glassInputStyles}
        />

       
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          sx={{
            py: 1.8,
            mt: 1,
            borderRadius: '50px',
            bgcolor: 'rgba(255, 255, 255, 0.85)',
            color: '#2a5298',
            fontWeight: 'bold',
            fontSize: '1rem',
            textTransform: 'none',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            '&:hover': { 
                bgcolor: 'white',
                boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
            },
          }}
        >
          Login
        </Button>

        
        <Typography mt={6} align="center" sx={{ color: 'white', fontSize: '0.9rem' }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: 'white', fontWeight: 600, textDecoration: 'underline' }}>
            Register
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}