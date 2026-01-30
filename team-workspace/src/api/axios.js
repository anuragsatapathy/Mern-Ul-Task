import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token expired or unauthorized
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    if (error.response?.status === 403) {
      console.warn("Access denied: insufficient permissions");
    }

    return Promise.reject(error);
  }
);

export default api;
