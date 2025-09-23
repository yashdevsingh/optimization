// src/components/Home.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css';
import InteractiveBackground from './InteractiveBackground';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="page-container home">
      <InteractiveBackground />
      <div className="content">
        <h1 className="main-title">Optimization</h1>
        <p className="subtitle">Visualizing Mathematical Optimization</p>
        <div className="button-container">
          <button
            className="nav-button"
            onClick={() => navigate('/single-variable')}
            onMouseEnter={(e) => (e.currentTarget.querySelector('span').textContent = 'x')}
            onMouseLeave={(e) => (e.currentTarget.querySelector('span').textContent = 'Single Variable Optimization')}
          >
            <span>Single Variable Optimization</span>
          </button>
          <button
            className="nav-button"
            onClick={() => navigate('/multi-variable')}
            onMouseEnter={(e) => (e.currentTarget.querySelector('span').textContent = '(x₁, x₂, ..., xₙ)')}
            onMouseLeave={(e) => (e.currentTarget.querySelector('span').textContent = 'Multi Variable Optimization')}
          >
            <span>Multi Variable Optimization</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;