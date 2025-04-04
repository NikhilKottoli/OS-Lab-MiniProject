import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "./index.css";
import About from "./pages/About";
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
