import React, { useState, useEffect } from "react";
import { updateTask } from "../api/taskService";
import { toast } from "react-toastify";

const TaskItem = ({ task, onDelete, refresh }) => {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    setTitle(task.title);
    setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "");
  }, [task]);

  // Toggle completion
  const toggleComplete = async () => {
    const updated = await updateTask(task._id, {
      isCompleted: !task.isCompleted,
      completedAt: !task.isCompleted ? new Date() : null,
      listId: task.listId,
    });

    if (!updated) return toast.error("Failed to update task");

    toast.success(updated.isCompleted ? "Task marked completed" : "Task marked pending");
    refresh();
  };

  const handleSave = async () => {
    if (!title.trim()) return toast.error("Task title required");

    const updated = await updateTask(task._id, {
      title: title.trim(),
      dueDate: dueDate || null,
      listId: task.listId,
    });

    if (!updated) return toast.error("Failed to update task");

    toast.success("Task updated");
    setEditMode(false);
    refresh();
  };

  return (
    <div className={`task-item ${task.isCompleted ? "task-completed" : ""}`}>
      
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={task.isCompleted}
        onChange={toggleComplete}
        className="task-checkbox"
      />

      {editMode ? (
        <div className="task-edit-row">
          <input
            className="task-edit-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="date"
            className="task-edit-date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <button className="save-btn small" onClick={handleSave}>Save</button>
          <button className="cancel-btn-small small" onClick={() => setEditMode(false)}>
            Cancel
          </button>
        </div>
      ) : (
        <>
          <div className="task-content">
            <b className={task.isCompleted ? "completed-text" : ""}>{task.title}</b>

            {task.isCompleted && (
              <div className="completed-date">
                Completed on: {new Date(task.completedAt).toLocaleDateString()}
              </div>
            )}

            {!task.isCompleted && task.dueDate && (
              <div className="task-date">{new Date(task.dueDate).toLocaleDateString()}</div>
            )}
          </div>

          <div className="task-actions">
            <button className="icon-btn edit-icon" onClick={() => setEditMode(true)}>✏️</button>
            <button className="icon-btn delete-icon" onClick={() => onDelete(task._id)}>🗑️</button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskItem;



















