
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider';
import './index.css';

// Ensure Buffer polyfill is loaded and available
console.log('Checking Buffer/kB availability in main.tsx:', {
  hasBuffer: typeof window.Buffer !== 'undefined',
  hasKB: typeof window.kB !== 'undefined',
  hasKBAlloc: typeof window.kB?.alloc === 'function'
});

// Emergency fallback if the polyfill didn't load correctly
if (typeof window.kB === 'undefined' || typeof window.kB.alloc !== 'function') {
  console.warn('kB not properly initialized, creating emergency implementation');
  window.kB = {
    alloc: function(size, fill) {
      console.log('Emergency kB.alloc called in main.tsx');
      return new Uint8Array(size);
    },
    from: function(data, encoding) {
      console.log('Emergency kB.from called in main.tsx');
      if (typeof data === 'string') {
        return new TextEncoder().encode(data);
      }
      return new Uint8Array(data);
    }
  };
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
