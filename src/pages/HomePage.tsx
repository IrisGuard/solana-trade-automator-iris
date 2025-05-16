
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, BarChart2, Settings } from 'lucide-react';

export function HomePage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col items-center text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Καλωσόρισατε στο SolWallet</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Διαχειριστείτε το πορτοφόλι σας, παρακολουθήστε συναλλαγές και χρησιμοποιήστε
          το trading bot για αυτοματοποιημένες συναλλαγές στο Solana blockchain.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="mr-2 h-5 w-5" />
              Πορτοφόλι
            </CardTitle>
            <CardDescription>
              Διαχειριστείτε τα assets σας και κάντε συναλλαγές
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Συνδέστε το πορτοφόλι Solana σας, δείτε το υπόλοιπο και τα tokens σας,
              και κάντε συναλλαγές με ασφάλεια.
            </p>
            <Button asChild>
              <Link to="/wallet">Πορτοφόλι</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart2 className="mr-2 h-5 w-5" />
              Στατιστικά
            </CardTitle>
            <CardDescription>
              Παρακολουθήστε την απόδοση και τα στατιστικά σας
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Δείτε αναλυτικά στατιστικά για τις συναλλαγές σας, την απόδοση του
              trading bot και διαγράμματα τιμών.
            </p>
            <Button asChild>
              <Link to="/dashboard">Στατιστικά</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5" />
              Ρυθμίσεις
            </CardTitle>
            <CardDescription>
              Προσαρμόστε τις ρυθμίσεις της εφαρμογής
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Ρυθμίστε τα API κλειδιά, τις παραμέτρους ασφαλείας και τις προτιμήσεις
              για την εφαρμογή σας.
            </p>
            <Button asChild>
              <Link to="/settings">Ρυθμίσεις</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
