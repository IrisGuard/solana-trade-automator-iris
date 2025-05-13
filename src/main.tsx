
// Import polyfills first
import './polyfills';

// Import our React exports fix - this MUST be before any React-router imports
import './react-exports-fix';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Ensure global process is available
if (typeof window !== 'undefined' && !window.process) {
  window.process = { 
    env: {}, 
    browser: true 
  } as any;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
