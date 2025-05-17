
// Import polyfills and patches first
import './polyfills';

// Apply DOM patches early
import './utils/domPatches';

// Initialize React global object early 
import { initializeReactRuntime } from './utils/reactInitializer';
initializeReactRuntime();

// Import React fixes before React components
import './utils/reactPatches';
import './react-exports-fix';

// Important: Import React directly to ensure it's available
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize site protection components
import { SiteBackupService } from './utils/site-protection/SiteBackupService';
import { HelpButton } from './components/help/HelpButton.tsx';
import { MonitoringSystem } from './components/monitoring/MonitoringSystem';

// Create initial backup if needed
if (!localStorage.getItem('site_structure_backup')) {
  try {
    console.log('Creating initial site backup...');
    SiteBackupService.createBackup({ silent: true });
  } catch (e) {
    console.error('Failed to create initial backup:', e);
  }
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
    const { SiteHealthMonitor } = require('./utils/error-handling/SiteHealthMonitor');
    const healthStatus = SiteHealthMonitor.checkHealth();
    console.log('Health check results:', healthStatus);
  }
});

// Console log to debug React availability
console.log('React version available:', React.version);
console.log('ReactDOM available:', !!ReactDOM);
console.log('React.Fragment available:', !!React.Fragment);
console.log('React.jsx available:', !!React.jsx);

// Initialize React application
console.log('Initializing React application...');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
