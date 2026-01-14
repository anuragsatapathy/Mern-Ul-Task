import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  InputAdornment,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import AuthNavbar from "../components/AuthNavbar";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"; 
import GoogleIcon from "@mui/icons-material/Google";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const auth = getAuth(); 

  const submit = async (e) => {
    e.preventDefault();

    const err = {};
    if (!email) err.email = "Email required";
    if (!password) err.password = "Password required";
    setErrors(err);

   
    if (Object.keys(err).length) {
      setToast({
        open: true,
        message: "Please fill all required fields",
        severity: "error",
      });
      return;
    }

    // email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setToast({
        open: true,
        message: "Please enter a valid email address",
        severity: "error",
      });
      return;
    }

    // password validation
    if (!/[!@#$%^&*]/.test(password)) {
      setToast({
        open: true,
        message: "Password must contain at least one special character",
        severity: "error",
      });
      return;
    }

    try {
      const res = await api.post("/users/login", { email, password });
      localStorage.setItem("token", res.data.data.token);

      setToast({
        open: true,
        message: "Login successful",
        severity: "success",
      });

      setTimeout(() => navigate("/profile"), 800);
    } catch {
    
      setToast({
        open: true,
        message: "Invalid email or password",
        severity: "error",
      });
    }
  };

 const handleSSOLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const token = await user.getIdToken();
    localStorage.setItem("token", token);

    setToast({
      open: true,
      message: "Login successful",
      severity: "success",
    });

       setTimeout(() => {
      navigate("/profile");
    }, 800);

    //navigate("/profile");
    
  } catch (error) {
    console.error("Google Login Error:", error);
    setToast({
      open: true,
      message: error.message || "Google login failed",
      severity: "error",
    });
  }
};



  return (
    <>
      <AuthNavbar />

      <Box sx={{ minHeight: "calc(100vh - 64px)", display: "flex" }}>
        {/* LEFT */}
        <Box
          sx={{
            flex: 1,
            bgcolor: "#1e88e5",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderTopRightRadius: "100% 80%",
          }}
        >
          <Typography variant="h4" fontWeight={700}>
            New here ?
          </Typography>
          <Typography mt={1}>Then Sign Up and Create Account!</Typography>
          <Button
            variant="outlined"
            sx={{
              mt: 3,
              color: "#fff",
              borderColor: "#fff",
              borderRadius: 20,
              px: 4,
            }}
            onClick={() => navigate("/register")}
          >
            SIGN UP
          </Button>
        </Box>

        {/* RIGHT */}
        <Box
          component="form"
          onSubmit={submit}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" mb={4}>
            Sign in
          </Typography>

          <TextField
            placeholder="Email"
            sx={{ width: 320, mb: 2 }}
            value={email}
            error={!!errors.email}
            helperText={errors.email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="disabled" />
                </InputAdornment>
              ),
              sx: { borderRadius: 50, bgcolor: "#f2f2f2" },
            }}
          />

          <TextField
            placeholder="Password"
            type="password"
            sx={{ width: 320, mb: 3 }}
            value={password}
            error={!!errors.password}
            helperText={errors.password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="disabled" />
                </InputAdornment>
              ),
              sx: { borderRadius: 50, bgcolor: "#f2f2f2" },
            }}
          />

          {/* LOGIN */}
            <Button
              type="submit"
              sx={{
                width: 200,
                borderRadius: 20,
                bgcolor: "#5c9dff",
                color: "#fff",
                fontWeight: 600,
                "&:hover": { bgcolor: "#4a8bf0" },
                mb: 2, 
              }}
            >
              LOGIN
            </Button>

            {/* GOOGLE LOGIN */}
            <Button
              onClick={handleSSOLogin}
              startIcon={<GoogleIcon />}
              sx={{
                width: 200,
                borderRadius: 20,
                bgcolor: "#fff",
                color: "#444",
                fontWeight: 600,
                border: "1px solid #ddd",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#f5f5f5",
                  borderColor: "#bbb",
                },
              }}
            >
              Sign in with Google
            </Button>

        </Box>
      </Box>

      {/* TOAST */}
      <Snackbar
        open={toast.open}
        autoHideDuration={2000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}