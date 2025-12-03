// components/ListSection.jsx
import React, { useEffect, useState } from "react";
import ListItem from "./ListItem";
import ConfirmDialog from "./ConfirmDialog";
import { getLists, createList, deleteList } from "../api/listService";
import { toast } from "react-toastify";

const ListSection = ({ selectedList, onSelectList }) => {
  const [lists, setLists] = useState([]);
  const [newList, setNewList] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch lists (NO auto-select)
  const fetchLists = async () => {
    setLoading(true);
    try {
      const data = await getLists();
      setLists(data || []);
      // ❌ NO auto select here
    } catch (err) {
      console.error("Error fetching lists:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  // Create list (NO auto-select)
  const addList = async () => {
    if (!newList.trim()) return toast.warn("Please enter a list name");

    try {
      const created = await createList({ title: newList.trim() });

      if (created) {
        toast.success("List created");
        setLists((prev) => [...prev, created]);
        setNewList("");

        // ❌ Do NOT select newly created list
      } else {
        toast.error("Failed to create list");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error creating list");
    }
  };

  // Confirm delete
  const confirmDelete = (id) => {
    setListToDelete(id);
    setShowDialog(true);
  };

  // Delete list
  const handleDelete = async () => {
    try {
      await deleteList(listToDelete);
      toast.success("List deleted");
      setShowDialog(false);
      setListToDelete(null);

      await fetchLists();

      // ❌ Do NOT auto-select after delete
      if (selectedList && selectedList._id === listToDelete) {
        onSelectList(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting list");
      setShowDialog(false);
      setListToDelete(null);
    }
  };

  // Update list name
  const handleUpdated = (updatedList) => {
    setLists((prev) =>
      prev.map((l) => (l._id === updatedList._id ? updatedList : l))
    );

    if (selectedList && selectedList._id === updatedList._id) {
      onSelectList(updatedList);
    }
  };

  return (
    <div className="list-section">
      <h2>My Lists</h2>

      {loading ? (
        <div style={{ padding: 12 }}>Loading...</div>
      ) : lists.length === 0 ? (
        <div style={{ padding: 12, color: "#666" }}>
          <div style={{ marginBottom: 16, fontSize: 16 }}>Please add list</div>
        </div>
      ) : (
        lists.map((list) => (
          <div key={list._id} className="list-item-container" style={{ marginBottom: 6 }}>
            <ListItem
              list={list}
              selectedList={selectedList}
              onSelectList={onSelectList}
              onDelete={confirmDelete}
              onUpdated={handleUpdated}
            />
          </div>
        ))
      )}

      {/* NEW LIST */}
      <div className="new-list" style={{ marginTop: 12 }}>
        <input
          placeholder="New list..."
          value={newList}
          onChange={(e) => setNewList(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addList()}
        />
        <button onClick={addList}>+</button>
      </div>

      {/* DELETE CONFIRMATION */}
      <ConfirmDialog
        show={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={handleDelete}
        title="Delete list"
        text="Delete this list permanently?"
        confirmLabel="Delete"
      />
    </div>
  );
};

export default ListSection;
























