// src/api/taskService.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/tasks`
  : "http://localhost:5000/api/tasks";

export const getTasks = async (listId) => {
  try {
    const res = await axios.get(`${API_URL}?listId=${listId}`);
    return res.data?.data || [];
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return [];
  }
};

export const createTask = async (listId, task) => {
  try {
    const payload = {
      ...task,
      listId, // REQUIRED BY BACKEND VALIDATION
    };

    const res = await axios.post(`${API_URL}/${listId}`, payload);
    return res.data?.data || null;
  } catch (err) {
    console.error("Error creating task:", err.response?.data || err.message);
    return null;
  }
};

export const updateTask = async (taskId, updated) => {
  try {
    const res = await axios.put(`${API_URL}/${taskId}`, updated);
    return res.data?.data || null;
  } catch (err) {
    console.error("Error updating task:", err);
    return null;
  }
};

export const deleteTask = async (taskId) => {
  try {
    const res = await axios.delete(`${API_URL}/${taskId}`);
    return res.data?.data || null;
  } catch (err) {
    console.error("Error deleting task:", err);
    return null;
  }
};







