
import * as React from 'react';

// Extend the React namespace to include JSX runtime functions that match React 18.3.1
declare module 'react' {
  // JSX runtime functions
  export const jsx: typeof React.createElement;
  export const jsxs: typeof React.createElement;
  export const jsxDEV: typeof React.createElement;
  export const jsxsDEV: typeof React.createElement;
  
  // React hooks that might not be available in the typings
  export const useState: typeof React.useState;
  export const useEffect: typeof React.useEffect;
  export const useContext: typeof React.useContext;
  export const useRef: typeof React.useRef;
  export const useReducer: typeof React.useReducer;
  export const useCallback: typeof React.useCallback;
  export const useMemo: typeof React.useMemo;
  export const useLayoutEffect: typeof React.useLayoutEffect;
  export const useImperativeHandle: typeof React.useImperativeHandle;
  export const useDebugValue: typeof React.useDebugValue;
  export const useId: typeof React.useId;
  export const useDeferredValue: any;
  export const useInsertionEffect: any;
  export const useSyncExternalStore: any;
  export const useTransition: any;
}

// Extend window.React to include JSX runtime functions
declare global {
  interface Window {
    React: typeof React & {
      jsx: typeof React.createElement;
      jsxs: typeof React.createElement;
      jsxDEV: typeof React.createElement;
      jsxsDEV: typeof React.createElement;
      useState?: typeof React.useState;
      useEffect?: typeof React.useEffect;
      useContext?: typeof React.useContext;
      useRef?: typeof React.useRef;
      useReducer?: typeof React.useReducer;
      useCallback?: typeof React.useCallback;
      useMemo?: typeof React.useMemo;
      useLayoutEffect?: typeof React.useLayoutEffect;
      useImperativeHandle?: typeof React.useImperativeHandle;
      useDebugValue?: typeof React.useDebugValue;
      useId?: typeof React.useId;
      useDeferredValue?: any;
      useInsertionEffect?: any;
      useSyncExternalStore?: any;
      useTransition?: any;
      [key: string]: any;
    };
    lovableChat?: {
      clearErrors?: () => void;
      createErrorDialog?: (errorData: any) => void;
      [key: string]: any;
    };
    patchedReactRouter?: boolean;
    __REACT_CONTEXT_FALLBACK__?: any;
    __JSX_RUNTIME_PATCHED__?: boolean;
  }
}
