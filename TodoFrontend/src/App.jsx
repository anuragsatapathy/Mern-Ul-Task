import React, { useState } from "react";
import ListSection from "./components/ListSection";
import TaskSection from "./components/TaskSection";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const App = () => {
  const [selectedList, setSelectedList] = useState(null);

  return (
    <div className="app-container">
      <ToastContainer position="top-right" autoClose={1500} />

      <header className="app-header">
        <h1>📝 TodoList App</h1>
      </header>

      <div className="main-layout">
        <div className="list-panel">
          <ListSection
            selectedList={selectedList}
            onSelectList={setSelectedList}
          />
        </div>

        <div className="task-panel">
          {selectedList ? (
            <TaskSection selectedList={selectedList} />
          ) : (
            <div className="empty-state">
              <h2>Select a list to view tasks</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;










