// Import our JSX runtime bridge first
import './jsx-runtime-bridge';

// Import hooks exporter before any React components
import './utils/reactHooksExporter';

// Import polyfills and patches first
import './polyfills';

// Apply DOM patches early
import { applyAllDOMPatches } from './utils/domPatches';
applyAllDOMPatches();

// Import React fixes before React components
import './utils/reactPatches';
import './react-exports-fix';
import './utils/routerHooksBridge';

// Important: Import React directly to ensure it's available
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Import site protection components
import { SiteBackupService } from './utils/site-protection/SiteBackupService';
import { SiteHealthMonitor } from './utils/error-handling/SiteHealthMonitor';
import { routeDebugger } from './utils/routeDebugger';

// Log startup diagnostics
console.log('[App] Application starting up...');
console.log('[App] Current URL:', window.location.href);

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
