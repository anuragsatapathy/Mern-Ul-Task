import React, { useEffect, useState } from 'react';
import api from '../api/api';
import ListForm from './ListForm';
import { toast } from 'react-toastify';
import ConfirmModal from './ConfirmModal';
import { formatDate } from '../utils/formatDate';

export default function ListPanel({ onSelectList, selectedListId }) {
  const [lists, setLists] = useState([]);
  const [editing, setEditing] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const fetchLists = async () => {
    try {
      const res = await api.get('/lists');
      console.log('frontend connected',res);
      setLists(res.data.data || []); 
    } catch (err) {
      console.error(err);
      toast.error('Failed to load lists');
    }
  };

  useEffect(() => { fetchLists(); }, []);

  const create = async (payload) => {
    try {
      const res = await api.post('/lists', payload);
      setLists(prev => [res.data.data, ...prev]);
      toast.success('List created');
    } catch (err) {
      console.error(err);
      toast.error('Create failed');
    }
  };

  const saveEdit = async (payload) => {
    try {
      const res = await api.put(`/lists/${editing._id}`, payload);
      setLists(prev => prev.map(l => l._id === res.data.data._id ? res.data.data : l));
      setEditing(null);
      toast.success('List updated');
    } catch (err) {
      console.error(err);
      toast.error('Update failed');
    }
  };

  const confirmDelete = (list) => { setToDelete(list); setConfirmOpen(true); };

  const doDelete = async () => {
    try {
      await api.delete(`/lists/${toDelete._id}`);
      setConfirmOpen(false);
      toast.success('List deleted');
      fetchLists();
      if (selectedListId === toDelete._id) onSelectList(null);
    } catch (err) {
      console.error(err);
      toast.error('Delete failed');
    }
  };

  return (
    <div style={{ padding: 16, background: '#fff', borderRadius: 8 }}>
      <h2>Lists</h2>
      <ListForm onSave={create} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '60vh', overflowY: 'auto' }}>
        {lists.map(list => (
          <div key={list._id} style={{
            padding: 12,
            border: '1px solid #eee',
            borderRadius: 8,
            background: selectedListId === list._id ? '#f0f9ff' : '#fff',
            display: 'flex', justifyContent: 'space-between'
          }}>
            <div onClick={() => onSelectList(list)} style={{ cursor: 'pointer' }}>
              <strong>{list.title}</strong>
              <div>{list.description}</div>
              <div style={{ fontSize: 12, color: '#999' }}>Created: {formatDate(list.createdAt)}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button onClick={() => setEditing(list)}>Edit</button>
              <button onClick={() => confirmDelete(list)} style={{ color: '#b91c1c' }}>Delete</button>
            </div>

            {editing && editing._id === list._id && (
              <div style={{ marginTop: 8 }}>
                <ListForm initial={editing} onSave={saveEdit} />
                <button onClick={() => setEditing(null)}>Cancel</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Delete list?"
        message="Deleting this list will remove all tasks under it."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={doDelete}
      />
    </div>
  );
}
