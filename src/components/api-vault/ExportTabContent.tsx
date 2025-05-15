
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, InfoIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ApiKeysExporter } from "@/components/security/api-keys/ApiKeysExporter";

interface ExportTabContentProps {
  userId?: string;
}

export function ExportTabContent({ userId }: ExportTabContentProps) {
  return (
    <div className="space-y-4 mt-4">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Ασφαλής Εξαγωγή Κλειδιών</CardTitle>
              <CardDescription>
                Εξάγετε τα API κλειδιά σας με κρυπτογράφηση για ασφαλή αποθήκευση
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                Η εξαγωγή των API κλειδιών σας γίνεται με κρυπτογράφηση για μέγιστη ασφάλεια. 
                Θα χρειαστεί να ορίσετε έναν κωδικό κρυπτογράφησης που θα χρησιμοποιήσετε για 
                να εισάγετε ξανά τα κλειδιά αργότερα.
              </AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground">
              Η εξαγωγή είναι χρήσιμη για τη μεταφορά των κλειδιών σας σε άλλη εγκατάσταση της πλατφόρμας 
              ή ως αντίγραφο ασφαλείας.
            </p>
          </div>
        </CardContent>
      </Card>

      {userId && <ApiKeysExporter userId={userId} />}
    </div>
  );
}
