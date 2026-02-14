import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@mui/material";
import theme from "./theme/theme";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <App />
    <Toaster position="top-right" />
  </ThemeProvider>
);
