
// Re-export components from their respective files
export { ErrorDialogInChat } from './error-dialog/ErrorDialog';
export { useErrorDialogInChat } from './error-dialog/useErrorDialog';

// Export for backward compatibility - using our newly created function
import { clearAllErrors } from '@/utils/errorTestUtils';
export { clearAllErrors };
