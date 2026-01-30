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
import { PersonOutline, LockOpenOutlined } from "@mui/icons-material";
import axios from "../api/axios";
import { showSuccess, showError } from "../utils/toast";
import useAuth from "../auth/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setToken } = useAuth();

  
  const inviteToken = new URLSearchParams(location.search).get("invite");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (!specialCharRegex.test(form.password)) {
      newErrors.password =
        "Password must contain at least one special character";
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

      setToken(token);
      setUser(user);

     
      if (inviteToken) {
           await axios.post(
          "/invites/accept",
          { token: inviteToken },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      }

      showSuccess("Login successful");

     
      navigate("/workspaces", { replace: true });
    } catch (err) {
      showError(
        err.response?.data?.message || "Invalid email or password"
      );
    }
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      color: "white",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      "& fieldset": {
        borderColor: "rgba(255, 255, 255, 0.4)",
        borderRadius: "12px",
      },
      "&:hover fieldset": { borderColor: "white" },
      "&.Mui-focused fieldset": { borderColor: "#4ade80" },
    },
    mb: 3,
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
            Login
          </Typography>
          <Typography color="rgba(255,255,255,0.7)">
            Sign in to continue
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate>
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
              borderRadius: "12px",
              color: "#4ade80",
              borderColor: "#4ade80",
              fontWeight: 600,
            }}
          >
            Login
          </Button>
        </Box>

        <Typography
          textAlign="center"
          mt={4}
          color="rgba(255,255,255,0.6)"
        >
          Don’t have an account?{" "}
          <Link
            to={`/register${inviteToken ? `?invite=${inviteToken}` : ""}`}
            style={{
              color: "#4ade80",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Register
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Login;
