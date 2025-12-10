import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

const AddGoalPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    targetValue: "",
    currentValue: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.targetValue) {
      alert("Title and target value are required.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      targetValue: Number(form.targetValue),
    };

    if (form.currentValue !== "") {
      payload.currentValue = Number(form.currentValue);
    }

    setSubmitting(true);
    try {
      await api.post("/goal", payload);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to create goal");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="app-header" style={{ marginBottom: 16 }}>
        <div>
          <h2 className="app-title" style={{ fontSize: 20 }}>
            Add New Goal
          </h2>
          <p className="app-subtitle">
            Define your target and start tracking your progress.
          </p>
        </div>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group full">
            <label className="form-label">
              Goal Title <span style={{ color: "red" }}>*</span>
            </label>
            <input
              className="form-input"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., Run 100 km"
              required
            />
          </div>

          <div className="form-group full">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Short description of your goal (optional)"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Target Value <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="number"
              className="form-input"
              name="targetValue"
              value={form.targetValue}
              onChange={handleChange}
              placeholder="e.g., 100"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Current Value (optional)</label>
            <input
              type="number"
              className="form-input"
              name="currentValue"
              value={form.currentValue}
              onChange={handleChange}
              placeholder="e.g., 20"
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group full" style={{ textAlign: "right" }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create Goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGoalPage;
