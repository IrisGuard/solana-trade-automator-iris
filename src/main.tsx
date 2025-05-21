
// Import React 18.3.1 compatibility layer first - this is most critical
import './react-compatibility';

// Import polyfills and patches
import './polyfills';

// Important: Import React directly to ensure it's available
import React from 'react';
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

// Diagnose React exports - enhanced with more detail and error handling
try {
  console.log('[App] React exports check:', {
    // Use safe property access
    createElement: typeof (React['createElement']),
    useState: typeof (React['useState']),
    useRef: typeof (React['useRef']),
    useEffect: typeof (React['useEffect']),
    jsx: typeof (React['jsx']),
    Fragment: typeof (React['Fragment']),
    // Check if hooks exist on React
    hooks: {
      useState: typeof (React['useState']) === 'function',
      useEffect: typeof (React['useEffect']) === 'function',
      useRef: typeof (React['useRef']) === 'function',
      useContext: typeof (React['useContext']) === 'function'
    },
    // Check if global React exists
    globalReact: typeof window !== 'undefined' && !!window.React,
    // Check if hooks exist on global React
    globalHooks: typeof window !== 'undefined' && window.React ? {
      useState: typeof (window.React['useState']) === 'function',
      useEffect: typeof (window.React['useEffect']) === 'function',
      useRef: typeof (window.React['useRef']) === 'function'
    } : 'Not available'
  });
} catch (e) {
  console.error('[App] Error checking React exports:', e);
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
  
  // Create safe createElement reference that returns a valid ReactNode
  const createElement = React.createElement || React['createElement'] || 
                       function(type: any, props: any, ...children: any[]) { 
                         console.warn('Using createElement fallback');
                         // Return a React Fragment with children as a valid ReactNode
                         return React.createElement(React.Fragment, null, children);
                       };
  
  // Use the createRoot function with fallback
  const createRoot = ReactDOM.createRoot || ReactDOM['createRoot'] || 
                    function(container) { 
                      console.warn('Using createRoot fallback'); 
                      return { 
                        render: (element) => { 
                          console.log('Fallback render called'); 
                        } 
                      }; 
                    };
  
  // Create safe StrictMode reference
  const StrictMode = React.StrictMode || React['StrictMode'] || React.Fragment || 'div';
  
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
