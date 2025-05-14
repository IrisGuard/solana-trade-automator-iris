
import { Button } from '@/components/ui/button';
import { useErrorOptions } from './ErrorOptionsContext';
import { ErrorOptions } from './ErrorOptions';
import { generateTestError, clearAllErrors } from '@/utils/errorTestUtils';

export function BasicTestTab() {
  const { errorMessage, showToast, logToConsole, sendToChat, useCollector } = useErrorOptions();
  
  const handleGenerateError = () => {
    generateTestError(errorMessage, { showToast, logToConsole, sendToChat, useCollector });
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
