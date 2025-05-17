
// Import polyfills before anything else
import './polyfills'

// Apply DOM patches early
import './utils/domPatches'

// Import our React fixes before React components
import './utils/reactPatches'
import './react-exports-fix'

import ReactDOM from 'react-dom/client'
import * as ReactModule from 'react'
import App from './App.tsx'
import './index.css'

// Initialize early protection mechanism before rendering
import { SiteBackupService } from './utils/site-protection/SiteBackupService'
import { HelpButton } from './components/help/HelpButton.tsx'
// Important: We'll use SiteHealthMonitor from the MonitoringSystem component to prevent double initialization
import { MonitoringSystem } from './components/monitoring/MonitoringSystem'
import { SiteHealthMonitor } from './utils/error-handling/SiteHealthMonitor'
import { AppContent } from './components/AppContent.tsx'

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
    // We can still use SiteHealthMonitor directly for manual checks
    const healthStatus = SiteHealthMonitor.checkHealth();
    console.log('Health check results:', healthStatus);
  }
});

// Initialize React
console.log('Initializing React application...');

// Get React from window (after patches are applied) or fallback to imported module
const React = window.React || ReactModule;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
