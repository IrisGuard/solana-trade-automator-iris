
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, AlertCircle, CheckCircle, KeyRound, Globe, CreditCard } from "lucide-react";
import { initializeSystemApiKeys, addHeliusKeysForUser } from "@/utils/apiKeyInitializer";
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { HeliusStatusMonitor } from "@/components/HeliusStatusMonitor";
import { HeliusSyncButton } from "@/components/HeliusSyncButton";
import { AddApiKeyForm } from "@/components/security/AddApiKeyForm";

export default function AddHeliusKeyPage() {
  const { user } = useAuth();
  const [isInitializing, setIsInitializing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [endpointsInitialized, setEndpointsInitialized] = useState(false);
  const [keysAdded, setKeysAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("auto");

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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="auto">Αυτόματη Ρύθμιση</TabsTrigger>
          <TabsTrigger value="manual">Χειροκίνητη Προσθήκη</TabsTrigger>
        </TabsList>
        
        <TabsContent value="auto">
          <Card>
            <CardHeader>
              <CardTitle>Αυτόματη Προσθήκη API Keys</CardTitle>
              <CardDescription>
                Προσθέστε αυτόματα τα απαραίτητα κλειδιά API για τις λειτουργίες του Helius
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
        </TabsContent>
        
        <TabsContent value="manual">
          <AddApiKeyForm />
        </TabsContent>
      </Tabs>

      {/* Key Information */}
      <Card>
        <CardHeader>
          <CardTitle>Υποστηριζόμενες API Υπηρεσίες</CardTitle>
          <CardDescription>
            Πληροφορίες για τις υποστηριζόμενες υπηρεσίες API και τη χρήση τους
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <KeyRound className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">Helius API Keys</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Τα κλειδιά Helius χρησιμοποιούνται για προηγμένες λειτουργίες του Solana blockchain, όπως εμπλουτισμένες συναλλαγές και πληροφορίες token.
                </p>
                <div className="mt-2">
                  <a href="https://dev.helius.xyz/dashboard/app" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                    Απόκτηση κλειδιού Helius
                  </a>
                </div>
              </div>
              
              <div className="p-4 border rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-5 w-5 text-green-500" />
                  <h3 className="font-medium">Jupiter API Keys</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Τα κλειδιά Jupiter χρησιμοποιούνται για συναλλαγές και ανταλλαγή tokens στο Solana με βελτιστοποιημένα rates.
                </p>
                <div className="mt-2">
                  <a href="https://station.jup.ag/api-key" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                    Απόκτηση κλειδιού Jupiter
                  </a>
                </div>
              </div>
              
              <div className="p-4 border rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-5 w-5 text-purple-500" />
                  <h3 className="font-medium">Price API Keys (CoinGecko & CryptoCompare)</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Τα κλειδιά τιμών παρέχουν πληροφορίες για τις τιμές των κρυπτονομισμάτων και τα δεδομένα αγοράς.
                </p>
                <div className="mt-2 space-y-1">
                  <a href="https://www.coingecko.com/en/api/pricing" target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-500 hover:underline">
                    Απόκτηση κλειδιού CoinGecko
                  </a>
                  <a href="https://min-api.cryptocompare.com/pricing" target="_blank" rel="noopener noreferrer" className="block text-xs text-blue-500 hover:underline">
                    Απόκτηση κλειδιού CryptoCompare
                  </a>
                </div>
              </div>
              
              <div className="p-4 border rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <KeyRound className="h-5 w-5 text-amber-500" />
                  <h3 className="font-medium">Solana RPC Endpoints</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Τα RPC endpoints επιτρέπουν στην εφαρμογή να επικοινωνεί με το Solana blockchain.
                </p>
                <div className="mt-2">
                  <a href="https://solana.com/developers" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                    Απόκτηση Solana RPC endpoint
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-center text-muted-foreground">
              <p>Όλα τα κλειδιά API αποθηκεύονται με ασφάλεια στη βάση δεδομένων και χρησιμοποιούνται μόνο για τις απαραίτητες λειτουργίες της εφαρμογής.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
