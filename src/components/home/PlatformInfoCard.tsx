
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function PlatformInfoCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Τι είναι το Solana Trade Automator;</CardTitle>
        <CardDescription>Αυτοματοποιημένο trading με τεχνολογία AI</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          Το Solana Trade Automator είναι μια προηγμένη πλατφόρμα που σας επιτρέπει να δημιουργήσετε 
          και να διαχειριστείτε αυτοματοποιημένα trading bots στο Solana blockchain, χωρίς να 
          χρειάζεται να γράψετε κώδικα.
        </p>
        <div className="bg-muted p-3 rounded-lg">
          <h4 className="font-medium mb-2">Πώς λειτουργεί το bot:</h4>
          <ul className="space-y-1 list-disc pl-5 text-sm">
            <li>Παρακολουθεί τις τιμές των επιλεγμένων tokens σε πραγματικό χρόνο</li>
            <li>Αναλύει τάσεις της αγοράς με αλγορίθμους τεχνητής νοημοσύνης</li>
            <li>Εντοπίζει ευκαιρίες αγοράς/πώλησης βάσει των παραμέτρων σας</li>
            <li>Προτείνει συναλλαγές που απαιτούν την έγκρισή σας</li>
            <li>Παρέχει αναλυτικά στατιστικά και αναφορές απόδοσης</li>
          </ul>
        </div>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/bot-control">
            Δημιουργήστε το πρώτο σας bot
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
