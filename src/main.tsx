
// Import React fixes first
import './react-exports-fix';
import './utils/reactPatches';  
import './utils/routerPatches';  
import { applyAllDOMPatches } from './utils/domPatches';  // Προσθήκη του import

// Buffer and other polyfills
import './polyfills';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Εφαρμογή των DOM patches πριν από την αρχικοποίηση της React
applyAllDOMPatches();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
