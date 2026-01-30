import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Workspaces from "./pages/Workspaces";
import WorkspaceMembers from "./pages/WorkspaceMembers";
import Projects from "./pages/Projects";
import ProjectPreview from "./pages/ProjectPreview";
import Tasks from "./pages/Tasks";
import Activity from "./pages/Activity";
import InviteAccept from "./pages/InviteAccept";

import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/invite/:token" element={<InviteAccept />} />

      {/* Protected */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/workspaces"
        element={
          <ProtectedRoute>
            <Workspaces />
          </ProtectedRoute>
        }
      />

      <Route
        path="/workspaces/:workspaceId/members"
        element={
          <ProtectedRoute>
            <WorkspaceMembers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/:workspaceId"
        element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        }
      />

      <Route
      path="/project-preview/:projectId"
      element={
        <ProtectedRoute>
          <ProjectPreview />
        </ProtectedRoute>
      }
    />


      <Route
        path="/tasks/:projectId"
        element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        }
      />

      <Route
        path="/activity"
        element={
          <ProtectedRoute>
            <Activity />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;
