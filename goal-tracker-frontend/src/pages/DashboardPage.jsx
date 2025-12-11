import { useEffect, useState } from "react";
import api from "../services/api.js";
import ProgressBar from "../components/ProgressBar.jsx";
import EditProgressModal from "../components/EditProgressModal.jsx";
import Pagination from "@mui/material/Pagination";

const DashboardPage = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedGoal, setSelectedGoal] = useState(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalGoals, setTotalGoals] = useState(0);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/goal?page=${page}&limit=${limit}`);

      setGoals(res.data.data.goals);
      setTotalGoals(res.data.data.totalGoals);
      setTotalPages(res.data.data.totalPages);
    } catch (err) {
      console.error(err);
      setError("Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [page]);

  const handleDelete = async (goalId) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;

    try {
      await api.delete(`/goal/${goalId}`);

      if (goals.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        fetchGoals();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete goal");
    }
  };

  const handleSaveProgress = async (newValue) => {
    try {
      const res = await api.put(`/goal/${selectedGoal._id}`, {
        currentValue: newValue,
      });

      const updated = res.data.data;

      setGoals((prev) =>
        prev.map((g) => (g._id === updated._id ? updated : g))
      );
      setSelectedGoal(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update progress");
    }
  };

  return (
    <div>
      <div className="app-header" style={{ marginBottom: 12 }}>
        <div>
          <h2 className="app-title" style={{ fontSize: 20 }}>
            Dashboard
          </h2>
          <p className="app-subtitle">
            Overview of all your goals with live progress.
          </p>
        </div>

        <div className="text-right">
          <p className="text-muted">
            Total goals: <strong>{totalGoals}</strong>
          </p>
        </div>
      </div>

      {loading && <p className="text-muted">Loading goals...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && goals.length > 0 && (
        <>
          <div className="table-wrapper" style={{ overflowX: "hidden" }}>
            <table className="table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Goal</th>
                  <th>Description</th>
                  <th>Target</th>
                  <th>Current</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th style={{ width: 160 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {goals.map((goal) => (
                  <tr key={goal._id}>
                    <td>{goal.title}</td>
                    <td>{goal.description || "—"}</td>
                    <td>{goal.targetValue}</td>
                    <td>{goal.currentValue}</td>
                    <td>
                      <ProgressBar value={goal.progress} />
                    </td>
                    <td>
                      <span
                        className={
                          "badge " +
                          (goal.status === "completed"
                            ? "badge-completed"
                            : "badge-ongoing")
                        }
                      >
                        {goal.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          className="btn btn-outline"
                          onClick={() => setSelectedGoal(goal)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(goal._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
            />
          </div>
        </>
      )}

      {selectedGoal && (
        <EditProgressModal
          goal={selectedGoal}
          onClose={() => setSelectedGoal(null)}
          onSave={handleSaveProgress}
        />
      )}
    </div>
  );
};

export default DashboardPage;

