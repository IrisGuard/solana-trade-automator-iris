
import React from 'react';
import { Button } from '@/components/ui/button';
import { useErrorOptions } from './ErrorOptionsContext';
import { ErrorOptions } from './ErrorOptions';
import { displayError } from '@/utils/error-handling/displayError';
import { clearAllErrors } from '@/utils/errorTestUtils';

export function BasicTestTab() {
  const { errorMessage, showToast, logToConsole, sendToChat, useCollector } = useErrorOptions();
  
  const handleGenerateError = () => {
    // Create error options object to pass to generateTestError
    const options = {
      showToast,
      logToConsole,
      component: 'ErrorTestPanel'
    };
    
    // Generate test error with the specified options
    const error = new Error(errorMessage);
    displayError(error, options);
  };

  return (
    <div className="space-y-4">
      <ErrorOptions />
      
      <Button onClick={handleGenerateError} className="w-full">
        Δημιουργία Σφάλματος
      </Button>
      
      <Button onClick={clearAllErrors} variant="outline" className="w-full">
        Καθαρισμός Σφαλμάτων
      </Button>
    </div>
  );
}
