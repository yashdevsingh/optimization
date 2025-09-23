import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';

const problems = [
  { id: 1, name: 'Problem 1', description: 'Sum Squares Function' },
  { id: 2, name: 'Problem 2', description: 'Rosenbrock Function' },
  { id: 3, name: 'Problem 3', description: 'Dixon Price Function' },
  { id: 4, name: 'Problem 4', description: 'Trid Function' },
  { id: 5, name: 'Problem 5', description: 'Zakharov Function' },
];

function MultiVariable() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
       <div className="background-shapes"></div>
      <div className="content">
        <h2 className="page-title">Multi Variable Optimization</h2>
        <div className="problem-list">
          {problems.map((problem) => (
            <div key={problem.id} className="problem-card" onClick={() => navigate(`/problem/${problem.id}`)}>
              <h3>{problem.name}</h3>
              <p>{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MultiVariable;
