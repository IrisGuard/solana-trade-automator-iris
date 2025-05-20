
import * as React from 'react';

// Extend the React namespace to include JSX runtime functions
declare module 'react' {
  export const jsx: typeof React.createElement;
  export const jsxs: typeof React.createElement;
  export const jsxDEV: typeof React.createElement;
  export const jsxsDEV: typeof React.createElement;
}

// Extend window.React to include JSX runtime functions
interface Window {
  React: typeof React & {
    jsx: typeof React.createElement;
    jsxs: typeof React.createElement;
    jsxDEV: typeof React.createElement;
    jsxsDEV: typeof React.createElement;
  };
}
