
// Import React hooks exporter first - critical for React 18.3.1 compatibility
import './utils/reactHooksExporter';

// Import JSX runtime bridge next
import './jsx-runtime-bridge';

// Import router hooks bridge early
import './utils/reactHooksBridge';
import './utils/routerHooksBridge';

// Import React fixes before React components
import './react-exports-fix';
import './lib/router-exports';

// Import polyfills and patches
import './polyfills';

// Apply DOM patches early
import { applyAllDOMPatches } from './utils/domPatches';
applyAllDOMPatches();

// Important: Import React directly to ensure it's available
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Import site protection components
import { SiteBackupService } from './utils/site-protection/SiteBackupService';
import { SiteHealthMonitor } from './utils/error-handling/SiteHealthMonitor';
import { routeDebugger } from './utils/routeDebugger';

// Log startup diagnostics
console.log('[App] Application starting up...');
console.log('[App] Current URL:', window.location.href);
console.log('[App] React version:', React.version);

// Diagnose React exports
console.log('[App] React exports check:', {
  createElement: typeof React.createElement,
  useState: typeof React.useState,
  jsx: typeof (React as any).jsx,
  Fragment: typeof React.Fragment,
  hooks: {
    useState: typeof React.useState === 'function',
    useEffect: typeof React.useEffect === 'function',
    useRef: typeof React.useRef === 'function',
    useContext: typeof React.useContext === 'function'
  }
});

// Create initial backup if none exists
if (SiteBackupService.countAvailableBackups() === 0) {
  SiteBackupService.createBackup();
}

// Start health monitoring
try {
  console.log('Starting site health monitoring...');
  SiteHealthMonitor.start();
} catch (e) {
  console.error('Failed to start health monitoring:', e);
}

// Log DOM readiness
console.log('[App] Checking DOM readiness...');
console.log('[App] Root element exists:', !!document.getElementById('root'));

// Initialize React application
console.log('Initializing React application...');

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  // Added manual React hook patching before rendering
  if (typeof window !== 'undefined' && window.React) {
    if (!window.React.useState && React.useState) {
      console.log('[Manual patch] Adding useState to window.React');
      window.React.useState = React.useState;
    }
    if (!window.React.useEffect && React.useEffect) {
      console.log('[Manual patch] Adding useEffect to window.React');
      window.React.useEffect = React.useEffect;
    }
    if (!window.React.useRef && React.useRef) {
      console.log('[Manual patch] Adding useRef to window.React');
      window.React.useRef = React.useRef;
    }
  }
  
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  // Log successful initialization
  console.log('[App] React application initialized successfully');
} catch (error) {
  console.error('[App] Failed to initialize React application:', error);
  // Try to recover by removing StrictMode
  try {
    const rootElement = document.getElementById('root');
    if (rootElement) {
      console.log('[App] Attempting recovery without StrictMode...');
      ReactDOM.createRoot(rootElement).render(<App />);
    }
  } catch (fallbackError) {
    console.error('[App] Recovery attempt failed:', fallbackError);
  }
}
