
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ApiKeysImporterProps {
  userId: string;
}

export function ApiKeysImporter({ userId }: ApiKeysImporterProps) {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isImporting, setIsImporting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };
  
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleImport = async () => {
    if (!selectedFile) {
      toast.error("Παρακαλώ επιλέξτε ένα αρχείο για εισαγωγή");
      return;
    }
    
    setIsImporting(true);
    try {
      // Mock import process
      setTimeout(() => {
        toast.success("Τα κλειδιά εισάχθηκαν με επιτυχία");
        setSelectedFile(null);
        setIsImporting(false);
      }, 1500);
    } catch (error) {
      console.error('Error importing API keys:', error);
      toast.error("Σφάλμα κατά την εισαγωγή των κλειδιών");
      setIsImporting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Εισαγωγή κλειδιών</CardTitle>
        <CardDescription>
          Εισαγωγή API κλειδιών από εξαγωγή αντιγράφου ασφαλείας
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="api-keys-file">Αρχείο κλειδιών</Label>
          <div className="flex items-center gap-2">
            <Input
              ref={fileInputRef}
              id="api-keys-file"
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleImportClick}
              disabled={isImporting}
            >
              <Upload className="mr-2 h-4 w-4" />
              Επιλογή αρχείου
            </Button>
            <Button
              onClick={handleImport}
              disabled={!selectedFile || isImporting}
            >
              {isImporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Εισαγωγή"
              )}
            </Button>
          </div>
          {selectedFile && (
            <p className="text-sm text-muted-foreground">
              Επιλεγμένο αρχείο: {selectedFile.name}
            </p>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground mt-4">
          Τα εισαγόμενα κλειδιά θα προστεθούν στη βάση δεδομένων σας. Αν υπάρχουν ήδη κλειδιά με 
          τα ίδια ονόματα και υπηρεσίες, θα ενημερωθούν με τις νέες τιμές.
        </p>
      </CardContent>
    </Card>
  );
}
