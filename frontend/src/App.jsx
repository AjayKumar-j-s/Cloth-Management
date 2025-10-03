import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import AddClient from "./pages/AddClient";
import UpdateClient from "./pages/UpdateClient";

function App() {
  return (
    <div className="min-h-screen relative bg-gradient-to-b from-cyber-navy1 via-cyber-navy2 to-cyber-navy3">
      <div className="absolute inset-0 cyber-grid opacity-40 pointer-events-none" />
      <div className="sticky top-0 z-20 backdrop-blur bg-slate-900/50 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-cyan-300 drop-shadow-neon">Cloth Shop</h1>
          <div className="flex items-center gap-3">
          
          </div>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/addclient" element={<AddClient />} />
        <Route path="/updateclient/:id" element={<UpdateClient />} />
      </Routes>
    </div>
  );
}

export default App;