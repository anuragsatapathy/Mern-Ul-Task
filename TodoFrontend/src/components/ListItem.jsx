import React, { useState, useEffect } from "react";
import { updateList } from "../api/listService";
import { toast } from "react-toastify";

const ListItem = ({ list, selectedList, onSelectList, onDelete, onUpdated }) => {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(list.title);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(list.title);
  }, [list.title]);

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!title.trim() || title.trim() === list.title) {
      setEditMode(false);
      setTitle(list.title);
      return;
    }
    try {
      setSaving(true);
      const updated = await updateList(list._id, { title: title.trim() });
      if (updated) {
        toast.success("List updated");
        setEditMode(false);
        onUpdated && onUpdated(updated);
      } else {
        toast.error("Failed to update list");
      }
    } catch (err) {
      toast.error("Error updating list");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setTitle(list.title);
    setEditMode(false);
  };

  return (
    <div
      className={`list-item ${selectedList?._id === list._id ? "active" : ""}`}
      onClick={() => onSelectList(list)}
      role="button"
      tabIndex={0}
    >
      <div className="list-title-box">
        {editMode ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave(e);
              if (e.key === "Escape") handleCancel(e);
            }}
            className="list-edit-input"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span>{list.title}</span>
        )}
      </div>

      <div className="list-actions">
        {editMode ? (
          <>
            <button className="save-btn small" onClick={handleSave}>Save</button>
            <button className="cancel-btn-small small" onClick={handleCancel}>Cancel</button>
          </>
        ) : (
          <>
            <button
              className="icon-btn edit-icon"
              onClick={(e) => {
                e.stopPropagation();
                setEditMode(true);
              }}
            >
              ✏️
            </button>

            <button
              className="icon-btn delete-icon"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(list._id);
              }}
            >
              🗑️
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ListItem;






