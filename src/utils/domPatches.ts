
/**
 * Apply patches to DOM to prevent common errors
 */

export function applyAllDOMPatches() {
  try {
    patchRemoveChild();
    patchAppendChild();
    patchJSXRuntime();
    console.log('DOM patches applied successfully');
  } catch (error) {
    console.error('Error applying DOM patches:', error);
  }
}

/**
 * Patch for removeChild errors that occur with certain browser extensions
 */
function patchRemoveChild() {
  const originalRemoveChild = Element.prototype.removeChild;
  
  Element.prototype.removeChild = function(child) {
    try {
      if (child && this.contains(child)) {
        return originalRemoveChild.call(this, child);
      }
      return child;
    } catch (error) {
      console.warn('Prevented removeChild error:', error);
      return child;
    }
  };
}

/**
 * Patch for appendChild errors
 */
function patchAppendChild() {
  const originalAppendChild = Element.prototype.appendChild;
  
  Element.prototype.appendChild = function(child) {
    try {
      return originalAppendChild.call(this, child);
    } catch (error) {
      console.warn('Prevented appendChild error:', error);
      return child;
    }
  };
}

/**
 * Patch for JSX runtime errors
 */
function patchJSXRuntime() {
  if (typeof window !== 'undefined') {
    // Make sure React is available globally
    if (window.React && !window.__PATCHED_JSX_RUNTIME) {
      window.__PATCHED_JSX_RUNTIME = true;
      
      // Get React instance
      const ReactModule = window.React;
      
      // Use type assertion to add jsx and jsxs functions
      if (!('jsx' in ReactModule)) {
        (ReactModule as any).jsx = ReactModule.createElement;
      }
      
      if (!('jsxs' in ReactModule)) {
        (ReactModule as any).jsxs = ReactModule.createElement;
      }
      
      // Expose React to global scope for debugging
      window.__REACT = ReactModule;
    }
  }
}

// Add this to window type
declare global {
  interface Window {
    __PATCHED_JSX_RUNTIME?: boolean;
    __REACT?: any;
    React: any;
  }
}
