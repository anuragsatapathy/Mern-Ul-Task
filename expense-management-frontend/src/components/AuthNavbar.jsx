import { AppBar, Toolbar, Typography } from "@mui/material";

export default function AuthNavbar() {
  return (
    <AppBar position="static" elevation={1}>
      <Toolbar sx={{ justifyContent: "center" }}>
        <Typography variant="h6" fontWeight={600}>
          Expense Management System
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
