import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../api/api";
import { confirmDialog } from "../utils/confirmDialog";

const ListForm = ({ fetchLists, editingList, setEditingList }) => {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (editingList) setTitle(editingList.title);
    else setTitle("");
  }, [editingList]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title is required");

    try {
      if (editingList) {
        const confirmed = await confirmDialog("Are you sure you want to edit this list?");
        if (!confirmed) return;

        await api.put(`/list/${editingList._id}`, { title });
        toast.success("List updated");
        setEditingList(null);
      } else {
        await api.post("/list", { title });
        toast.success("List created");
      }
      setTitle("");
      fetchLists();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="list-form">
      <input
        type="text"
        placeholder="Enter list title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit">{editingList ? "Update List" : "Add List"}</button>
    </form>
  );
};

export default ListForm;
