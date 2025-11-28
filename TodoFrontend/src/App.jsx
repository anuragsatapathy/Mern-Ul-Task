import React, { useState } from "react";
import ListSection from "./components/ListSection";
import TaskSection from "./components/TaskSection";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const App = () => {
  const [selectedList, setSelectedList] = useState(null);

  return (
    <div>
      {/* Header */}
      <header className="app-header">
        <h1>📝 TodoApp</h1>
      </header>

      {/* Main container */}
      <div className="app-container">
        <div className="left-section">
          <ListSection onSelectList={setSelectedList} />
        </div>
        <div className="right-section">
          <TaskSection selectedList={selectedList} />
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={1500} />
    </div>
  );
};

export default App;


