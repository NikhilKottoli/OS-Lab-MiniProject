import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "./index.css";
import About from "./pages/About";
import MVT from "./pages/Memory_Management/Mvt";
import MFT from "./pages/Memory_Management/Mft";
import MemoryAllocationHome from "./pages/Memory_Management/MemoryHome";
import DeadlockAvoidanceSimulator from "./pages/DEADLOCK/Avoidance";
import DeadlockDetectionSimulator from "./pages/DEADLOCK/Detection";
import DeadlockHomepage from "./pages/DEADLOCK/deadlockhome";
import ProcessSystemCalls from "./pages/ProcessSysCalls";
import SystemCallsReference from "./pages/SysCallsGuide";
import Navbar from "./pages/components/Navbar";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/mvt" element={<MVT />} />
        <Route path="/mft" element={<MFT />} />
        <Route path="/memoryhome" element={<MemoryAllocationHome />} />
        <Route path="/" element={<About />} />
        <Route path="/avoidance" element={<DeadlockAvoidanceSimulator/>} />
        <Route path="/detection" element={<DeadlockDetectionSimulator/>} />
        <Route path="/deadlockhome" element={<DeadlockHomepage />} />
        <Route path="/process" element={<ProcessSystemCalls />} />
        <Route path="/syscalls" element={<SystemCallsReference />} />
      </Routes>
    </Router>
  );
};
export default App;

