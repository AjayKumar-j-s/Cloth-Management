import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import AddClient from "./pages/AddClient";
import UpdateClient from "./pages/UpdateClient";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/addclient" element={<AddClient />} />
        <Route path="/updateclient/:id" element={<UpdateClient />} />
      </Routes>
    </div>
  );
}

export default App;