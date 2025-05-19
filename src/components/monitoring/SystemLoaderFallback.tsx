
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

export function SystemLoaderFallback() {
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [countdown, setCountdown] = useState(30);
  
  useEffect(() => {
    // Check if the app has loaded within a reasonable timeframe
    const appReadyCheck = setTimeout(() => {
      const appLoaded = document.getElementById('monitoring-ready');
      if (!appLoaded) {
        setStatus('error');
        setError(new Error('Η εφαρμογή δεν φορτώθηκε εντός του αναμενόμενου χρονικού διαστήματος'));
      } else {
        setStatus('ready');
      }
    }, 10000);
    
    // Start countdown timer
    const countdownTimer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      clearTimeout(appReadyCheck);
      clearInterval(countdownTimer);
    };
  }, []);
  
  const handleManualReload = () => {
    window.location.reload();
  };
  
  if (status === 'ready') {
    return (
      <div className="fixed bottom-4 right-4 bg-green-100 p-3 rounded-lg shadow-lg flex items-center gap-2 text-green-700 transition-opacity opacity-80 hover:opacity-100">
        <CheckCircle className="h-5 w-5" />
        <span>Το σύστημα φορτώθηκε επιτυχώς</span>
      </div>
    );
  }
  
  if (status === 'error') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/95 z-50">
        <div className="w-full max-w-md space-y-4 p-6 bg-card rounded-lg shadow-lg">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-6 w-6" />
            <h2 className="text-xl font-bold">Πρόβλημα φόρτωσης</h2>
          </div>
          
          <Alert variant="destructive" className="mb-4">
            <p>Η εφαρμογή δεν μπόρεσε να φορτωθεί σωστά. Παρακαλώ προσπαθήστε να επαναφορτώσετε τη σελίδα.</p>
            {error && <p className="text-sm mt-2 opacity-80">{error.message}</p>}
          </Alert>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStatus('loading')}>
              Συνέχεια αναμονής
            </Button>
            <Button onClick={handleManualReload} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Επαναφόρτωση
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Loading state
  return (
    <div className="fixed bottom-4 right-4 bg-card p-3 rounded-lg shadow-lg transition-opacity opacity-80 hover:opacity-100">
      <div className="flex items-center gap-3">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
        <span>Φόρτωση συστήματος ({countdown}s)...</span>
      </div>
    </div>
  );
}
