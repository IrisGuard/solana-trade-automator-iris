
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <HelpButton />
  </React.StrictMode>
)
