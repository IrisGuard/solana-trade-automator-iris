
import React from "react";
import { TwoFactorCard } from "@/components/security/TwoFactorCard";
import { AccountAccessCard } from "@/components/security/AccountAccessCard";
import { TransactionSecurityCard } from "@/components/security/TransactionSecurityCard";
import { SessionsCard } from "@/components/security/SessionsCard";
import { PlatformSecurityCard } from "@/components/security/PlatformSecurityCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck } from "lucide-react";

export default function Security() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gradient mb-1">Ασφάλεια</h2>
        <p className="text-muted-foreground">
          Διαχειριστείτε τις ρυθμίσεις ασφαλείας και την προστασία του λογαριασμού σας
        </p>
      </div>
      
      <Alert className="bg-primary/5 border border-primary/20">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <AlertTitle className="text-foreground">Ενισχυμένη ασφάλεια</AlertTitle>
        <AlertDescription className="text-foreground/90">
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
      <PlatformSecurityCard />
      
      {/* Απλοποιημένη κάρτα πληροφοριών για την ασφάλεια της πλατφόρμας */}
      <Card className="card-highlight">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Ασφάλεια Πλατφόρμας</CardTitle>
          <CardDescription>
            Η πλατφόρμα μας διαθέτει προηγμένα μέτρα ασφαλείας που διαχειρίζονται από την ομάδα υποστήριξης
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-foreground">Ασφάλεια σε πολλαπλά επίπεδα</h4>
              <p className="text-sm text-muted-foreground">
                Η πλατφόρμα μας εφαρμόζει ασφάλεια σε πολλαπλά επίπεδα, συμπεριλαμβανομένης της κρυπτογράφησης δεδομένων και των προηγμένων ελέγχων πρόσβασης.
              </p>
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-foreground">Τακτικοί έλεγχοι</h4>
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
