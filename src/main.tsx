
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider';
import './index.css';

// Emergency check to verify Buffer and kB are available
if (typeof window.kB === 'undefined' || typeof window.kB.alloc !== 'function') {
  console.warn('kB not available at startup, creating emergency implementation');
  window.kB = {
    alloc: function(size, fill) {
      console.log('Last resort kB.alloc implementation');
      return new Uint8Array(size);
    },
    from: function(data, encoding) {
      console.log('Last resort kB.from implementation');
      if (typeof data === 'string') {
        return new TextEncoder().encode(data);
      }
      return new Uint8Array(data);
    }
  };
}

// Log availability for debugging
console.log('Main.tsx - kB check:', {
  available: typeof window.kB !== 'undefined',
  hasAlloc: typeof window.kB?.alloc === 'function',
  hasFrom: typeof window.kB?.from === 'function'
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
