import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { runSingleVariableOptimization } from '../utils/optimizer';
import '../styles/styles.css';

const problemData = {
  1: { name: 'Maximize (2x-5)⁴ - (x²-1)³', equation: 'f(x) = (2x-5)⁴ - (x²-1)³', interval: '(-10, 0)', type: 'max', image: '/images/sv_problem1.png' },
  2: { name: 'Maximize 8 + x³ - 2x - 2eˣ', equation: 'f(x) = 8 + x³ - 2x - 2eˣ', interval: '(-2, 1)', type: 'max', image: '/images/sv_problem2.png' },
  3: { name: 'Maximize 4x * sin(x)', equation: 'f(x) = 4x * sin(x)', interval: '(0.5, π)', type: 'max', image: '/images/sv_problem3.png' },
  4: { name: 'Minimize 2(x-3)² + e⁰·⁵ˣ²', equation: 'f(x) = 2(x-3)² + e⁰·⁵ˣ²', interval: '(-2, 3)', type: 'min', image: '/images/sv_problem4.png' },
  5: { name: 'Minimize x² - 10e⁰·¹ˣ', equation: 'f(x) = x² - 10e⁰·¹ˣ', interval: '(-6, 6)', type: 'min', image: '/images/sv_problem5.png' },
  6: { name: 'Maximize 20sin(x) - 15x²', equation: 'f(x) = 20sin(x) - 15x²', interval: '(-4, 4)', type: 'max', image: '/images/sv_problem6.png' },
};

function SingleVariableProblemPage() {
    const { id } = useParams();
    const problem = problemData[id];
    const defaultStartPoints = { 1: -1, 2: 0, 3: 2, 4: 0, 5: 0, 6: 0 };

    const [startPoint, setStartPoint] = useState(0);
    const [delta, setDelta] = useState(0.1);
    const [epsilon, setEpsilon] = useState(1e-6);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (id) {
            setStartPoint(defaultStartPoints[id] || 0);
            setResult(null);
        }
    }, [id]);

    const handleRun = () => {
        setIsLoading(true);
        // Using a timeout to simulate calculation and improve UX
        setTimeout(() => {
            const output = runSingleVariableOptimization(Number(id), startPoint, delta, epsilon);
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
                 <p className="note">Recommended Interval: {problem.interval}</p>
                <div className="problem-layout">
                    <div className="problem-media">
                        <img src={problem.image} alt={problem.name} onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                    <div className="problem-solver">
                        <div className="input-group">
                            <label>Starting Point (x₀)</label>
                            <input type="number" value={startPoint} onChange={(e) => setStartPoint(Number(e.target.value))} />
                        </div>
                        <div className="input-group">
                            <label>Delta (δ) for Bounding Phase</label>
                            <input type="number" value={delta} step="0.01" onChange={(e) => setDelta(Number(e.target.value))} />
                        </div>
                        <div className="input-group">
                            <label>Epsilon (ε) Tolerance</label>
                            <input type="number" value={epsilon} step="1e-7" onChange={(e) => setEpsilon(Number(e.target.value))} />
                        </div>
                        <button onClick={handleRun} className="solve-button" disabled={isLoading}>
                            {isLoading ? 'Optimizing...' : 'Run Optimization'}
                        </button>
                        {result && (
                            <div className="result-box">
                                <h3>Results</h3>
                                <p><strong>Optimal X:</strong> {result.optimalX.toFixed(6)}</p>
                                <p><strong>Optimal F(x):</strong> {result.optimalValue.toFixed(6)}</p>
                                <p><strong>Final Interval:</strong> [{result.finalInterval[0].toFixed(4)}, {result.finalInterval[1].toFixed(4)}]</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SingleVariableProblemPage;

