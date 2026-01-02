import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Education from "./pages/Education";
import Experience from "./pages/Experience";
import Skill from "./pages/Skill";
import CVPreview from "./pages/CVPreview";
import ResetPassword from "./pages/ResetPassword";

import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/education"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Education />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/experience"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Experience />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/skills"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Skill />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/cv"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CVPreview />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* RESET PASSWORD ROUTE */}
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ResetPassword />
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
