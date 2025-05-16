
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import our React fixes before anything else
import './utils/reactPatches'
import './react-exports-fix'

// Polyfills for Solana web3.js
import './polyfills'
import { AppContent } from './components/AppContent.tsx'

// Initialize early protection mechanism before rendering
import { SiteBackupService } from './utils/site-protection/SiteBackupService'
import { HelpButton } from './components/help/HelpButton.tsx'
// Important: We'll use SiteHealthMonitor from the MonitoringSystem component to prevent double initialization
import { MonitoringSystem } from './components/monitoring/MonitoringSystem'

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
    const healthStatus = window.siteHealth?.check();
    console.log('Health check results:', healthStatus);
  }
});

// Initialize React
console.log('Initializing React application...');

// Ensure we're using our patched React
const React = window.React || React;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
