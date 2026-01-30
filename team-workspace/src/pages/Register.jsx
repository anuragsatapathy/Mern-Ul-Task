import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
} from "@mui/icons-material";
import axios from "../api/axios";
import { showSuccess, showError } from "../utils/toast";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Invite token (if coming from invite link)
  const inviteToken = new URLSearchParams(location.search).get("invite");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!form.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(form.email))
      newErrors.email = "Enter a valid email address";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    else if (!specialCharRegex.test(form.password))
      newErrors.password =
        "Password must contain at least one special character";

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

      showSuccess("Registration successful. Please login to continue");

      // redirect to login WITH invite token
      navigate(`/login${inviteToken ? `?invite=${inviteToken}` : ""}`);
    } catch (err) {
      showError(
        err.response?.data?.message || "Registration failed"
      );
    }
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      color: "white",
      backgroundColor: "rgba(255,255,255,0.05)",
      "& fieldset": {
        borderColor: "rgba(255,255,255,0.4)",
        borderRadius: "12px",
      },
      "&:hover fieldset": { borderColor: "white" },
      "&.Mui-focused fieldset": { borderColor: "#4ade80" },
    },
    mb: 2.5,
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1e40af, #1e3a8a)",
      }}
    >
      <Container maxWidth="xs">
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" fontWeight={700} color="white">
            Register
          </Typography>
          <Typography color="rgba(255,255,255,0.7)">
            Create your account
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
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
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            sx={inputStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutline sx={{ color: "white" }} />
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
              mt: 1,
              borderRadius: "12px",
              color: "#4ade80",
              borderColor: "#4ade80",
              fontWeight: 600,
            }}
          >
            Register
          </Button>
        </Box>

        <Typography
          textAlign="center"
          mt={4}
          color="rgba(255,255,255,0.6)"
        >
          Already have an account?{" "}
          <Link
            to={`/login${inviteToken ? `?invite=${inviteToken}` : ""}`}
            style={{
              color: "#4ade80",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Login
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Register;
