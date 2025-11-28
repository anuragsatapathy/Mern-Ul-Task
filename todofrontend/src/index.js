import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css"; // global styles
import "react-toastify/dist/ReactToastify.css"; // toast notifications

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
