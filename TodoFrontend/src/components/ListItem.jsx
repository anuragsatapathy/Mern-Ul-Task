import React, { useState } from "react";

const ListItem = ({ list, onUpdate, onDelete, onSelect }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(list.title);

  const handleSave = () => {
    if (!title.trim()) return;
    onUpdate(list._id, title);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(list.title);
    setIsEditing(false);
  };

  return (
    <div className="card">
      {isEditing ? (
        <div className="task-edit-container">
          <input
            type="text"
            className="input-box"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="action-buttons">
            <button className="add-btn" onClick={handleSave}>
              Save
            </button>
            <button className="icon-btn delete" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <span onClick={() => onSelect(list)}>{list.title}</span>
          <div className="action-buttons">
            <button className="icon-btn edit" onClick={() => setIsEditing(true)}>
              ✏️
            </button>
            <button className="icon-btn delete" onClick={() => onDelete(list._id)}>
              🗑️
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ListItem;

