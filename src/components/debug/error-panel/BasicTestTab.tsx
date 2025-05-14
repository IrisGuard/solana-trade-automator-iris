
import React from 'react';
import { Button } from '@/components/ui/button';
import { useErrorReporting } from '@/hooks/useErrorReporting';
import { clearAllErrors } from '@/utils/error-handling/errorReporting';

export function BasicTestTab() {
  const { reportError, reportMessage } = useErrorReporting();

  const testBasicError = () => {
    try {
      throw new Error('This is a basic test error');
    } catch (error) {
      reportError(error as Error, { component: 'BasicTestTab', showToast: true });
    }
  };

  const handleClearErrors = () => {
    clearAllErrors();
  };

  return (
    <div className="space-y-4">
      <div>
        <Button onClick={testBasicError}>Test Basic Error</Button>
      </div>
      <div>
        <Button variant="outline" onClick={handleClearErrors}>
          Clear All Errors
        </Button>
      </div>
    </div>
  );
}
