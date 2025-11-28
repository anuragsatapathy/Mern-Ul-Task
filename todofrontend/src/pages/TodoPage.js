import React, { useState, useEffect } from "react";
import api from "../api/api";
import ListItem from "../components/ListItem";
import TaskItem from "../components/TaskItem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

const TodoPage = () => {
  const [lists, setLists] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [newListTitle, setNewListTitle] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const fetchLists = async () => {
    try {
      const res = await api.get("/list");
      setLists(res.data.data);
    } catch {
      toast.error("Failed to fetch lists");
    }
  };

  const fetchTasks = async (listId) => {
    if (!listId) return;
    try {
      const res = await api.get(`/task/list/${listId}`);
      setTasks(res.data.data);
    } catch {
      toast.error("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  useEffect(() => {
    fetchTasks(selectedList?._id);
  }, [selectedList]);

  const handleAddList = async () => {
    if (!newListTitle) return toast.warning("Enter a list title");
    try {
      await api.post("/list", { title: newListTitle });
      setNewListTitle("");
      fetchLists();
      toast.success("List added");
    } catch {
      toast.error("Failed to add list");
    }
  };

  const handleAddTask = async () => {
    if (!newTaskTitle || !selectedList) return toast.warning("Select list & enter task");
    try {
      await api.post("/task", { title: newTaskTitle, listId: selectedList._id });
      setNewTaskTitle("");
      fetchTasks(selectedList._id);
      toast.success("Task added");
    } catch {
      toast.error("Failed to add task");
    }
  };

  return (
    <div>
      <h1>My Todo App</h1>
      <div className="todo-container">
        <div className="list-panel">
          <h2>Lists</h2>
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <input
              type="text"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              placeholder="New list..."
            />
            <button onClick={handleAddList}>Add</button>
          </div>
          {lists.map((list) => (
            <ListItem
              key={list._id}
              list={list}
              selected={selectedList?._id === list._id}
              onSelect={() => setSelectedList(list)}
              onDelete={fetchLists}
              onEdit={fetchLists}
            />
          ))}
        </div>

        <div className="task-panel">
          <h2>Tasks</h2>
          {selectedList && (
            <div style={{ display: "flex", marginBottom: "10px" }}>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="New task..."
              />
              <button onClick={handleAddTask}>Add</button>
            </div>
          )}
          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onDelete={() => fetchTasks(selectedList._id)}
              onEdit={() => fetchTasks(selectedList._id)}
            />
          ))}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default TodoPage;


