import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import SingleVariable from './components/SingleVariable';
import MultiVariable from './components/MultiVariable';
import ProblemPage from './components/ProblemPage';
import SingleVariableProblemPage from './components/SingleVariableProblemPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/single-variable" element={<SingleVariable />} />
        <Route path="/multi-variable" element={<MultiVariable />} />
        <Route path="/problem/:id" element={<ProblemPage />} />
        <Route path="/single-problem/:id" element={<SingleVariableProblemPage />} />
      </Routes>
    </Router>
  );
}

export default App;