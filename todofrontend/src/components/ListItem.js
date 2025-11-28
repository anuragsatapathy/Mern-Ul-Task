import React, { useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";

const ListItem = ({ list, selected, onSelect, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(list.title);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this list?")) {
      try {
        await api.delete(`/list/${list._id}`);
        toast.success("List deleted");
        onDelete();
      } catch (err) {
        toast.error("Failed to delete list");
      }
    }
  };

  const handleEdit = async () => {
    if (!editTitle) return;
    try {
      await api.put(`/list/${list._id}`, { title: editTitle });
      toast.success("List updated");
      setIsEditing(false);
      onEdit();
    } catch (err) {
      toast.error("Failed to update list");
    }
  };

  return (
    <div
      className={`list-item ${selected ? "selected" : ""}`}
      onClick={onSelect}
    >
      {isEditing ? (
        <>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <button onClick={handleEdit}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <span>{list.title}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
};

export default ListItem;


