import React, { useState, useEffect, useRef } from 'react';
import { runCustomSingleVariableOptimization } from '../utils/optimizer';
import '../styles/styles.css';

function DesmosOptimizerPage() {
    const [expression, setExpression] = useState('x^3 - 2*x - 5');
    const [intervalMin, setIntervalMin] = useState(-5);
    const [intervalMax, setIntervalMax] = useState(5);
    const [startPoint, setStartPoint] = useState(2);
    const [optimizationType, setOptimizationType] = useState('min');
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const desmosEl = useRef(null);
    const calculator = useRef(null);
    const scriptsLoaded = useRef(false);

    // Load Desmos and Math.js scripts
    useEffect(() => {
        if (scriptsLoaded.current) return;

        const desmosScript = document.createElement('script');
        desmosScript.src = 'https://www.desmos.com/api/v1.8/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6';
        desmosScript.async = true;

        const mathjsScript = document.createElement('script');
        mathjsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjs/12.4.2/math.js';
        mathjsScript.async = true;

        document.body.appendChild(desmosScript);
        document.body.appendChild(mathjsScript);

        let scriptsReady = 0;
        const checkScripts = () => {
            if (window.Desmos && window.math) {
                scriptsLoaded.current = true;
                initializeCalculator();
            } else {
                scriptsReady++;
                if (scriptsReady < 20) { // Try for 10 seconds
                    setTimeout(checkScripts, 500);
                } else {
                    setError('Failed to load external libraries. Please refresh the page.');
                }
            }
        };

        checkScripts();

        return () => {
            // Optional: cleanup scripts if component unmounts
        };
    }, []);

    const initializeCalculator = () => {
        if (desmosEl.current && !calculator.current) {
            calculator.current = window.Desmos.GraphingCalculator(desmosEl.current, {
                keypad: false,
                expressions: false,
                settingsMenu: false,
                zoomButtons: true,
            });
            updateGraph();
        }
    };

    const updateGraph = () => {
        if (calculator.current && expression) {
            try {
                // Validate expression with math.js before sending to Desmos
                window.math.parse(expression);
                calculator.current.setExpression({ id: 'graph1', latex: `y=${expression}` });
                calculator.current.setMathBounds({
                    left: intervalMin,
                    right: intervalMax,
                });
                setError('');
            } catch (e) {
                setError('Invalid function. Please check the syntax.');
            }
        }
    };
    
    // Update graph when expression or interval changes
    useEffect(() => {
        const handler = setTimeout(() => {
            if (scriptsLoaded.current) {
                updateGraph();
            }
        }, 500); // Debounce to avoid excessive updates while typing

        return () => {
            clearTimeout(handler);
        };
    }, [expression, intervalMin, intervalMax]);


    const handleRun = () => {
        setIsLoading(true);
        setResult(null);
        setError('');

        setTimeout(() => {
            try {
                const output = runCustomSingleVariableOptimization(
                    expression,
                    startPoint,
                    optimizationType
                );
                setResult(output);
                // Add point to graph
                if(calculator.current && output) {
                    calculator.current.setExpression({
                        id: 'solutionPoint',
                        latex: `(${output.optimalX}, ${output.optimalValue})`,
                        color: '#00A8E8',
                        style: 'POINT',
                        pointSize: 15
                    });
                }
            } catch (e) {
                setError(e.message || 'Failed to optimize. Check the function and parameters.');
            }
            setIsLoading(false);
        }, 500);
    };

    return (
        <div className="page-container problem-detail-page">
            <div className="content">
                <h2 className="page-title">Single Variable Optimizer</h2>
                <div className="problem-layout">
                    <div className="problem-solver">
                        <div className="input-group">
                            <label>Enter Function f(x)</label>
                            <input type="text" value={expression} onChange={(e) => setExpression(e.target.value)} placeholder="e.g., x^2 + sin(x)" />
                        </div>

                        <div className="input-group-row">
                             <div className="input-group">
                                <label>Interval Min</label>
                                <input type="number" value={intervalMin} onChange={(e) => setIntervalMin(Number(e.target.value))} />
                            </div>
                            <div className="input-group">
                                <label>Interval Max</label>
                                <input type="number" value={intervalMax} onChange={(e) => setIntervalMax(Number(e.target.value))} />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Starting Point (x₀)</label>
                            <input type="number" value={startPoint} onChange={(e) => setStartPoint(Number(e.target.value))} />
                        </div>
                        
                        <div className="input-group">
                            <label>Goal</label>
                            <select value={optimizationType} onChange={(e) => setOptimizationType(e.target.value)}>
                                <option value="min">Minimize</option>
                                <option value="max">Maximize</option>
                            </select>
                        </div>

                        <button onClick={handleRun} className="solve-button" disabled={isLoading}>
                            {isLoading ? 'Optimizing...' : 'Run Optimization'}
                        </button>
                        
                        {error && <p className="error-message">{error}</p>}

                        {result && (
                            <div className="result-box">
                                <h3>Results</h3>
                                <p><strong>Optimal x:</strong> {result.optimalX.toFixed(6)}</p>
                                <p><strong>Optimal F(x):</strong> {result.optimalValue.toFixed(6)}</p>
                            </div>
                        )}
                    </div>
                    <div className="problem-media">
                        <div ref={desmosEl} className="desmos-container"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DesmosOptimizerPage;
