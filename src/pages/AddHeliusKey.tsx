
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { initializeSystemApiKeys, addHeliusKeysForUser } from "@/utils/apiKeyInitializer";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { HeliusStatusMonitor } from "@/components/HeliusStatusMonitor";
import { HeliusSyncButton } from "@/components/HeliusSyncButton";

export default function AddHeliusKeyPage() {
  const { user } = useAuth();
  const [isInitializing, setIsInitializing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [endpointsInitialized, setEndpointsInitialized] = useState(false);
  const [keysAdded, setKeysAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize system endpoints on page load
  useEffect(() => {
    const init = async () => {
      setIsInitializing(true);
      try {
        const result = await initializeSystemApiKeys();
        setEndpointsInitialized(result);
      } catch (err) {
        console.error('Error initializing API endpoints:', err);
        setError('Σφάλμα κατά την αρχικοποίηση των endpoints. Παρακαλώ δοκιμάστε ξανά.');
      } finally {
        setIsInitializing(false);
      }
    };

    init();
  }, []);

  // Handle adding keys to the user's account
  const handleAddKeys = async () => {
    if (!user) {
      setError('Πρέπει να συνδεθείτε για να προσθέσετε κλειδιά');
      return;
    }

    setIsAdding(true);
    setError(null);
    
    try {
      const result = await addHeliusKeysForUser(user.id);
      setKeysAdded(result);
      
      if (!result) {
        setError('Υπήρξε πρόβλημα κατά την προσθήκη των κλειδιών');
      }
    } catch (err) {
      console.error('Error adding API keys:', err);
      setError('Σφάλμα κατά την προσθήκη των κλειδιών API');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Προσθήκη API Κλειδιών</h1>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Σφάλμα</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Προσθήκη Helius API Keys</CardTitle>
          <CardDescription>
            Προσθέστε τα απαραίτητα κλειδιά API για τις λειτουργίες του Helius
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                Βήμα 1: Αρχικοποίηση API Endpoints
              </p>
            </div>
            <div>
              {isInitializing ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : endpointsInitialized ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Button variant="outline" size="sm" disabled={isInitializing} onClick={() => initializeSystemApiKeys()}>
                  Αρχικοποίηση
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                Βήμα 2: Προσθήκη API Κλειδιών στο λογαριασμό σας
              </p>
            </div>
            <div>
              {!user ? (
                <Button variant="outline" size="sm" disabled>
                  Συνδεθείτε πρώτα
                </Button>
              ) : isAdding ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : keysAdded ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Button variant="outline" size="sm" disabled={isAdding || !endpointsInitialized} onClick={handleAddKeys}>
                  Προσθήκη Κλειδιών
                </Button>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={() => window.history.back()}>
            Επιστροφή
          </Button>
          <Button 
            disabled={!keysAdded} 
            onClick={() => window.location.href = '/api-vault'}
          >
            Προβολή Όλων των Κλειδιών
          </Button>
        </CardFooter>
      </Card>

      {/* Status monitor component */}
      {keysAdded && <HeliusStatusMonitor />}

      {/* Add sync button if keys are added */}
      {keysAdded && (
        <div className="flex justify-end">
          <HeliusSyncButton />
        </div>
      )}

      {/* Key Information */}
      <Card>
        <CardHeader>
          <CardTitle>Πληροφορίες API Κλειδιών</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Helius API Keys</h3>
              <p className="text-sm text-muted-foreground">
                Τα κλειδιά Helius χρησιμοποιούνται για προηγμένες λειτουργίες του Solana blockchain, όπως εμπλουτισμένες συναλλαγές και πληροφορίες token.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">Price API Keys</h3>
              <p className="text-sm text-muted-foreground">
                Τα κλειδιά τιμών (CoinGecko, CryptoCompare) παρέχουν πληροφορίες για τις τιμές των κρυπτονομισμάτων και τα δεδομένα αγοράς.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">Solana RPC Endpoints</h3>
              <p className="text-sm text-muted-foreground">
                Τα RPC endpoints επιτρέπουν στην εφαρμογή να επικοινωνεί με το Solana blockchain.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
