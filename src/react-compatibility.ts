
/**
 * React 18.3.1 Compatibility Layer
 * 
 * This file provides a unified compatibility layer for React 18.3.1
 * which changes how hooks and other APIs are exported.
 */

// Import our central runtime bridge first
import * as RuntimeBridge from './react-runtime';
import * as React from 'react';

// Re-export everything from the runtime bridge
export const {
  useState,
  useEffect,
  useContext,
  useReducer,
  useRef,
  useMemo,
  useCallback,
  useLayoutEffect,
  useImperativeHandle,
  useDebugValue,
  useId,
  useDeferredValue,
  useInsertionEffect,
  useSyncExternalStore,
  useTransition,
  Fragment,
  createElement,
  createContext,
  forwardRef,
  memo,
  jsx,
  jsxs,
  jsxDEV
} = RuntimeBridge;

// Create type definitions for better TypeScript support
type SetStateAction<S> = S | ((prevState: S) => S);
type Dispatch<A> = (action: A) => void;

// Explicitly apply the compatibility layer
export function patchReact(): void {
  console.log('Applying React 18.3.1 compatibility patches from react-compatibility.ts');
  
  if (typeof window !== 'undefined') {
    // Ensure React global object exists
    window.React = window.React || {...React};
    
    // Apply all exports to window.React
    Object.entries(RuntimeBridge).forEach(([name, implementation]) => {
      if (implementation && !window.React[name]) {
        try {
          window.React[name] = implementation;
        } catch (e) {
          console.warn(`Failed to patch ${name}: ${e.message}`);
        }
      }
    });
    
    console.log('React 18.3.1 compatibility layer applied successfully');
  }
}

// Auto-patch when this file is imported
patchReact();

// Export the React namespace for backward compatibility
export default React;
