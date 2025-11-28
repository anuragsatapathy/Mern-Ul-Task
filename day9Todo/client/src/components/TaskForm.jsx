import React, { useState, useEffect } from 'react';

export default function ListForm({ onSave, initial }) {
  const safeInitial = initial || {}; // avoid null

  const [title, setTitle] = useState(safeInitial.title || '');
  const [description, setDescription] = useState(safeInitial.description || '');

  useEffect(() => {
    setTitle(safeInitial.title || '');
    setDescription(safeInitial.description || '');
  }, [safeInitial.title, safeInitial.description]);

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('Title required');
    onSave({ title: title.trim(), description: description.trim() });
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="List title"
        style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
      />
      <input
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Description"
        style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
      />
      <button
        type="submit"
        style={{ marginTop: 8, padding: '8px 12px', background: '#0ea5e9', color: '#fff', border: 'none', borderRadius: 6 }}
      >
        Save
      </button>
    </form>
  );
}

