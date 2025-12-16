import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
            Issue Tracker
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar position="static">
      <Toolbar>
      
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Issue Tracker
        </Typography>

    
        <Button color="inherit" onClick={() => navigate("/issues")}>
          Issues
        </Button>

        <Button
          color="inherit"
          onClick={() => {
            dispatch(logout());
            navigate("/");
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}

