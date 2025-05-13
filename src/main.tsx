
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

console.log('Main.tsx loaded, Buffer available:', typeof window.Buffer);
console.log('Buffer methods:', window.Buffer ? Object.keys(window.Buffer) : 'No Buffer');
console.log('Buffer.alloc available:', window.Buffer && typeof window.Buffer.alloc);

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
