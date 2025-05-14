import { Button } from '@/components/ui/button';
import { useErrorOptions } from './ErrorOptionsContext';
import { displayError } from '@/utils/error-handling/displayError';
import { createEnhancedError } from '@/types/errorTypes';
import { generateVariousErrors, clearAllErrors } from '@/utils/errorTestUtils';
import { Globe, Lock, File, FileX } from 'lucide-react';

export function AdvancedTestTab() {
  const { showToast, logToConsole, sendToChat, useCollector } = useErrorOptions();
  
  const handleNetworkError = () => {
    // Προσομοίωση σφάλματος δικτύου με μια αποτυχημένη κλήση fetch
    fetch('https://non-existent-domain-123456789.com')
      .then(response => response.json())
      .catch(error => {
        displayError(error, {
          title: 'Σφάλμα δικτύου',
          showToast,
          logToConsole,
          sendToChat,
          useCollector
        });
      });
  };
  
  const handleApiError = () => {
    // Προσομοίωση σφάλματος API
    const apiError = createEnhancedError('Δεν έχετε δικαιώματα πρόσβασης σε αυτόν τον πόρο', {
      status: 403,
      code: 'FORBIDDEN'
    });
    
    displayError(apiError, {
      title: 'Σφάλμα API',
      showToast,
      logToConsole,
      sendToChat,
      useCollector
    });
  };
  
  const handleValidationError = () => {
    // Προσομοίωση σφάλματος επικύρωσης
    const validationError = createEnhancedError('Μη έγκυρα δεδομένα φόρμας', {
      errors: {
        username: ['Το όνομα χρήστη είναι υποχρεωτικό'],
        email: ['Μη έγκυρη διεύθυνση email'],
        password: ['Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες']
      }
    });
    
    displayError(validationError, {
      title: 'Σφάλμα επικύρωσης φόρμας',
      showToast,
      logToConsole,
      sendToChat,
      useCollector
    });
  };
  
  const handleDatabaseError = () => {
    // Προσομοίωση σφάλματος βάσης δεδομένων
    const dbError = createEnhancedError('Σφάλμα βάσης δεδομένων', {
      details: 'Foreign key constraint violation',
      table: 'users',
      constraint: 'users_profile_id_fkey'
    });
    
    displayError(dbError, {
      title: 'Σφάλμα βάσης δεδομένων',
      showToast,
      logToConsole,
      sendToChat,
      useCollector
    });
  };
  
  const handleRuntimeError = () => {
    try {
      // Προκαλώ σκόπιμα ένα σφάλμα runtime
      const obj: any = null;
      obj.someProperty = 'test';
    } catch (error) {
      displayError(error as Error, {
        title: 'Runtime Error',
        showToast,
        logToConsole,
        sendToChat,
        useCollector
      });
    }
  };

  // New error test cases
  const handleInternationalizationError = () => {
    const i18nError = createEnhancedError('Missing translation key', {
      key: 'settings.advancedOptions.enableDebugMode',
      locale: 'fr',
      availableLocales: ['en', 'el'],
      context: 'Settings page'
    });
    
    displayError(i18nError, {
      title: 'Internationalization Error',
      showToast,
      logToConsole,
      sendToChat,
      useCollector
    });
  };
  
  const handleAuthenticationError = () => {
    const authError = createEnhancedError('Authentication failed', {
      code: 'AUTH_INVALID_SESSION',
      status: 401,
      description: 'Session expired or invalid',
      attemptedAction: 'access protected resource'
    });
    
    displayError(authError, {
      title: 'Authentication Error',
      showToast,
      logToConsole,
      sendToChat,
      useCollector
    });
  };
  
  const handleFileUploadError = () => {
    const fileError = createEnhancedError('File upload failed', {
      code: 'FILE_TOO_LARGE',
      maxSize: '5MB',
      actualSize: '10.2MB',
      fileName: 'large_document.pdf',
      fileType: 'application/pdf'
    });
    
    displayError(fileError, {
      title: 'File Upload Error',
      showToast,
      logToConsole,
      sendToChat,
      useCollector
    });
  };
  
  const handleFileMissingError = () => {
    const missingFileError = createEnhancedError('Required file not found', {
      code: 'FILE_NOT_FOUND',
      path: '/uploads/user/profile/avatar.jpg',
      requestedBy: 'ProfileComponent',
      timestamp: Date.now()
    });
    
    displayError(missingFileError, {
      title: 'Missing File Error',
      showToast,
      logToConsole,
      sendToChat,
      useCollector
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button onClick={handleNetworkError} variant="outline" className="w-full">
          Σφάλμα Δικτύου
        </Button>
        
        <Button onClick={handleApiError} variant="outline" className="w-full">
          Σφάλμα API
        </Button>
        
        <Button onClick={handleValidationError} variant="outline" className="w-full">
          Σφάλμα Επικύρωσης
        </Button>
        
        <Button onClick={handleDatabaseError} variant="outline" className="w-full">
          Σφάλμα Βάσης Δεδομένων
        </Button>
        
        <Button onClick={handleRuntimeError} variant="outline" className="w-full">
          Runtime Error
        </Button>
        
        <Button onClick={generateVariousErrors} variant="outline" className="w-full">
          Διάφορα Σφάλματα
        </Button>
        
        {/* New error buttons */}
        <Button 
          onClick={handleInternationalizationError} 
          variant="outline" 
          className="w-full flex items-center gap-2"
        >
          <Globe className="h-4 w-4" /> Internationalization Error
        </Button>
        
        <Button 
          onClick={handleAuthenticationError} 
          variant="outline" 
          className="w-full flex items-center gap-2"
        >
          <Lock className="h-4 w-4" /> Authentication Error
        </Button>
        
        <Button 
          onClick={handleFileUploadError} 
          variant="outline" 
          className="w-full flex items-center gap-2"
        >
          <File className="h-4 w-4" /> File Upload Error
        </Button>
        
        <Button 
          onClick={handleFileMissingError} 
          variant="outline" 
          className="w-full flex items-center gap-2"
        >
          <FileX className="h-4 w-4" /> Missing File Error
        </Button>
      </div>
      
      <Button onClick={clearAllErrors} variant="destructive" className="w-full">
        Καθαρισμός Όλων των Σφαλμάτων
      </Button>
    </div>
  );
}
