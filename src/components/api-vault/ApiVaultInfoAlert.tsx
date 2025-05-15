
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; 
import { InfoIcon } from "lucide-react";

export function ApiVaultInfoAlert() {
  return (
    <Alert className="bg-primary/5 border border-primary/20">
      <InfoIcon className="h-5 w-5 text-primary" />
      <AlertTitle>Τι είναι το API Vault;</AlertTitle>
      <AlertDescription>
        Το API Vault είναι ένα ασφαλές αποθετήριο για τα API κλειδιά σας. Σας επιτρέπει να αποθηκεύετε, 
        να διαχειρίζεστε και να χρησιμοποιείτε τα κλειδιά σας για υπηρεσίες όπως το Helius, Solana RPC 
        και άλλες πλατφόρμες, χωρίς να χρειάζεται να τα εισάγετε κάθε φορά. Όλα τα κλειδιά αποθηκεύονται 
        κρυπτογραφημένα για μέγιστη ασφάλεια.
      </AlertDescription>
    </Alert>
  );
}
