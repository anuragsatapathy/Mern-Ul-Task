import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import CssBaseline from "@mui/material/CssBaseline";

import App from "./App";
import store from "./store";

import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <CssBaseline />
        <App />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="colored"
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
