// api/listService.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/lists` : "http://localhost:5000/api/lists";

export const getLists = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data?.data || [];
  } catch (error) {
    console.error("Error fetching lists:", error);
    return [];
  }
};

export const createList = async (list) => {
  try {
    const res = await axios.post(API_URL, list);
    return res.data?.data || null;
  } catch (error) {
    console.error("Error creating list:", error.response?.data || error.message);
    return null;
  }
};

export const updateList = async (id, updated) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, updated);
    return res.data?.data || null;
  } catch (error) {
    console.error("Error updating list:", error.response?.data || error.message);
    return null;
  }
};

export const deleteList = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data?.data || null;
  } catch (error) {
    console.error("Error deleting list:", error.response?.data || error.message);
    return null;
  }
};

