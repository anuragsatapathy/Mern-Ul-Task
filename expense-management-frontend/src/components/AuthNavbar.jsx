import { AppBar, Toolbar, Typography } from "@mui/material";

export default function AuthNavbar() {
  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "center" }}>
        <Typography variant="h6">
          Expense Management System
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
