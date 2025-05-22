
// Re-export React hooks and functions properly
import * as React from 'react';

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
  useLayoutEffect,
  Fragment
} = React;

// Export React itself for compatibility
export default React;
