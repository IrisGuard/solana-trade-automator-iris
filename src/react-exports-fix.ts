
// Re-export React hooks and functions properly
import React from 'react';

// Use namespace access instead of direct imports
export const useState = React.useState;
export const useEffect = React.useEffect;
export const useContext = React.useContext;
export const useRef = React.useRef;
export const createContext = React.createContext;
export const createElement = React.createElement;
export const forwardRef = React.forwardRef;
export const Fragment = React.Fragment;
export const memo = React.memo;

// Add any other hooks or functions that might be needed
export const useCallback = React.useCallback;
export const useMemo = React.useMemo;
export const useReducer = React.useReducer;
export const useLayoutEffect = React.useLayoutEffect;

// Export React itself as default
export default React;
