
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Polyfills for Solana web3.js
import './polyfills'
import { AppContent } from './components/AppContent.tsx'

// Initialize early protection mechanism before rendering
import { SiteBackupService } from './utils/site-protection/SiteBackupService'

// Create initial backup if needed
if (!localStorage.getItem('site_structure_backup')) {
  try {
    console.log('Creating initial site backup...');
    SiteBackupService.createBackup({ silent: true });
  } catch (e) {
    console.error('Failed to create initial backup:', e);
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
