
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function WalletPage() {
  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Πορτοφόλι</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Συνδέστε το πορτοφόλι σας</CardTitle>
          <CardDescription>
            Συνδέστε το πορτοφόλι Solana σας για να δείτε το υπόλοιπο και να κάνετε συναλλαγές
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Wallet adapter button will be added here */}
          <p className="text-muted-foreground">
            Πατήστε το κουμπί για να συνδέσετε το πορτοφόλι σας.
          </p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Υπόλοιπο</CardTitle>
            <CardDescription>
              Το τρέχον υπόλοιπο του πορτοφολιού σας
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Συνδεθείτε για να δείτε το υπόλοιπό σας.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Συναλλαγές</CardTitle>
            <CardDescription>
              Πρόσφατες συναλλαγές
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Συνδεθείτε για να δείτε τις συναλλαγές σας.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
