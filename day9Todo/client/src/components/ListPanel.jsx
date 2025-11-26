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
      setLists(res.data.data || []); // <- use res.data.data
    } catch (err) {
      console.error(err);
      toast.error('Failed to load lists');
    }
  };

  useEffect(() => { fetchLists(); }, []);

  const create = async (payload) => {
    try {
      const res = await api.post('/lists', payload);
      toast.success('List created');
      setLists(prev => [res.data.data, ...prev]); // <- use res.data.data
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
    <div style={{ padding: 16, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <h2 style={{ marginTop: 0 }}>Lists</h2>
      <div style={{ marginBottom: 12 }}>
        <ListForm onSave={create} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '60vh', overflow: 'auto' }}>
        {lists.map((list) => (
          <div
            key={list._id}
            style={{
              padding: 12,
              borderRadius: 8,
              border: '1px solid #eee',
              background: selectedListId === list._id ? '#f0f9ff' : '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <div style={{ cursor: 'pointer' }} onClick={() => onSelectList(list)}>
              <div style={{ fontWeight: 600 }}>{list.title}</div>
              <div style={{ fontSize: 13, color: '#555' }}>{list.description}</div>
              <div style={{ fontSize: 12, color: '#999' }}>Created: {formatDate(list.createdAt)}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button onClick={() => setEditing(list)} style={{ padding: '6px 8px' }}>Edit</button>
              <button onClick={() => confirmDelete(list)} style={{ padding: '6px 8px', color: '#b91c1c' }}>Delete</button>
            </div>

            {editing && editing._id === list._id && (
              <div style={{ marginTop: 8, width: '100%' }}>
                <ListForm initial={editing} onSave={saveEdit} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                  <button onClick={() => setEditing(null)} style={{ padding: '6px 10px' }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Delete list?"
        message="Deleting this list will remove all tasks under it. Continue?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={doDelete}
      />
    </div>
  );
}
