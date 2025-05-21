
// Import React 18.3.1 compatibility layer first - this is most critical
import './react-runtime';

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

// Initialize React application with enhanced error handling
console.log('Initializing React application...');

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  // Create root using our compatibility layer
  const createRoot = ReactDOM.createRoot;
  
  // Use our safe createElement function
  const createElement = React['createElement'] || window.React['createElement'] || function(type: any, props: any, ...children: any[]) { 
    return { type, props: { ...props, children } };
  };
  
  // Get StrictMode safely
  const StrictMode = React['StrictMode'] || React['Fragment'] || 'div';
  
  // Render app with proper error handling
  try {
    createRoot(rootElement).render(
      createElement(StrictMode, null,
        createElement(App, null)
      )
    );
    console.log('[App] React application initialized successfully');
  } catch (renderError) {
    console.error('[App] Error during render:', renderError);
    // Try alternative rendering approach
    try {
      console.log('[App] Attempting alternative render method...');
      createRoot(rootElement).render(createElement(App, null));
    } catch (fallbackError) {
      console.error('[App] Alternative render failed:', fallbackError);
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
          <h3>Application Error</h3>
          <p>The application couldn't load properly. Please refresh the page or contact support.</p>
          <button onclick="window.location.reload()" style="background: #dc3545; color: white; border: none; padding: 5px 10px; cursor: pointer;">
            Refresh
          </button>
        </div>
      `;
    }
  } catch (finalError) {
    console.error('[App] All recovery attempts failed');
  }
}
