
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useWalletConnect } from '@/providers/WalletConnectProvider';
import { ArrowRight } from 'lucide-react';

export function ConnectWalletScreen() {
  const { connectWallet, isConnecting } = useWalletConnect();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Συνδέστε το Πορτοφόλι σας</CardTitle>
          <CardDescription>
            Για να χρησιμοποιήσετε όλες τις λειτουργίες του SolTrader, συνδέστε το πορτοφόλι Solana σας
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Τι μπορείτε να κάνετε όταν συνδεθείτε:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary p-1 rounded-full">✓</span>
                  Δείτε τα υπόλοιπα των tokens σας
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary p-1 rounded-full">✓</span>
                  Αποστείλετε και λάβετε tokens
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary p-1 rounded-full">✓</span>
                  Ανταλλάξτε tokens με το Jupiter
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary p-1 rounded-full">✓</span>
                  Παρακολουθήστε το ιστορικό των συναλλαγών σας
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary p-1 rounded-full">✓</span>
                  Ρυθμίστε τα trading bots
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={connectWallet}
            disabled={isConnecting}
          >
            {isConnecting ? (
              "Σύνδεση..."
            ) : (
              <>
                Σύνδεση Πορτοφολιού <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Πρώτα βήματα</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">1</div>
                <div>
                  <h4 className="font-medium">Εγκατάσταση Phantom Wallet</h4>
                  <p className="text-sm text-muted-foreground">Εγκαταστήστε το Phantom Wallet αν δεν το έχετε ήδη</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">2</div>
                <div>
                  <h4 className="font-medium">Συνδέστε το πορτοφόλι σας</h4>
                  <p className="text-sm text-muted-foreground">Πατήστε το κουμπί "Σύνδεση Πορτοφολιού"</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="bg-primary/10 text-primary rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">3</div>
                <div>
                  <h4 className="font-medium">Διαχειριστείτε τα tokens σας</h4>
                  <p className="text-sm text-muted-foreground">Ξεκινήστε να διαχειρίζεστε τα Solana assets σας</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
