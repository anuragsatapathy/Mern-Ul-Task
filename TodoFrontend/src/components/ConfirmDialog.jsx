// components/ConfirmDialog.jsx
import React from "react";

const ConfirmDialog = ({ show, onClose, onConfirm, title, text, confirmLabel = "Yes", cancelLabel = "Cancel" }) => {
  if (!show) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-box" role="dialog" aria-modal="true">
        {title && <h3 style={{ marginBottom: 8 }}>{title}</h3>}
        <p>{text || "Are you sure?"}</p>
        <div className="confirm-actions" style={{ marginTop: 18 }}>
          <button className="cancel-btn" onClick={onClose}>
            {cancelLabel}
          </button>
          <button
            className="delete-btn"
            onClick={() => {
              onConfirm();
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;





