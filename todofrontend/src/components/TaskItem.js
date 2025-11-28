import React, { useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";

const TaskItem = ({ task, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await api.delete(`/task/${task._id}`);
        toast.success("Task deleted");
        onDelete();
      } catch (err) {
        toast.error("Failed to delete task");
      }
    }
  };

  const handleEdit = async () => {
    if (!editTitle) return;
    try {
      await api.put(`/task/${task._id}`, { title: editTitle });
      toast.success("Task updated");
      setIsEditing(false);
      onEdit();
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  return (
    <div className="task-item">
      {isEditing ? (
        <>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <button onClick={handleEdit}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <span>{task.title}</span>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
    </div>
  );
};

export default TaskItem;

