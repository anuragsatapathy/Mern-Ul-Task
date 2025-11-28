import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../api/api";
import { confirmDialog } from "../utils/confirmDialog";

const TaskForm = ({ selectedList, fetchTasks, editingTask, setEditingTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Task title is required");

    try {
      if (editingTask) {
        const confirmed = await confirmDialog("Are you sure you want to edit this task?");
        if (!confirmed) return;

        await api.put(`/task/${editingTask._id}`, { title, description });
        toast.success("Task updated");
        setEditingTask(null);
      } else {
        await api.post("/task", { listId: selectedList._id, title, description });
        toast.success("Task created");
      }
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">{editingTask ? "Update Task" : "Add Task"}</button>
    </form>
  );
};

export default TaskForm;
