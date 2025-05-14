
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  generateTestError, 
  generateVariousErrors, 
  clearAllErrors 
} from '@/utils/errorTestUtils';
import { displayError } from '@/utils/errorUtils';
import { EnhancedError, createEnhancedError } from '@/types/errorTypes';

export function ErrorTestPanel() {
  const [errorMessage, setErrorMessage] = useState('Δοκιμαστικό σφάλμα');
  const [showToast, setShowToast] = useState(true);
  const [logToConsole, setLogToConsole] = useState(true);
  const [sendToChat, setSendToChat] = useState(true);
  const [useCollector, setUseCollector] = useState(false);
  
  const handleGenerateError = () => {
    generateTestError(errorMessage, { showToast, logToConsole, sendToChat, useCollector });
  };
  
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
  
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Δοκιμή Συστήματος Σφαλμάτων</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Βασική Δοκιμή</TabsTrigger>
            <TabsTrigger value="advanced">Προχωρημένες Δοκιμές</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="errorMessage">Μήνυμα Σφάλματος</Label>
              <Input 
                id="errorMessage" 
                value={errorMessage} 
                onChange={(e) => setErrorMessage(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <label className="inline-flex items-center">
                <input 
                  type="checkbox"
                  checked={showToast}
                  onChange={() => setShowToast(!showToast)}
                  className="mr-2"
                />
                Εμφάνιση Toast
              </label>
              <label className="inline-flex items-center">
                <input 
                  type="checkbox"
                  checked={logToConsole}
                  onChange={() => setLogToConsole(!logToConsole)}
                  className="mr-2"
                />
                Καταγραφή στην κονσόλα
              </label>
              <label className="inline-flex items-center">
                <input 
                  type="checkbox"
                  checked={sendToChat}
                  onChange={() => setSendToChat(!sendToChat)}
                  className="mr-2"
                />
                Αποστολή στο Chat
              </label>
              <label className="inline-flex items-center">
                <input 
                  type="checkbox"
                  checked={useCollector}
                  onChange={() => setUseCollector(!useCollector)}
                  className="mr-2"
                />
                Χρήση Collector
              </label>
            </div>
            
            <Button onClick={handleGenerateError} className="w-full">
              Δημιουργία Σφάλματος
            </Button>
            
            <Button onClick={clearAllErrors} variant="outline" className="w-full">
              Καθαρισμός Σφαλμάτων
            </Button>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4 pt-4">
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
            </div>
            
            <Button onClick={clearAllErrors} variant="destructive" className="w-full">
              Καθαρισμός Όλων των Σφαλμάτων
            </Button>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Χρησιμοποιήστε αυτό το panel για να δοκιμάσετε την καταγραφή και εμφάνιση σφαλμάτων. 
            Τα σφάλματα θα εμφανιστούν ως toast μηνύματα, στην κονσόλα του περιηγητή 
            και θα αποσταλούν στο chat για ανάλυση.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
