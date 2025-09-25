import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { runOptimization } from '../utils/optimizer';
import '../styles/styles.css';

const problemData = {
  1: { name: 'Sum Squares Function', equation: 'f(x) = ∑ᵢ (i * xᵢ²)', image: '/images/sum_squares.png' },
  2: { name: 'Rosenbrock Function', equation: 'f(x) = ∑ᵢ [100(xᵢ₊₁ - xᵢ²)² + (xᵢ - 1)²]', image: '/images/rosenbrock.png' },
  3: { name: 'Dixon Price Function', equation: 'f(x) = (x₁ - 1)² + ∑ᵢ i(2xᵢ² - xᵢ₋₁)²', image: '/images/dixon_price.png' },
  4: { name: 'Trid Function', equation: 'f(x) = ∑ᵢ (xᵢ - 1)² - ∑ᵢ xᵢxᵢ₋₁', image: '/images/trid.png' },
  5: { name: 'Zakharov Function', equation: 'f(x) = ∑ᵢ xᵢ² + (∑ᵢ 0.5ixᵢ)² + (∑ᵢ 0.5ixᵢ)⁴', image: '/images/zakharov.png' },
};

function ProblemPage() {
  const { id } = useParams();
  const problem = problemData[id];
  const [dimension, setDimension] = useState(3);
  const [startPoint, setStartPoint] = useState('0,0,0');
  const [maxIter, setMaxIter] = useState(100);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setStartPoint(new Array(dimension).fill(0).join(','));
  }, [dimension]);

  const handleRun = () => {
    const x0 = startPoint.split(',').map(Number);
    if (x0.length !== dimension || x0.some(isNaN)) {
      alert(`Starting point must have ${dimension} valid numbers.`);
      return;
    }
    setIsLoading(true);
    // Simulate async operation for better UX
    setTimeout(() => {
      const output = runOptimization(Number(id), dimension, x0, maxIter);
      setResult(output);
      setIsLoading(false);
    }, 500);
  };

  if (!problem) {
    return <div className="page-container"><div className="content"><h2>Problem not found!</h2></div></div>;
  }

  return (
    <div className="page-container problem-detail-page">
       <div className="background-shapes"></div>
      <div className="content">
        <h2 className="page-title">{problem.name}</h2>
        <p className="equation">{problem.equation}</p>
        <div className="problem-layout">
          <div className="problem-media">
            <img src={problem.image} alt={problem.name} onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
          <div className="problem-solver">
            <div className="input-group">
              <label>Number of Variables (d)</label>
              <input type="number" value={dimension} onChange={(e) => setDimension(Math.max(2, Number(e.target.value)))} />
            </div>
            <div className="input-group">
              <label>Starting Point (comma-separated)</label>
              <input type="text" value={startPoint} onChange={(e) => setStartPoint(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Max Iterations</label>
              <input type="number" value={maxIter} onChange={(e) => setMaxIter(Number(e.target.value))} />
            </div>
            <button onClick={handleRun} className="solve-button" disabled={isLoading}>
              {isLoading ? 'Optimizing...' : 'Run Optimization'}
            </button>
            {result && (
              <div className="result-box">
                <h3>Results</h3>
                <p><strong>Final Point:</strong> [{result.finalPoint.map(v => v.toFixed(4)).join(', ')}]</p>
                <p><strong>Function Value:</strong> {result.finalValue.toExponential(4)}</p>
                <p><strong>Iterations:</strong> {result.history.length}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemPage;