
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ApiKey } from "./types";
import { Upload, FileUp } from "lucide-react";
import { ApiIntegrationService } from "./ApiIntegrationService";

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (keys: ApiKey[]) => void;
}

export const ImportDialog: React.FC<ImportDialogProps> = ({ open, onOpenChange, onImport }) => {
  const [importData, setImportData] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleImportKeys = () => {
    if (!importData.trim()) {
      setParseError("Παρακαλώ εισάγετε δεδομένα για εισαγωγή");
      return;
    }

    try {
      let importedKeys: any[] = [];
      
      try {
        // Try parsing as JSON
        importedKeys = JSON.parse(importData);
      } catch (e) {
        // Try parsing as text with format "name|key|service" (one per line)
        importedKeys = importData.split("\n").map(line => {
          const parts = line.split("|").map(s => s.trim());
          if (parts.length >= 2) {
            const service = parts.length >= 3 ? parts[2] : ApiIntegrationService.detectServiceFromKey(parts[1]) || 'other';
            return {
              name: parts[0],
              key: parts[1],
              service: service
            };
          }
          return null;
        }).filter(Boolean);
      }
      
      if (!Array.isArray(importedKeys) || importedKeys.length === 0) {
        setParseError("Μη έγκυρη μορφή δεδομένων");
        return;
      }
      
      // Validate keys
      const validKeys = importedKeys.filter((key: any) => key && key.name && key.key);
      
      if (validKeys.length === 0) {
        setParseError("Δεν βρέθηκαν έγκυρα κλειδιά");
        return;
      }
      
      setParseError(null);
      
      // Add missing properties
      const newKeys: ApiKey[] = validKeys.map((key: any) => ({
        id: key.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: key.name,
        key: key.key,
        service: key.service || ApiIntegrationService.detectServiceFromKey(key.key) || 'other',
        createdAt: key.createdAt || new Date().toISOString(),
        status: key.status || 'active',
        description: key.description,
        expires: key.expires
      }));
      
      onImport(newKeys);
      setImportData("");
      onOpenChange(false);
      
      toast.success(`Εισήχθησαν ${newKeys.length} κλειδιά επιτυχώς`);
    } catch (e) {
      console.error('Error importing keys:', e);
      setParseError("Σφάλμα κατά την εισαγωγή κλειδιών");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportData(content || "");
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setImportData(content || "");
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Μαζική Εισαγωγή Κλειδιών API
          </DialogTitle>
          <DialogDescription>
            Εισάγετε κλειδιά σε μορφή JSON ή κείμενο με διαχωριστικό (|)
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={handleButtonClick}
          >
            <div className="flex flex-col items-center space-y-2">
              <FileUp className={`h-10 w-10 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
              <h3 className="font-medium">Σύρετε αρχείο ή κάντε κλικ για μεταφόρτωση</h3>
              <p className="text-sm text-muted-foreground">
                Υποστηρίζονται αρχεία JSON και TXT
              </p>
            </div>
            <input 
              ref={inputRef}
              type="file" 
              onChange={handleFileUpload}
              accept=".json,.txt"
              className="hidden" 
            />
          </div>
          
          <div className="space-y-2">
            <Textarea 
              placeholder={`[
  {
    "name": "AWS Key",
    "service": "aws",
    "key": "AKIAIOSFODNN7EXAMPLE"
  },
  {
    "name": "Github Token",
    "service": "github",
    "key": "ghp_xxxxxxxxxxxxxxxx"
  }
]

ή

OpenAI Key|sk-xxxxxxxxxxxxxxxxxxxx|openai
Stripe Test|sk_test_xxxxxxxxxxxxx|stripe`}
              value={importData}
              onChange={(e) => {
                setImportData(e.target.value);
                setParseError(null);
              }}
              rows={10}
              className="font-mono text-sm"
            />
            
            {parseError && (
              <div className="text-sm text-red-500">
                {parseError}
              </div>
            )}
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Μπορείτε να εισάγετε κλειδιά με τους εξής τρόπους:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Μορφή JSON: Πίνακας αντικειμένων με πεδία name, key, service</li>
              <li>Απλό κείμενο: Κάθε γραμμή μία εγγραφή με μορφή "Όνομα|Κλειδί|Υπηρεσία"</li>
              <li>Το πεδίο service είναι προαιρετικό - το σύστημα θα προσπαθήσει να αναγνωρίσει αυτόματα τον τύπο του κλειδιού</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Ακύρωση</Button>
          <Button onClick={handleImportKeys}>Εισαγωγή</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
