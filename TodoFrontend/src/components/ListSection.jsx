import React, { useState, useEffect } from "react";
import { getLists, createList, updateList, deleteList } from "../api/listService";
import ListItem from "./ListItem";
import { toast } from "react-toastify";

const ListSection = ({ onSelectList }) => {
  const [lists, setLists] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const res = await getLists();
        setLists(res.data.data || []);
      } catch (error) {
        toast.error("Failed to fetch lists");
      }
    };

    fetchLists();
  }, []);

  const handleAdd = async () => {
    if (!newTitle.trim()) return toast.error("Title cannot be empty");
    try {
      const res = await createList(newTitle);
      setLists([...lists, res.data.data]);
      setNewTitle("");
      toast.success("List added!");
    } catch (error) {
      toast.error("Failed to add list");
    }
  };

  const handleUpdate = async (id, title) => {
    try {
      await updateList(id, title);
      setLists(lists.map(l => (l._id === id ? { ...l, title } : l)));
      toast.success("List updated!");
    } catch (error) {
      toast.error("Failed to update list");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this list?")) return;
    try {
      await deleteList(id);
      setLists(lists.filter(l => l._id !== id));
      toast.success("List deleted!");
    } catch (error) {
      toast.error("Failed to delete list");
    }
  };

  return (
    <div className="section-container">
      <h2 className="section-title">Lists</h2>
      <input
        type="text"
        className="input-box"
        placeholder="New list..."
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />
      <button className="add-btn" onClick={handleAdd}>Add List</button>

      {lists.length === 0 && <p className="empty-text">No lists yet</p>}

      {lists.map((list) => (
        <ListItem
          key={list._id}
          list={list}
          onSelect={onSelectList}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default ListSection;


