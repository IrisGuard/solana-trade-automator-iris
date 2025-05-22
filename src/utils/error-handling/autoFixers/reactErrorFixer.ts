
import { BotError } from '../errorTypes';
import { toast } from 'sonner';

declare global {
  interface Window {
    __REACT_CONTEXT_FALLBACK__?: any;
  }
}

export function fixReactError(error: BotError): boolean {
  // Auto-fix common React errors
  if (error.message.includes('jsx-runtime')) {
    injectJsxRuntimeFallback();
    return true;
  }
  
  if (error.message.includes('createContext')) {
    return fixReactContextIssue();
  }
  
  return false;
}

function injectJsxRuntimeFallback() {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/react@18/umd/react.production.min.js';
  script.onload = () => {
    toast.success("React runtime patched", {
      description: "JSX runtime issue fixed, reloading page..."
    });
    setTimeout(() => window.location.reload(), 2000);
  };
  document.head.appendChild(script);
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
