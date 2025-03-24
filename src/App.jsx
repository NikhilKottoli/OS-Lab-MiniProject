import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "./index.css";
import About from "./pages/About";
import MVT from "./pages/Memory_Management/Mvt";
import MFT from "./pages/Memory_Management/Mft";
import MemoryAllocationHome from "./pages/Memory_Management/MemoryHome";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/mvt" element={<MVT />} />
        <Route path="/mft" element={<MFT />} />
        <Route path="/memoryhome" element={<MemoryAllocationHome />} />
      </Routes>
    </Router>
  );
};

export default App;