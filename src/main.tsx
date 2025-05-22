
// Import React 18.3.1 compatibility layer first - this is most critical
import './react-compatibility';

// Import polyfills and patches
import './polyfills';

// Important: Import React with namespace import
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Import site protection components
import { SiteBackupService } from './utils/site-protection/SiteBackupService';
import { SiteHealthMonitor } from './utils/error-handling/SiteHealthMonitor';

// Log startup diagnostics
console.log('[App] Application starting up...');
console.log('[App] Current URL:', window.location.href);

// Use bracket notation and fallbacks for React version check
try {
  console.log('[App] React version:', React['version'] || 'unknown (using compatibility mode)');
} catch (e) {
  console.log('[App] React version: unknown (error accessing version)');
}

// Create initial backup if none exists
if (SiteBackupService && SiteBackupService.countAvailableBackups && SiteBackupService.countAvailableBackups() === 0) {
  SiteBackupService.createBackup && SiteBackupService.createBackup();
}

// Start health monitoring
try {
  console.log('Starting site health monitoring...');
  SiteHealthMonitor && SiteHealthMonitor.start && SiteHealthMonitor.start();
} catch (e) {
  console.error('Failed to start health monitoring:', e);
}

// Log DOM readiness
console.log('[App] Checking DOM readiness...');
console.log('[App] Root element exists:', !!document.getElementById('root'));

// Initialize React application with enhanced error handling
console.log('Initializing React application...');

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  // Create root using ReactDOM
  const createRoot = ReactDOM.createRoot;
  
  // Get StrictMode safely
  const StrictMode = React['StrictMode'] || React['Fragment'] || React.Fragment || 'div';
  
  // Render app with proper error handling
  try {
    const root = createRoot(rootElement);
    
    // Use explicit createElement to avoid JSX in case it's not available yet
    root.render(
      React.createElement(StrictMode, null,
        React.createElement(App)
      )
    );
    
    console.log('[App] React application initialized successfully');
  } catch (renderError) {
    console.error('[App] Error during render:', renderError);
    // Try alternative rendering approach
    try {
      console.log('[App] Attempting alternative render method...');
      const root = createRoot(rootElement);
      root.render(React.createElement(App));
    } catch (fallbackError) {
      console.error('[App] Alternative render failed:', fallbackError);
      
      // Display error message in DOM
      rootElement.innerHTML = `
        <div style="padding: 20px; color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px;">
          <h3>Σφάλμα Εφαρμογής</h3>
          <p>Η εφαρμογή δεν μπόρεσε να φορτωθεί σωστά. Παρακαλώ ανανεώστε τη σελίδα.</p>
          <p style="margin-top: 8px; font-size: 0.9em;">Σφάλμα: ${String(fallbackError)}</p>
          <button onclick="window.location.reload()" style="background: #dc3545; color: white; border: none; padding: 5px 10px; cursor: pointer; margin-top: 10px;">
            Ανανέωση
          </button>
        </div>
      `;
    }
  }
} catch (error) {
  console.error('[App] Failed to initialize React application:', error);
  // Last resort recovery
  try {
    console.log('[App] Attempting last resort recovery...');
    const rootElement = document.getElementById('root');
    if (rootElement) {
      // Display error message in DOM
      rootElement.innerHTML = `
        <div style="padding: 20px; color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px;">
          <h3>Σφάλμα Εφαρμογής</h3>
          <p>Η εφαρμογή δεν μπόρεσε να φορτωθεί σωστά. Παρακαλώ ανανεώστε τη σελίδα.</p>
          <p style="margin-top: 8px; font-size: 0.9em;">Σφάλμα: ${String(error)}</p>
          <button onclick="window.location.reload()" style="background: #dc3545; color: white; border: none; padding: 5px 10px; cursor: pointer; margin-top: 10px;">
            Ανανέωση
          </button>
        </div>
      `;
    }
  } catch (finalError) {
    console.error('[App] All recovery attempts failed');
  }
}
