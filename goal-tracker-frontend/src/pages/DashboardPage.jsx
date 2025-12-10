import { useEffect, useState } from "react";
import api from "../services/api.js";
import ProgressBar from "../components/ProgressBar.jsx";
import EditProgressModal from "../components/EditProgressModal.jsx";

const DashboardPage = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedGoal, setSelectedGoal] = useState(null);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/goal");
      // backend: { isSuccess, message, code, data: [...] }
      setGoals(res.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleDelete = async (goalId) => {
    const confirm = window.confirm("Are you sure you want to delete this goal?");
    if (!confirm) return;

    try {
      await api.delete(`/goal/${goalId}`);
      setGoals((prev) => prev.filter((g) => g._id !== goalId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete goal");
    }
  };

  const handleSaveProgress = async (newValue) => {
    if (!selectedGoal) return;

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
            Total goals: <strong>{goals.length}</strong>
          </p>
        </div>
      </div>

      {loading && <p className="text-muted">Loading goals...</p>}
      {error && <p style={{ color: "red", marginBottom: 12 }}>{error}</p>}

      {!loading && goals.length === 0 && (
        <p className="text-muted">No goals yet. Add your first one!</p>
      )}

      {!loading && goals.length > 0 && (
        <div className="table-wrapper">
          <table className="table">
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
                  <td style={{ maxWidth: 220 }}>
                    <span className="text-muted">
                      {goal.description || "—"}
                    </span>
                  </td>
                  <td>{goal.targetValue}</td>
                  <td>{goal.currentValue}</td>
                  <td>
                    <ProgressBar value={goal.progress ?? 0} />
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
