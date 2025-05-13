
/**
 * This file contains patches needed for React to work properly with the rest of the application
 * Especially for fixing common ESM/CJS compatibility issues
 */

// Patch global React for CommonJS modules that might require it
if (typeof window !== 'undefined') {
  // Make sure React is available globally
  if (!window.React) {
    import('react').then(React => {
      window.React = React;
      console.log('React patched globally for CommonJS compatibility');
    }).catch(err => {
      console.error('Failed to patch React globally:', err);
    });
  }
  
  // Ensure react hooks are available on global React
  if (window.React && !window.React.useState) {
    import('./reactHooksBridge').then(hooks => {
      console.log('React hooks patched globally');
    }).catch(err => {
      console.error('Failed to patch React hooks globally:', err);
    });
  }
}

export default function ensureReactCompatibility() {
  console.log('React compatibility layer activated');
  return true;
}
