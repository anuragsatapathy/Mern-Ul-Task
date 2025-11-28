import React, { useState } from "react";
import ListPanel from "./components/ListPanel";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [selectedList, setSelectedList] = useState(null);

  return (
    <div style={{ padding: 24, minHeight: "100vh", background: "#f1f5f9" }}>
      <ListPanel
        onSelectList={(list) => setSelectedList(list)}
        selectedListId={selectedList?._id}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;

