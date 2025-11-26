import React, { useState } from 'react';

export default function TaskForm({ onSave, initial = {} }) {
  const [title, setTitle] = useState(initial.title || '');
  const [description, setDescription] = useState(initial.description || '');

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('Task title required');
    onSave({ title: title.trim(), description: description.trim() });
    setTitle(''); setDescription('');
  };

  return (
    <form onSubmit={submit} style={{display:'flex', flexDirection:'column', gap:8}}>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Task title" style={{padding:8, borderRadius:6, border:'1px solid #ddd'}} />
      <input value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" style={{padding:8, borderRadius:6, border:'1px solid #ddd'}} />
      <div style={{display:'flex', justifyContent:'flex-end'}}>
        <button type="submit" style={{padding:'8px 12px', background:'#10b981', color:'#fff', border:'none', borderRadius:6}}>Add Task</button>
      </div>
    </form>
  );
}
