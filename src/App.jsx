import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "./index.css";
import About from "./pages/About";
import PageReplacementModule from "./pages/pagereplacement/pagereplacement";
import PageReplacementTheory from "./pages/pagereplacement/pagereplacementtheory";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/page" element={<PageReplacementModule />} />
        <Route path="/theory" element={<PageReplacementTheory />} />
        <Route path="/page-replacement/simulation" element={<PageReplacementModule />} />

      </Routes>
    </Router>
  );
};

export default App;