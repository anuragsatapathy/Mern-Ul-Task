import api from "./api";

export const getLists = async () => {
  return await api.get("/lists");
};

export const createList = async (title) => {
  return await api.post("/lists", { title });
};

export const updateList = async (id, title) => {
  return await api.put(`/lists/${id}`, { title });
};

export const deleteList = async (id) => {
  return await api.delete(`/lists/${id}`);
};
