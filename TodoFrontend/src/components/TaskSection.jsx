import React, { useEffect, useState } from "react";
import TaskItem from "./TaskItem";
import ConfirmDialog from "./ConfirmDialog";
import { getTasks, createTask, deleteTask } from "../api/taskService";
import { toast } from "react-toastify";

const TaskSection = ({ selectedList }) => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [sortType, setSortType] = useState("newest");

  const [showDialog, setShowDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const fetchTasks = async () => {
    if (!selectedList) return;
    const data = await getTasks(selectedList._id);
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedList]);

  const addTask = async () => {
    if (!taskName.trim()) return toast.warn("Task title required");

    const created = await createTask(selectedList._id, {
      title: taskName.trim(),
      dueDate: dueDate || null,
    });

    if (!created) return toast.error("Failed to add task");

    toast.success("Task added");
    setTasks((prev) => [...prev, created]);
    setTaskName("");
    setDueDate("");
  };

  const confirmDelete = (id) => {
    setTaskToDelete(id);
    setShowDialog(true);
  };

  const handleDelete = async () => {
    await deleteTask(taskToDelete);
    toast.success("Task deleted");
    setShowDialog(false);
    fetchTasks();
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortType === "az") return a.title.localeCompare(b.title);
    if (sortType === "date")
      return (a.dueDate ? new Date(a.dueDate) : Infinity) -
             (b.dueDate ? new Date(b.dueDate) : Infinity);

    if (sortType === "current") {
      const today = new Date();
      const da = a.dueDate ? Math.abs(today - new Date(a.dueDate)) : Infinity;
      const db = b.dueDate ? Math.abs(today - new Date(b.dueDate)) : Infinity;
      return da - db;
    }

    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (!selectedList) return <h3>Select a list</h3>;

  return (
    <div>
      <div className="task-header">
        <h2>{selectedList.title}</h2>

        <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="az">A - Z</option>
          <option value="date">Due Date</option>
          <option value="current">Current</option>
        </select>
      </div>

      <div className="add-task">
        <input
          className="add-task-title"
          placeholder="Add task"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />

        <input
          className="add-task-date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <button className="add-task-btn" onClick={addTask}>Add</button>
      </div>

      {sortedTasks.map((task) => (
        <TaskItem key={task._id} task={task} onDelete={confirmDelete} refresh={fetchTasks} />
      ))}

      <ConfirmDialog
        show={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={handleDelete}
        text="Delete this task permanently?"
      />
    </div>
  );
};

export default TaskSection;




















