
import React, { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Key, AlertCircle, CheckCircle } from "lucide-react";
import { heliusService } from "@/services/helius/HeliusService";
import { Button } from "@/components/ui/button";
import { syncHeliusKeys } from "@/utils/databaseInitializer";
import { toast } from "sonner";

export function HeliusConnectionStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected' | 'syncing'>('checking');

  useEffect(() => {
    checkHeliusConnection();
  }, []);

  const checkHeliusConnection = async () => {
    setStatus('checking');
    try {
      // Try to fetch token balances for a test address
      const testAddress = '5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CmPEwKgVWr8';
      
      try {
        await heliusService.getTokenBalances(testAddress);
        setStatus('connected');
      } catch (error) {
        console.error('Helius connection test failed:', error);
        setStatus('disconnected');
      }
    } catch (error) {
      console.error('Error checking Helius connection:', error);
      setStatus('disconnected');
    }
  };

  const handleSyncKeys = async () => {
    setStatus('syncing');
    try {
      const success = await syncHeliusKeys();
      
      if (success) {
        toast.success("Τα κλειδιά Helius συγχρονίστηκαν επιτυχώς");
        await checkHeliusConnection();
      } else {
        toast.error("Δεν ήταν δυνατός ο συγχρονισμός των κλειδιών Helius");
        setStatus('disconnected');
      }
    } catch (error) {
      console.error('Error syncing Helius keys:', error);
      toast.error("Σφάλμα κατά τον συγχρονισμό των κλειδιών Helius");
      setStatus('disconnected');
    }
  };

  if (status === 'checking' || status === 'syncing') {
    return (
      <Alert className="mb-4 bg-blue-500/20 border-blue-500 text-white">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertTitle className="font-medium">
            {status === 'checking' ? 'Έλεγχος σύνδεσης Helius...' : 'Συγχρονισμός κλειδιών Helius...'}
          </AlertTitle>
        </div>
      </Alert>
    );
  }

  if (status === 'connected') {
    return (
      <Alert className="mb-4 bg-green-500/20 border-green-500 text-white">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle className="font-medium">Η σύνδεση Helius είναι ενεργή</AlertTitle>
        </div>
        <AlertDescription>
          Το API Helius είναι συνδεδεμένο και λειτουργεί κανονικά.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-4 bg-red-500/20 border-red-500 text-white">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="font-medium">Πρόβλημα σύνδεσης Helius</AlertTitle>
      </div>
      <AlertDescription className="flex flex-col gap-2">
        <p>Το API Helius δεν είναι συνδεδεμένο. Αυτό μπορεί να επηρεάσει την λειτουργικότητα της εφαρμογής.</p>
        <Button
          variant="default"
          onClick={handleSyncKeys}
          className="gap-2 w-fit mt-2"
        >
          <Key className="h-4 w-4" />
          Συγχρονισμός κλειδιών Helius
        </Button>
      </AlertDescription>
    </Alert>
  );
}
