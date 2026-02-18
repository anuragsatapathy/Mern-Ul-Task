import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import toast from "react-hot-toast";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let temp = {};
    if (!form.name) temp.name = "Name is required";
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
      await axios.post("/auth/register", form);
      toast.success("Registration successful");
      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed"
      );
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
    '& .MuiSvgIcon-root': { color: 'white' }, 
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
      <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.9)", mb: 0.5 }}>
        Join Us
      </Typography>

      <Typography variant="h3" sx={{ color: "white", fontWeight: 400, mb: 4, letterSpacing: 1 }}>
        Register
      </Typography>

      <Box sx={{ width: '100%', maxWidth: 420, px: 4 }}>
        {/* Name Field */}
        <TextField
          fullWidth
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={!!errors.name}
          helperText={errors.name}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlineIcon sx={{ color: 'white', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={glassInputStyles}
        />

        {/* Email Field */}
        <TextField
          fullWidth
          placeholder="Email Address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={!!errors.email}
          helperText={errors.email}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MailOutlineIcon sx={{ color: 'white', fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={glassInputStyles}
        />

        {/* Password Field */}
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

        {/* Role Select Field */}
        <TextField
          select
          fullWidth
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BadgeOutlinedIcon sx={{ color: 'white', fontSize: 20, mr: 1 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            ...glassInputStyles,
            '& .MuiSelect-select': { color: 'white' }
          }}
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </TextField>

        {/* Register Button */}
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
          Create Account
        </Button>

        {/* Login Redirect */}
        <Typography mt={4} align="center" sx={{ color: 'white', fontSize: '0.9rem' }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: 'white', fontWeight: 600, textDecoration: 'underline' }}>
            Login
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}