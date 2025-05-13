
import React from "react";
import { TwoFactorCard } from "@/components/security/TwoFactorCard";
import { AccountAccessCard } from "@/components/security/AccountAccessCard";
import { TransactionSecurityCard } from "@/components/security/TransactionSecurityCard";
import { SessionsCard } from "@/components/security/SessionsCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck } from "lucide-react";

export default function Security() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Ασφάλεια</h2>
        <p className="text-muted-foreground">
          Διαχειριστείτε τις ρυθμίσεις ασφαλείας και την προστασία του λογαριασμού σας
        </p>
      </div>
      
      <Alert className="bg-blue-50 border-blue-200">
        <ShieldCheck className="h-5 w-5 text-blue-500" />
        <AlertTitle>Ενισχυμένη ασφάλεια</AlertTitle>
        <AlertDescription>
          Η πλατφόρμα μας χρησιμοποιεί προηγμένα μέτρα ασφαλείας για την προστασία του λογαριασμού σας και των συναλλαγών σας.
        </AlertDescription>
      </Alert>
      
      {/* Κάρτες ασφαλείας για τους χρήστες */}
      <div className="grid gap-6 md:grid-cols-2">
        <TwoFactorCard />
        <AccountAccessCard />
      </div>
      
      <TransactionSecurityCard />
      <SessionsCard />
      
      {/* Απλοποιημένη κάρτα πληροφοριών για την ασφάλεια της πλατφόρμας */}
      <Card>
        <CardHeader>
          <CardTitle>Ασφάλεια Πλατφόρμας</CardTitle>
          <CardDescription>
            Η πλατφόρμα μας διαθέτει προηγμένα μέτρα ασφαλείας που διαχειρίζονται από την ομάδα υποστήριξης
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Ασφάλεια σε πολλαπλά επίπεδα</h4>
              <p className="text-sm text-muted-foreground">
                Η πλατφόρμα μας εφαρμόζει ασφάλεια σε πολλαπλά επίπεδα, συμπεριλαμβανομένης της κρυπτογράφησης δεδομένων και των προηγμένων ελέγχων πρόσβασης.
              </p>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Τακτικοί έλεγχοι</h4>
              <p className="text-sm text-muted-foreground">
                Πραγματοποιούμε τακτικούς ελέγχους ασφαλείας για να διασφαλίσουμε ότι το σύστημα είναι προστατευμένο από τις νεότερες απειλές.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
