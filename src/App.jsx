import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "./index.css";
import About from "./pages/About";
import ProcessSystemCalls from "./pages/ProcessSysCalls";
import SystemCallsReference from "./pages/SysCallsGuide";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/about" element={<About />} />
        <Route path="/process" element={<ProcessSystemCalls />} />
        <Route path="/syscalls" element={<SystemCallsReference />} />
      </Routes>
    </Router>
  );
};

export default App;
