
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { isInitialized, autoInitialize } from '@/utils/autoInitialize';
import { Loader2 } from 'lucide-react';
import { syncAllHeliusData } from '@/utils/syncHeliusKeys';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AppInitializerProps {
  children: React.ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const { user, loading: authLoading } = useAuth();
  const [initializing, setInitializing] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [initAttempts, setInitAttempts] = useState(0);
  const [supabaseConnected, setSupabaseConnected] = useState<boolean | null>(null);
  
  // Check Supabase connection
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        setSupabaseConnected(!error);
      } catch (e) {
        console.error('Failed to check Supabase connection:', e);
        setSupabaseConnected(false);
      }
    };
    
    checkConnection();
  }, []);
  
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
          
          // Reload the page after successful initialization to ensure all components
          // load with the correct configuration
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          console.warn('Initialization partially failed');
          // We'll consider it initialized anyway to avoid blocking the app
          setInitialized(true);
          
          // Try to sync Helius keys one more time
          if (user) {
            syncAllHeliusData(user.id).catch(err => {
              console.error('Error during additional Helius sync attempt:', err);
            });
          }
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

  // If no connection to Supabase, show warning
  if (supabaseConnected === false) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-4 z-50 text-center">
          <h2 className="text-lg font-bold mb-2">Δεν είναι δυνατή η σύνδεση με τη βάση δεδομένων</h2>
          <p>Η εφαρμογή ενδέχεται να μη λειτουργεί σωστά. Παρακαλώ ελέγξτε τη σύνδεσή σας και ανανεώστε τη σελίδα.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-white text-red-600 px-4 py-2 rounded mt-2 font-medium"
          >
            Ανανέωση σελίδας
          </button>
        </div>
        {children}
      </>
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
