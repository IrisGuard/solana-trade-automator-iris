
export { errorManager } from './ErrorManager';
export { displayError } from './displayError';
export { setupGlobalErrorHandling } from './setupGlobalErrorHandling';
export * from './errorTypes';

// Re-export collector functions and types
export { errorCollector } from './collector';
export type { ErrorCollector, ErrorData, ErrorOptions } from './collector/types';
