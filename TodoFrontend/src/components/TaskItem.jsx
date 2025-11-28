import React, { useState } from "react";
import { toast } from "react-toastify";

const TaskItem = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleSave = async () => {
    if (!editTitle.trim()) {
      toast.error("Task title cannot be empty");
      return;
    }
    try {
      await onUpdate(task._id, editTitle); // wait for API call
      setIsEditing(false);
    } catch {
      toast.error("Failed to update task");
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

  return (
    <div className="card">
      {isEditing ? (
        <>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="input-box"
          />
          <div className="action-buttons">
            <button className="icon-btn edit" onClick={handleSave}>
              Save
            </button>
            <button className="icon-btn delete" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <span>{task.title}</span>
          <div className="action-buttons">
            <button className="icon-btn edit" onClick={() => setIsEditing(true)}>
              Edit
            </button>
            <button className="icon-btn delete" onClick={() => onDelete(task._id)}>
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskItem;




