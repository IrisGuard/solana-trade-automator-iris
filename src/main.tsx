
// Import polyfills first
import './polyfills';

// Import our React exports fix - this MUST be before any React-router imports
import React, { useState, useEffect, useContext, useRef, createContext } from './react-exports-fix';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Log available hooks from React import
console.log('main.tsx React hooks available:', {
  useState: !!useState,
  useEffect: !!useEffect,
  useContext: !!useContext,
  useRef: !!useRef,
  createContext: !!createContext
});

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
