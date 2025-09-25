import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import MultiVariable from './components/MultiVariable';
import ProblemPage from './components/ProblemPage';
import DesmosOptimizerPage from './components/DesmosOptimizerPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/single-variable-optimizer" element={<DesmosOptimizerPage />} />
        <Route path="/multi-variable" element={<MultiVariable />} />
        <Route path="/problem/:id" element={<ProblemPage />} />
      </Routes>
    </Router>
  );
}

export default App;