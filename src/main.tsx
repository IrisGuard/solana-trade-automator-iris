
// Import React fixes first
import './react-exports-fix';
import './utils/reactPatches';
import './utils/routerPatches';  // Add the router patches

// Buffer and other polyfills
import './polyfills';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
