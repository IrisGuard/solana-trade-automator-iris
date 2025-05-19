
// Import polyfills and patches first
import './polyfills';

// Apply DOM patches early
import { applyAllDOMPatches } from './utils/domPatches';
applyAllDOMPatches();

// Import React fixes before React components
import './utils/reactPatches';
import './react-exports-fix';

// Important: Import React directly to ensure it's available
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Import site protection components
import { SiteBackupService } from './utils/site-protection/SiteBackupService';
import { SiteHealthMonitor } from './utils/error-handling/SiteHealthMonitor';
import { routeDebugger } from './utils/routeDebugger';
import { AuthProvider } from './providers/AuthProvider';

// Log startup diagnostics
console.log('[App] Application starting up...');
console.log('[App] Current URL:', window.location.href);

// Create initial backup if needed
if (!localStorage.getItem('site_structure_backup')) {
  try {
    console.log('Creating initial site backup...');
    SiteBackupService.createBackup({ silent: true });
  } catch (e) {
    console.error('Failed to create initial backup:', e);
  }
}

// Start health monitoring
try {
  console.log('Starting site health monitoring...');
  SiteHealthMonitor.start();
} catch (e) {
  console.error('Failed to start health monitoring:', e);
}

// Add keyboard shortcut for emergency recovery
document.addEventListener('keydown', (e) => {
  if (e.altKey && e.shiftKey && e.key === 'R') {
    e.preventDefault();
    console.log('Emergency recovery triggered via keyboard shortcut');
    SiteBackupService.restoreFromBackup();
  }
});

// Add keyboard shortcut for manual health check
document.addEventListener('keydown', (e) => {
  if (e.altKey && e.shiftKey && e.key === 'C') {
    e.preventDefault();
    console.log('Manual health check triggered via keyboard shortcut');
    const healthStatus = SiteHealthMonitor.checkHealth();
    console.log('Health check results:', healthStatus);
  }
});

// Console log to debug React availability
console.log('React version available:', React.version);
console.log('ReactDOM available:', !!ReactDOM);
console.log('React.Fragment available:', !!React.Fragment);

// Log DOM readiness
console.log('[App] Checking DOM readiness...');
console.log('[App] Root element exists:', !!document.getElementById('root'));

// Initialize React application
console.log('Initializing React application...');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// Log successful initialization
console.log('[App] React application initialized');
