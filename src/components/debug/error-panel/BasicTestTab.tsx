
import { Button } from '@/components/ui/button';
import { useErrorOptions } from './ErrorOptionsContext';
import { ErrorOptions } from './ErrorOptions';
import { displayError } from '@/utils/errorUtils';

// Create a temporary generateTestError function since it doesn't exist
function generateTestError(message: string, options: any) {
  const error = new Error(message);
  displayError(error, options);
}

// Create a temporary clearAllErrors function 
function clearAllErrors() {
  console.log('Clearing all errors');
  // This would typically clear errors from various systems
}

export function BasicTestTab() {
  const { errorMessage, showToast, logToConsole, sendToChat, useCollector } = useErrorOptions();
  
  const handleGenerateError = () => {
    // Create error options object to pass to generateTestError
    const options = {
      showToast,
      logToConsole,
      sendToChat,
      useCollector,
      component: 'ErrorTestPanel'
    };
    
    // Generate test error with the specified options
    generateTestError(errorMessage, options);
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
