import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "./index.css";
import About from "./pages/About";
import MemoryAllocationHomepage from "./pages/contigeousmemoryallocation/home";
import FirstFitDynamic from "./pages/contigeousmemoryallocation/first"; // Import the simulation component


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/home" element={<MemoryAllocationHomepage />} />
        
        {/* Memory Allocation Algorithm Routes */}
        <Route path="/memory-allocation/first-fit" element={<FirstFitDynamic initialStrategy="first" />} />
        <Route path="/memory-allocation/best-fit" element={<FirstFitDynamic initialStrategy="best" />} />
        <Route path="/memory-allocation/worst-fit" element={<FirstFitDynamic initialStrategy="worst" />} />
        <Route path="/memory-allocation/next-fit" element={<FirstFitDynamic initialStrategy="next" />} />
        <Route path="/memory-allocation/quick-fit" element={<FirstFitDynamic initialStrategy="quick" />} />
        <Route path="/memory-allocation/buddy-fit" element={<FirstFitDynamic initialStrategy="buddyfit" />} />
      </Routes>
    </Router>
  );
};

export default App;