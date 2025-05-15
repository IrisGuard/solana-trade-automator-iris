
// Import React fixes first
import './react-exports-fix';
import './utils/reactPatches';  
import './utils/routerPatches';  
import { applyAllDOMPatches } from './utils/domPatches';  

// Buffer and other polyfills
import './polyfills';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { errorManager } from './utils/error-handling/ErrorManager';

// Initialize error handling before React rendering
errorManager.handleError({
  message: 'Application initialized',
  source: 'CONSOLE',
  level: 'INFO'
});

// Apply DOM patches before React initialization
applyAllDOMPatches();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
