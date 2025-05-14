
/**
 * Ensures React compatibility by patching missing or problematic exports
 * that might be required by third-party libraries
 */

// This function ensures React exports are available globally
export function ensureReactCompatibility() {
  if (typeof window !== 'undefined') {
    // Import React dynamically to avoid circular dependencies
    import('react').then(React => {
      // Ensure React is available globally
      if (!window.React) {
        window.React = React;
      }
      
      // Patch any missing exports that libraries might expect
      if (window.React && !window.React.createContext && React.createContext) {
        window.React.createContext = React.createContext;
      }
      
      if (window.React && !window.React.useState && React.useState) {
        window.React.useState = React.useState;
      }
      
      if (window.React && !window.React.useEffect && React.useEffect) {
        window.React.useEffect = React.useEffect;
      }
      
      if (window.React && !window.React.useRef && React.useRef) {
        window.React.useRef = React.useRef;
      }
      
      if (window.React && !window.React.useContext && React.useContext) {
        window.React.useContext = React.useContext;
      }
      
      console.log('React compatibility patches applied');
    }).catch(err => {
      console.error('Failed to apply React compatibility patches:', err);
    });
    
    // Ensure require is available for CommonJS modules
    if (!window.require) {
      window.require = function(id: string) {
        console.warn(`Module "${id}" was required but require() is not fully implemented in the browser environment`);
        // Return an empty object to prevent errors
        return {};
      } as any;
    }
  }
  
  return true;
}

export default ensureReactCompatibility;
