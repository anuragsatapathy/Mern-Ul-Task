import React, { useState } from 'react';
import ListPanel from './components/ListPanel';
import TaskPanel from './components/TaskPanel';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [selectedList, setSelectedList] = useState(null);

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: 24 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
        <ListPanel onSelectList={(list) => setSelectedList(list)} selectedListId={selectedList?._id} />
        <TaskPanel list={selectedList} />
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;

