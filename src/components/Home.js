import React from 'react';
import { useNavigate } from 'react-router-dom';
import InteractiveBackground from './InteractiveBackground'; // Assuming this is in the same folder
import '../styles/styles.css';

function Home() {
  const navigate = useNavigate();

  const handleMouseEnter = (e, newText) => {
    const originalText = e.target.getAttribute('data-original-text');
    if (!originalText) {
      e.target.setAttribute('data-original-text', e.target.innerText);
    }
    e.target.innerText = newText;
  };

  const handleMouseLeave = (e) => {
    const originalText = e.target.getAttribute('data-original-text');
    if (originalText) {
      e.target.innerText = originalText;
    }
  };

  return (
    <div className="page-container home-page">
      <InteractiveBackground />
      <div className="content">
        <h1 className="main-title">Optimization</h1>
        <p className="subtitle">Visualizing Mathematical Optimization</p>
        <div className="button-container">
          <button
            className="nav-button"
            onClick={() => navigate('/single-variable-optimizer')}
            onMouseEnter={(e) => handleMouseEnter(e, 'x')}
            onMouseLeave={handleMouseLeave}
          >
            Single Variable Optimization
          </button>
          <button
            className="nav-button"
            onClick={() => navigate('/multi-variable')}
            onMouseEnter={(e) => handleMouseEnter(e, '(x₁, x₂, ..., xₙ)')}
            onMouseLeave={handleMouseLeave}
          >
            Multi Variable Optimization
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;

