
// Re-export React hooks and functions properly
import * as React from 'react';
import { jsx, jsxs, Fragment } from './utils/jsx-runtime-fix';

// Use named imports instead of namespace access
export const {
  useState,
  useEffect,
  useContext,
  useRef,
  createContext,
  forwardRef,
  memo,
  useCallback,
  useMemo,
  useReducer,
  useLayoutEffect
} = React;

// Export JSX runtime functions directly
export {
  jsx,
  jsxs,
  Fragment
};

// Export React itself for compatibility
export default React;
