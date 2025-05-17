
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Polyfills for Solana web3.js
import './polyfills'
import { AppContent } from './components/AppContent.tsx'

// Initialize early protection mechanism before rendering
import { SiteBackupService } from './utils/site-protection/SiteBackupService'
import { HelpButton } from './components/help/HelpButton.tsx'
import { SiteHealthMonitor } from './utils/error-handling/SiteHealthMonitor'

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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
