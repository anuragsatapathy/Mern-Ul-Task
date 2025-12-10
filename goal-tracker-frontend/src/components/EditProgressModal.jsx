import { useState } from "react";

const EditProgressModal = ({ goal, onClose, onSave }) => {
  const [value, setValue] = useState(goal.currentValue ?? 0);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numeric = Number(value);
    if (Number.isNaN(numeric) || numeric < 0) {
      alert("Please enter a valid non-negative number.");
      return;
    }

    setSaving(true);
    try {
      await onSave(numeric);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Update Progress</h2>
          <button className="btn btn-outline" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p className="text-muted">
            Goal: <strong>{goal.title}</strong>
          </p>
          <p className="text-muted">
            Target value: <strong>{goal.targetValue}</strong>
          </p>

          <form onSubmit={handleSubmit} className="mt-16">
            <div className="form-group full">
              <label className="form-label">Current value</label>
              <input
                type="number"
                className="form-input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProgressModal;
