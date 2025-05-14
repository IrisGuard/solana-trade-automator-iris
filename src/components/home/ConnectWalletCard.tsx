
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface ConnectWalletCardProps {
  isConnecting?: boolean;
  isPhantomInstalled?: boolean;
  onConnect?: () => Promise<void>;
}

export function ConnectWalletCard({ 
  isConnecting = false, 
  isPhantomInstalled = true,
  onConnect
}: ConnectWalletCardProps) {
  return (
    <Card className="text-center">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Wallet className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle>Συνδεθείτε με το πορτοφόλι σας</CardTitle>
        <CardDescription>
          Συνδέστε το πορτοφόλι σας για να δείτε τα περιουσιακά σας στοιχεία και να χρησιμοποιήσετε την πλατφόρμα
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-2">1. Σύνδεση Πορτοφολιού</h3>
            <p className="text-sm text-muted-foreground">
              Συνδέστε το πορτοφόλι Solana σας για να ξεκινήσετε.
            </p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-2">2. Προβολή Tokens</h3>
            <p className="text-sm text-muted-foreground">
              Δείτε και διαχειριστείτε τα tokens και το SOL σας.
            </p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-2">3. Trading Bot</h3>
            <p className="text-sm text-muted-foreground">
              Ρυθμίστε το trading bot για αυτοματοποιημένες συναλλαγές.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center pt-4">
        <Button 
          onClick={onConnect} 
          size="lg" 
          disabled={isConnecting || !isPhantomInstalled}
        >
          {isConnecting 
            ? "Σύνδεση..."
            : !isPhantomInstalled 
              ? "Εγκαταστήστε το Phantom"
              : "Σύνδεση με Πορτοφόλι"
          }
        </Button>
      </CardFooter>
    </Card>
  );
}
