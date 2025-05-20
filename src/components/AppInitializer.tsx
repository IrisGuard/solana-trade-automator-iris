
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { isInitialized, autoInitialize } from '@/utils/autoInitialize';
import { Loader2 } from 'lucide-react';
import { syncAllHeliusData } from '@/utils/syncHeliusKeys';
import { toast } from 'sonner';

interface AppInitializerProps {
  children: React.ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const { user, loading: authLoading } = useAuth();
  const [initializing, setInitializing] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [initAttempts, setInitAttempts] = useState(0);
  
  // Check and initialize the application
  useEffect(() => {
    const checkAndInitialize = async () => {
      // Skip if already initializing or auth is still loading
      if (initializing || authLoading) {
        return;
      }
      
      // If no user, can't initialize yet
      if (!user) {
        if (initAttempts > 0) {
          console.log('No user available after attempts, initialization delayed');
        }
        return;
      }
      
      // Check if already initialized
      try {
        const alreadyInitialized = await isInitialized();
        if (alreadyInitialized) {
          console.log('Application already initialized');
          setInitialized(true);
          
          // Still sync Helius data to ensure it's up to date
          syncAllHeliusData(user.id).catch(err => {
            console.error('Error syncing Helius data during initial check:', err);
          });
          
          return;
        }
      } catch (err) {
        console.error('Error checking initialization status:', err);
      }
      
      // Only try initialization a limited number of times
      if (initAttempts >= 3) {
        console.error('Maximum initialization attempts reached');
        toast.error('Αδυναμία αρχικοποίησης της εφαρμογής', {
          description: 'Παρακαλώ χρησιμοποιήστε το κουμπί χειροκίνητης αρχικοποίησης'
        });
        return;
      }
      
      // Attempt initialization
      setInitializing(true);
      setInitAttempts(prev => prev + 1);
      
      try {
        console.log(`Initialization attempt ${initAttempts + 1}`);
        const success = await autoInitialize();
        
        if (success) {
          console.log('Application initialized successfully');
          setInitialized(true);
        } else {
          console.warn('Initialization partially failed');
          // We'll consider it initialized anyway to avoid blocking the app
          setInitialized(true);
        }
      } catch (err) {
        console.error('Error during initialization:', err);
      } finally {
        setInitializing(false);
      }
    };
    
    // Delay first check to ensure auth is ready
    const timer = setTimeout(checkAndInitialize, 1000);
    
    return () => clearTimeout(timer);
  }, [user, authLoading, initializing, initAttempts]);

  // If still loading auth, show minimal loader
  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If initializing, show progress indicator but still render children
  return (
    <>
      {initializing && (
        <div className="fixed top-4 right-4 bg-primary/20 rounded-md p-2 z-50 flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-sm font-medium">Αρχικοποίηση...</span>
        </div>
      )}
      {children}
    </>
  );
}
