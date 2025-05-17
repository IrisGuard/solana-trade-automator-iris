
// Re-export JSX dev runtime from the main fix file
// Import directly from the main file to avoid circular imports
import { jsx, jsxs, Fragment, jsxDEV } from '../jsx-runtime-fix';

// Re-export the imports with jsxDEV as jsx for dev mode
export { jsxDEV as jsx, jsxs, Fragment };
export default { jsx: jsxDEV, jsxs, Fragment };
