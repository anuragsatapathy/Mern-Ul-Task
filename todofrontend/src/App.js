import React from "react";
import TodoPage from "./pages/TodoPage";
import './App.css';  


function App() {
  return (
    <React.StrictMode>
      <React.Suspense fallback={<div>Loading...</div>}>
        <TodoPage />
      </React.Suspense>
    </React.StrictMode>
  );
}

export default App;


