
/**
 * Ensure React compatibility with various modules and environments
 */

// Extend Window interface to include our compatibility layer marker
declare global {
  interface Window {
    __REACT_COMPAT_LAYER?: boolean;
  }
}

export function ensureReactCompatibility() {
  try {
    // Ensure Buffer is available
    if (typeof window !== 'undefined' && !window.Buffer) {
      console.log('Adding Buffer compatibility layer for React components');
      
      // Use our pre-loaded polyfills
      if (typeof global !== 'undefined' && global.Buffer) {
        (window as any).Buffer = global.Buffer;
      }
    }
    
    // Ensure polyfills are properly initialized
    if (typeof window !== 'undefined' && !window.__REACT_COMPAT_LAYER) {
      window.__REACT_COMPAT_LAYER = true;
      console.log('React compatibility layer initialized');
    }
  } catch (e) {
    console.error('Failed to initialize React compatibility layer:', e);
  }
}
