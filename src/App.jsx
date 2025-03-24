import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "./index.css";
import About from "./pages/About";
import DeadlockAvoidanceSimulator from "./pages/DEADLOCK/Avoidance";
import DeadlockDetectionSimulator from "./pages/DEADLOCK/Detection";
import AvoidanceSimulator from "./pages/DEADLOCK/avoid";
import DeadlockHomepage from "./pages/DEADLOCK/deadlockhome";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/avoidance" element={<DeadlockAvoidanceSimulator/>} />
        <Route path="/detection" element={<DeadlockDetectionSimulator/>} />
        <Route path="/avoid" element={<AvoidanceSimulator/>} />
        <Route path="/deadlockhome" element={<DeadlockHomepage />} />
      </Routes>
    </Router>
  );
};

export default App;
