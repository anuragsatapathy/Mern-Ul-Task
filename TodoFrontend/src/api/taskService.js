import api from "./api";

export const getTasks = async (listId) => {
  return await api.get(`/tasks/${listId}`);
};

export const createTask = async (listId, title) => {
  return await api.post("/tasks", { listId, title });
};

export const updateTask = async (id, title) => {
  return await api.put(`/tasks/${id}`, { title });
};

export const deleteTask = async (id) => {
  return await api.delete(`/tasks/${id}`);
};
