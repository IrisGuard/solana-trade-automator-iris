
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ApiKeysExporterProps {
  userId: string;
}

export function ApiKeysExporter({ userId }: ApiKeysExporterProps) {
  const [isEncrypted, setIsEncrypted] = React.useState(true);
  const [isExporting, setIsExporting] = React.useState(false);
  
  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Mock API key export
      setTimeout(() => {
        const data = {
          keys: [
            { name: 'Helius API Key', service: 'Helius', value: '●●●●●●●●●●●●' },
            { name: 'CoinGecko API Key', service: 'CoinGecko', value: '●●●●●●●●●●●●' }
          ],
          exportDate: new Date().toISOString(),
          encrypted: isEncrypted
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `api-keys-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        setIsExporting(false);
      }, 1500);
    } catch (error) {
      console.error('Error exporting API keys:', error);
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Εξαγωγή κλειδιών</CardTitle>
        <CardDescription>
          Εξαγωγή των API κλειδιών σας για αντίγραφο ασφαλείας
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="encrypt-export"
            checked={isEncrypted}
            onCheckedChange={(checked) => setIsEncrypted(checked as boolean)}
          />
          <Label htmlFor="encrypt-export">Κρυπτογράφηση εξαγωγής</Label>
        </div>
        
        <div className="pt-2">
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Εξαγωγή...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Εξαγωγή κλειδιών
              </>
            )}
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mt-4">
          Η εξαγωγή θα περιλαμβάνει όλα τα αποθηκευμένα API κλειδιά σας. Αν επιλέξετε κρυπτογράφηση, 
          θα χρειαστεί να εισάγετε τον κωδικό σας για να αποκτήσετε πρόσβαση στα κλειδιά κατά την εισαγωγή.
        </p>
      </CardContent>
    </Card>
  );
}
