
import React, { useState, useEffect } from "react";
import { isInitialized, autoInitialize } from "@/utils/autoInitialize";
import { Button } from "@/components/ui/button";
import { Loader2, Database } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

export function AutoInitializeStatus() {
  const [status, setStatus] = useState<'checking' | 'initialized' | 'uninitialized' | 'initializing'>('checking');
  const { user } = useAuth();

  useEffect(() => {
    checkInitStatus();
  }, [user]);

  const checkInitStatus = async () => {
    if (!user) {
      setStatus('uninitialized');
      return;
    }
    
    setStatus('checking');
    const initialized = await isInitialized();
    setStatus(initialized ? 'initialized' : 'uninitialized');
  };

  const handleAutoInitialize = async () => {
    if (!user) {
      toast.error("Παρακαλώ συνδεθείτε πρώτα");
      return;
    }
    
    setStatus('initializing');
    try {
      const success = await autoInitialize();
      
      if (success) {
        setStatus('initialized');
        
        // Ανανέωση της σελίδας για φόρτωση των νέων δεδομένων
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setStatus('uninitialized');
        toast.error("Υπήρξε πρόβλημα κατά την αρχικοποίηση");
      }
    } catch (error) {
      console.error("Σφάλμα κατά την αρχικοποίηση:", error);
      toast.error("Σφάλμα κατά την αρχικοποίηση");
      setStatus('uninitialized');
    }
  };

  if (status === 'initialized') {
    return (
      <Alert className="mb-4 bg-green-500/20 border-green-500 text-white">
        <AlertTitle className="font-medium">Η βάση δεδομένων έχει αρχικοποιηθεί</AlertTitle>
        <AlertDescription>Όλα τα δεδομένα είναι έτοιμα και μπορείτε να χρησιμοποιήσετε την εφαρμογή.</AlertDescription>
      </Alert>
    );
  }

  if (status === 'checking') {
    return (
      <Alert className="mb-4 bg-blue-500/20 border-blue-500 text-white">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertTitle className="font-medium">Έλεγχος κατάστασης βάσης δεδομένων...</AlertTitle>
        </div>
      </Alert>
    );
  }

  return (
    <Alert className="mb-4 bg-amber-500/20 border-amber-500 text-white">
      <AlertTitle className="font-medium">Η βάση δεδομένων δεν έχει αρχικοποιηθεί</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>Η βάση δεδομένων χρειάζεται αρχικοποίηση για να λειτουργήσει η εφαρμογή.</p>
        <Button
          variant="default"
          onClick={handleAutoInitialize}
          disabled={status === 'initializing' || !user}
          className="gap-2 w-fit mt-2"
        >
          {status === 'initializing' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Database className="h-4 w-4" />
          )}
          {status === 'initializing' ? "Αρχικοποίηση..." : "Αυτόματη Αρχικοποίηση Δεδομένων"}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
