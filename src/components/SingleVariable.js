import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';

const problems = [
  { id: 1, name: 'Problem 1', description: 'Maximize (2x-5)⁴ - (x²-1)³' },
  { id: 2, name: 'Problem 2', description: 'Maximize 8 + x³ - 2x - 2eˣ' },
  { id: 3, name: 'Problem 3', description: 'Maximize 4x * sin(x)' },
  { id: 4, name: 'Problem 4', description: 'Minimize 2(x-3)² + e⁰·⁵ˣ²' },
  { id: 5, name: 'Problem 5', description: 'Minimize x² - 10e⁰·¹ˣ' },
  { id: 6, name: 'Problem 6', description: 'Maximize 20sin(x) - 15x²' },
];

function SingleVariable() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="background-shapes"></div>
      <div className="content">
        <h2 className="page-title">Single Variable Optimization</h2>
        <div className="problem-list">
          {problems.map((problem) => (
            <div key={problem.id} className="problem-card" onClick={() => navigate(`/single-problem/${problem.id}`)}>
              <h3>{problem.name}</h3>
              <p>{problem.description}</p>
            </div>
          ))}
        </div>
        <p className="note">*Ensure the function is convex in the given range for minimization problems.</p>
      </div>
    </div>
  );
}

export default SingleVariable;

