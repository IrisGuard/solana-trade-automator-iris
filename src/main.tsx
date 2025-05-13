
// Import polyfills first
import './polyfills';

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from './components/ui/toaster';
import { SolanaWalletProvider } from './providers/SolanaWalletProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

// Debug Buffer availability before the app starts
console.log('Main.tsx loaded, Buffer available:', typeof window.Buffer);
console.log('Buffer methods:', window.Buffer ? Object.keys(window.Buffer) : 'No Buffer');
console.log('Buffer.alloc available:', window.Buffer && typeof window.Buffer.alloc);
console.log('Buffer.from available:', window.Buffer && typeof window.Buffer.from);

// Extra check to ensure Buffer methods are properly bound
if (window.Buffer && !window.Buffer.alloc) {
  console.warn('Buffer.alloc is missing in main.tsx, attempting to fix...');
  try {
    const bufferModule = require('buffer/');
    window.Buffer.alloc = bufferModule.Buffer.alloc.bind(bufferModule.Buffer);
    window.Buffer.from = bufferModule.Buffer.from.bind(bufferModule.Buffer);
    window.Buffer.allocUnsafe = bufferModule.Buffer.allocUnsafe.bind(bufferModule.Buffer);
    console.log('Buffer methods fixed in main.tsx');
  } catch (e) {
    console.error('Failed to fix Buffer methods:', e);
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <SolanaWalletProvider>
            <App />
            <Toaster />
          </SolanaWalletProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
