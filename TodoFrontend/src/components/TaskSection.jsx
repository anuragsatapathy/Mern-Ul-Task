import React, { useState, useEffect } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../api/taskService";
import TaskItem from "./TaskItem";
import { toast } from "react-toastify";

const TaskSection = ({ selectedList }) => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    if (!selectedList) return;

    const fetchTasks = async () => {
      try {
        const res = await getTasks(selectedList._id);
        setTasks(res.data.data || []);
      } catch (error) {
        toast.error("Failed to fetch tasks");
      }
    };

    fetchTasks();
  }, [selectedList]);

  const handleAdd = async () => {
    if (!newTaskTitle.trim()) return toast.error("Task title cannot be empty");
    try {
      const res = await createTask(selectedList._id, newTaskTitle);
      setTasks([...tasks, res.data.data]);
      setNewTaskTitle("");
      toast.success("Task added!");
    } catch (error) {
      toast.error("Failed to add task");
    }
  };

  const handleUpdate = async (id, title) => {
    try {
      await updateTask(id, title);
      setTasks(tasks.map(t => (t._id === id ? { ...t, title } : t)));
      toast.success("Task updated!");
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(id);
      setTasks(tasks.filter(t => t._id !== id));
      toast.success("Task deleted!");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  if (!selectedList) return <p className="empty-text">Select a list to view tasks</p>;

  return (
    <div className="section-container">
      <h2 className="section-title">Tasks for "{selectedList.title}"</h2>
      <input
        type="text"
        className="input-box"
        placeholder="New task..."
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
      />
      <button className="add-btn" onClick={handleAdd}>Add Task</button>

      {tasks.length === 0 && <p className="empty-text">No tasks yet</p>}

      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default TaskSection;

