
// Main export file for JSX runtime fixes
// Import directly from the main file to avoid circular imports
import { jsx, jsxs, Fragment, jsxDEV } from '../jsx-runtime-fix';

// Re-export the imports
export { jsx, jsxs, Fragment, jsxDEV };
export default { jsx, jsxs, Fragment, jsxDEV };
