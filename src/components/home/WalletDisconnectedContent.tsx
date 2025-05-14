
import React from "react";
import { ConnectWalletCard } from "./ConnectWalletCard";
import { PlatformInfoCard } from "./PlatformInfoCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface WalletDisconnectedContentProps {
  isConnecting: boolean;
  isPhantomInstalled?: boolean;
}

export function WalletDisconnectedContent({ 
  isConnecting,
  isPhantomInstalled = true,
}: WalletDisconnectedContentProps) {
  return (
    <div className="space-y-6">
      {!isPhantomInstalled && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Το Phantom Wallet δεν είναι εγκατεστημένο. Παρακαλώ εγκαταστήστε το για να συνδεθείτε.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Grid content */}
      <div className="grid md:grid-cols-2 gap-6">
        <ConnectWalletCard 
          isConnecting={isConnecting}
          isPhantomInstalled={isPhantomInstalled}
        />
        <PlatformInfoCard />
      </div>

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>Καλώς ήρθατε στο Solana Trade Automator</CardTitle>
          <CardDescription>
            Για να χρησιμοποιήσετε όλες τις λειτουργίες της εφαρμογής, παρακαλώ συνδεθείτε με το Phantom Wallet σας
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              Το Solana Trade Automator είναι μια εφαρμογή για αυτοματοποιημένες συναλλαγές στο δίκτυο Solana.
              Μπορείτε να περιηγηθείτε σε κάποιες σελίδες χωρίς σύνδεση, αλλά για πλήρη λειτουργικότητα απαιτείται σύνδεση με wallet.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <Link to="/home" className="text-primary hover:underline text-center py-2 border rounded-md hover:bg-primary/5">
                Προβολή Dashboard
              </Link>
              <Link to="/help" className="text-primary hover:underline text-center py-2 border rounded-md hover:bg-primary/5">
                Οδηγίες Χρήσης
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
