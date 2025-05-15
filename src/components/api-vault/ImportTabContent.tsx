
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, InfoIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ApiKeysImporter } from "@/components/security/api-keys/ApiKeysImporter";

interface ImportTabContentProps {
  userId?: string;
}

export function ImportTabContent({ userId }: ImportTabContentProps) {
  return (
    <div className="space-y-4 mt-4">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Εισαγωγή Κλειδιών</CardTitle>
              <CardDescription>
                Εισάγετε κλειδιά από εξαγωγή ή προσθέστε νέα
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                Για την εισαγωγή κρυπτογραφημένων κλειδιών, θα χρειαστεί να εισάγετε τον κωδικό 
                κρυπτογράφησης που χρησιμοποιήσατε κατά την εξαγωγή τους.
              </AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground">
              Μπορείτε επίσης να προσθέσετε νέα API κλειδιά χειροκίνητα συμπληρώνοντας τα απαραίτητα πεδία.
            </p>
          </div>
        </CardContent>
      </Card>

      {userId && <ApiKeysImporter userId={userId} />}
    </div>
  );
}
