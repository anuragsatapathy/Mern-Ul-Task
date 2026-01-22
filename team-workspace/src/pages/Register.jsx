import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  Container,
} from "@mui/material";
import { 
  PersonOutline, 
  MailOutline, 
  LockOpenOutlined, 
  BadgeOutlined 
} from "@mui/icons-material";
import axios from "../api/axios";
import { showSuccess, showError } from "../utils/toast";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!specialCharRegex.test(form.password)) {
      newErrors.password = "Password must contain at least one special character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.post("/auth/register", form);
      showSuccess("Registration successful. Please login.");
      navigate("/login");
    } catch (err) {
      const backendMessage = err?.response?.data?.message;
      showError(backendMessage ? backendMessage : "Registration failed. Try again.");
    }
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      color: "white",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.3)", borderRadius: "12px" },
      "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.6)" },
      "&.Mui-focused fieldset": { borderColor: "#4ade80" },
    },
    "& .MuiInputBase-input::placeholder": {
      color: "rgba(255, 255, 255, 0.5)",
      opacity: 1,
    },
    mb: 2.5,
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
     
      <Box sx={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", background: "rgba(59, 130, 246, 0.15)", top: "-100px", left: "-100px", filter: "blur(80px)" }} />
      <Box sx={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "rgba(30, 58, 138, 0.5)", bottom: "-50px", right: "-50px", filter: "blur(60px)" }} />

      <Container maxWidth="xs" sx={{ zIndex: 1 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" fontWeight="700" color="white" gutterBottom>
            Register
          </Typography>
          <Typography variant="body1" color="rgba(255, 255, 255, 0.7)">
            Create your account to get started
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            sx={inputStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeOutlined sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            name="email"
            placeholder="E-mail Address"
            value={form.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            sx={inputStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutline sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            name="password"
            type="password"
            placeholder="Create Password"
            value={form.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            sx={inputStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOpenOutlined sx={{ color: "rgba(255, 255, 255, 0.7)" }} />
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="outlined"
            sx={{
              py: 1.5,
              mt: 1,
              borderRadius: "12px",
              color: "#4ade80",
              borderColor: "#4ade80",
              fontSize: "1rem",
              fontWeight: "600",
              textTransform: "none",
              borderWidth: "2px",
              "&:hover": {
                borderWidth: "2px",
                backgroundColor: "rgba(74, 222, 128, 0.1)",
                borderColor: "#4ade80",
              },
            }}
          >
            Register
          </Button>
        </Box>

        <Typography textAlign="center" mt={4} color="rgba(255, 255, 255, 0.6)">
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#4ade80", textDecoration: "none", fontWeight: "bold" }}>
            Login
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Register;