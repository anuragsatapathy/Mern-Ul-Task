import { AppBar, Toolbar, Typography } from "@mui/material";

export default function AuthNavbar() {
  return (
    <AppBar position="static" elevation={1} sx={{ backgroundColor: "#007BFF" }}>
      <Toolbar sx={{ justifyContent: "center" }}>
        <Typography variant="h6" fontWeight={600} color="#000">
          CV Profile Manager
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
