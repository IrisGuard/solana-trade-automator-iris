
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function PlatformInfoCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Τι είναι το Solana Trade Automator;</CardTitle>
        <CardDescription>Μια εισαγωγή στην πλατφόρμα μας</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          Το Solana Trade Automator σας επιτρέπει να δημιουργήσετε και να διαχειριστείτε 
          αυτοματοποιημένα trading bots στο Solana blockchain, χωρίς να χρειάζεται να γράψετε κώδικα.
        </p>
        <div className="bg-muted p-3 rounded-lg">
          <h4 className="font-medium mb-2">Βασικά Χαρακτηριστικά:</h4>
          <ul className="space-y-1 list-disc pl-5 text-sm">
            <li>Αυτοματοποιημένες αγορές και πωλήσεις με βάση τις στρατηγικές σας</li>
            <li>Παρακολούθηση τιμών και ευκαιριών σε πραγματικό χρόνο</li>
            <li>Διαχείριση πολλαπλών bots ταυτόχρονα</li>
            <li>Στατιστικά και αναλύσεις της απόδοσης των bots</li>
            <li>Ασφαλής διαχείριση API κλειδιών για συνδέσεις με ανταλλακτήρια</li>
          </ul>
        </div>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/dashboard">
            Εξερευνήστε το Dashboard
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
