import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
<<<<<<< HEAD
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
=======
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized – token invalid or expired");

      //clear token
      localStorage.removeItem("token");

      //redirect to login
>>>>>>> c22e6c5983dbd5d9b3c8c016494601816801d841
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
