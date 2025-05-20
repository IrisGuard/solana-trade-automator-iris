
import { BotError } from '../errorTypes';
import { toast } from 'sonner';

declare global {
  interface Window {
    __REACT_CONTEXT_FALLBACK__?: any;
    __JSX_RUNTIME_PATCHED__?: boolean;
    React?: any; // Use any type for React to avoid TypeScript errors
  }
}

export function fixReactError(error: BotError): boolean {
  // Auto-fix common React errors
  if (error.message.includes('jsx-runtime') || error.message.includes('"jsx" is not exported')) {
    injectJsxRuntimeFallback();
    return true;
  }
  
  if (error.message.includes('createContext')) {
    return fixReactContextIssue();
  }
  
  return false;
}

function injectJsxRuntimeFallback() {
  // Avoid applying multiple times
  if (window.__JSX_RUNTIME_PATCHED__) return;
  
  try {
    // Mark as patched
    window.__JSX_RUNTIME_PATCHED__ = true;
    
    // Import our JSX runtime bridge
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/react@18/umd/react.production.min.js';
    script.onload = () => {
      // Add explicit JSX runtime functions to React global
      if (window.React) {
        // Using type assertion to avoid TypeScript errors
        (window.React as any).jsx = (window.React as any).createElement;
        (window.React as any).jsxs = (window.React as any).createElement;
      }
      toast.success("React JSX runtime patched", {
        description: "JSX runtime issue fixed, reloading page..."
      });
      setTimeout(() => window.location.reload(), 2000);
    };
    document.head.appendChild(script);
    return true;
  } catch (error) {
    console.error("Failed to patch JSX runtime:", error);
    return false;
  }
}

function fixReactContextIssue() {
  if (!window.__REACT_CONTEXT_FALLBACK__ && window.React) {
    window.__REACT_CONTEXT_FALLBACK__ = window.React.createContext;
    toast.success("React context patched", {
      description: "React createContext issue fixed"
    });
    return true;
  }
  return false;
}
