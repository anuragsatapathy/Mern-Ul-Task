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
import { PersonOutline, LockOpenOutlined } from "@mui/icons-material"; 
import axios from "../api/axios";
import { showSuccess, showError } from "../utils/toast";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!form.password) {
      newErrors.password = "Password is required";
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
      const res = await axios.post("/auth/login", form);
      const { token, user } = res.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      showSuccess("Login successful");
      navigate("/workspaces");
    } catch (err) {
      showError(err.response?.data?.message || "Invalid email or password");
    }
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      color: "white",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.5)", borderRadius: "12px" },
      "&:hover fieldset": { borderColor: "white" },
      "&.Mui-focused fieldset": { borderColor: "#4ade80" }, 
    },
    "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#4ade80" },
    mb: 3,
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
      <Box
        sx={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "rgba(59, 130, 246, 0.2)",
          top: "-100px",
          left: "-100px",
          filter: "blur(80px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "rgba(30, 58, 138, 0.6)",
          bottom: "-50px",
          right: "-50px",
          filter: "blur(60px)",
        }}
      />

      <Container maxWidth="xs" sx={{ zIndex: 1 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" fontWeight="700" color="white" gutterBottom>
            Login
          </Typography>
          <Typography variant="body1" color="rgba(255, 255, 255, 0.7)">
            Please enter your Email and your Password
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            name="email"
            placeholder="Username or E-mail"
            value={form.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            sx={inputStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutline sx={{ color: "white" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            sx={inputStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOpenOutlined sx={{ color: "white" }} />
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
              mt: 2,
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
            Login
          </Button>
        </Box>

        <Typography textAlign="center" mt={4} color="rgba(255, 255, 255, 0.6)">
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: "#4ade80", textDecoration: "none", fontWeight: "bold" }}>
            Register
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Login;