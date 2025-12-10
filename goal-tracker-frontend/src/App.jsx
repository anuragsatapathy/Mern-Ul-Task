import { NavLink, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage.jsx";
import AddGoalPage from "./pages/AddGoalPage.jsx";

const App = () => {
  return (
    <div className="app-root">
      <div className="app-container">
        <header className="app-header">
          <div>
            <h1 className="app-title">Goal Progress Tracker</h1>
            <p className="app-subtitle">
              Track your goals, update progress, and celebrate completion.
            </p>
          </div>
        </header>

        <nav className="navbar">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/add"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
          >
            Add Goal
          </NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/add" element={<AddGoalPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
