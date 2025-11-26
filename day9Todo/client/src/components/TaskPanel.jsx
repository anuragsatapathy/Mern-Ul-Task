import React, { useEffect, useState, useCallback } from 'react';
import api from '../api/api';
import TaskForm from './TaskForm';
import { toast } from 'react-toastify';
import { formatDate } from '../utils/formatDate';

export default function TaskPanel({ list }) {
  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(null);

  // Fetch tasks for the selected list
  const fetchTasks = useCallback(async () => {
    if (!list) return setTasks([]);
    try {
      const res = await api.get(`/tasks?listId=${list._id}`);
      setTasks(res.data); // assumes backend returns array of tasks
    } catch (err) {
      toast.error('Failed to load tasks');
    }
  }, [list]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create new task
  const create = async (payload) => {
    try {
      const res = await api.post('/tasks', { ...payload, listId: list._id });
      toast.success('Task created');
      setTasks((prev) => [res.data, ...prev]);
    } catch (err) {
      toast.error('Create failed');
    }
  };

  // Save edited task
  const saveEdit = async (payload) => {
    try {
      const res = await api.put(`/tasks/${editing._id}`, payload);
      setTasks((prev) => prev.map((t) => (t._id === res.data._id ? res.data : t)));
      setEditing(null);
      toast.success('Task updated');
    } catch (err) {
      toast.error('Update failed');
    }
  };

  // Delete a task
  const doDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success('Task deleted');
      fetchTasks();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  if (!list)
    return (
      <div style={{ padding: 16 }}>
        Select a list to view tasks
      </div>
    );

  return (
    <div style={{ padding: 16, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <h2 style={{ marginTop: 0 }}>{list.title} - Tasks</h2>
      <div style={{ marginBottom: 12 }}>
        <TaskForm onSave={create} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '60vh', overflow: 'auto' }}>
        {tasks.map((task) => (
          <div
            key={task._id}
            style={{
              padding: 12,
              borderRadius: 8,
              border: '1px solid #eee',
              background: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{task.title}</div>
              <div style={{ fontSize: 13, color: '#555' }}>{task.description}</div>
              <div style={{ fontSize: 12, color: '#999' }}>Created: {formatDate(task.createdAt)}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button onClick={() => setEditing(task)} style={{ padding: '6px 8px' }}>
                Edit
              </button>
              <button onClick={() => doDelete(task._id)} style={{ padding: '6px 8px', color: '#b91c1c' }}>
                Delete
              </button>
            </div>

            {editing && editing._id === task._id && (
              <div style={{ marginTop: 8, width: '100%' }}>
                <TaskForm initial={editing} onSave={saveEdit} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                  <button onClick={() => setEditing(null)} style={{ padding: '6px 10px' }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
