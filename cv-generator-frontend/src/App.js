import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Education from "./pages/Education";
import Experience from "./pages/Experience";
import Skill from "./pages/Skill";
import CVPreview from "./pages/CVPreview";
import ResetPassword from "./pages/ResetPassword";

// NEW PAGES
import ConferencesAndCourses from "./pages/ConferencesAndCourses";
import Certificates from "./pages/Certificates";

import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";

export default function App() {
  return (
    <BrowserRouter>
      {/* GLOBAL TOAST */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED ROUTES */}
        {[
          ["/profile", <Profile />],
          ["/education", <Education />],
          ["/experience", <Experience />],
          ["/skills", <Skill />],

          // NEW ROUTES
          ["/conference-and-courses", <ConferencesAndCourses />],
          ["/certificates", <Certificates />],

          ["/cv", <CVPreview />],
          ["/reset-password", <ResetPassword />],
        ].map(([path, element]) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute>
                <MainLayout>{element}</MainLayout>
              </ProtectedRoute>
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}
