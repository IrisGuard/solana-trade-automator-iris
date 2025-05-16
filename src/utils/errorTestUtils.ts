
/**
 * Utility functions for testing errors and error handling
 */

let protectionSystem: any = null;

/**
 * Initialize the site protection system
 */
export function initProtectionSystem() {
  if (protectionSystem) {
    console.log('Protection system already initialized');
    return protectionSystem;
  }
  
  protectionSystem = {
    checkHealth: () => {
      console.log('Checking site health...');
      try {
        // Basic check that React is available
        if (!window.React) {
          console.error('React is not available on window');
          return { status: 'error', details: 'React not available' };
        }
        
        // Check that JSX functions are available
        if (!window.React.jsx || !window.React.jsxs) {
          console.error('JSX functions not available on React');
          return { status: 'error', details: 'JSX functions not available' };
        }
        
        // Check DOM access
        if (!document || !document.getElementById('root')) {
          console.error('Cannot access DOM or root element');
          return { status: 'error', details: 'DOM access issue' };
        }
        
        return { status: 'ok' };
      } catch (error) {
        console.error('Error during health check:', error);
        return { status: 'error', details: String(error) };
      }
    },
    
    repairSystem: () => {
      console.log('Attempting system repair...');
      try {
        // Re-apply React patches if needed
        if (!window.React || !window.React.jsx || !window.React.jsxs) {
          console.log('Re-applying React patches...');
          const { ensureReactCompatibility } = require('./reactPatches');
          ensureReactCompatibility();
        }
        
        // Re-apply router patches if needed
        if (!window.patchedReactRouter) {
          console.log('Re-applying router patches...');
          const { ensureRouterCompatibility } = require('./routerPatches');
          ensureRouterCompatibility();
        }
        
        return { status: 'repaired' };
      } catch (error) {
        console.error('Repair failed:', error);
        return { status: 'failed', details: String(error) };
      }
    }
  };
  
  // Attach to window for emergency access
  if (typeof window !== 'undefined') {
    window.siteHealth = protectionSystem;
  }
  
  return protectionSystem;
}

/**
 * Clear all errors from the error collector and any UI components
 */
export function clearAllErrors() {
  console.log('Clearing all errors...');
  
  try {
    // Clear error UI
    if (window.lovableChat?.clearErrors) {
      window.lovableChat.clearErrors();
    }
    
    // Clear error queues
    if (window._errorQueue) {
      window._errorQueue = [];
    }
    
    // Clear error timestamps
    if (window._lastErrorDisplayTimes) {
      window._lastErrorDisplayTimes = {};
    }
    
    // Reset last error time
    window._lastErrorDisplayTime = 0;
    
    // Clear console if in development
    if (process.env.NODE_ENV === 'development') {
      console.clear();
    }
    
    return true;
  } catch (error) {
    console.error('Error clearing errors:', error);
    return false;
  }
}

// Export the protection system for direct use
export default { initProtectionSystem, clearAllErrors };
