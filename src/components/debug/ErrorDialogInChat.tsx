
// Re-export components from their respective files
import { ErrorDialogInChat as BaseErrorDialogInChat } from './error-dialog/ErrorDialog';
import { useErrorDialogInChat } from './error-dialog/useErrorDialog';
import { clearAllErrors } from '@/utils/errorTestUtils';
import { sanitizeErrorObject } from '@/utils/errorTestUtils';

// Create a wrapper that ensures error objects are sanitized
function ErrorDialogInChat(props: any) {
  const safeProps = {
    ...props,
    error: sanitizeErrorObject(props.error)
  };
  return <BaseErrorDialogInChat {...safeProps} />;
}

export { ErrorDialogInChat, useErrorDialogInChat, clearAllErrors };
