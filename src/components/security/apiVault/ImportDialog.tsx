import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiIntegrationService } from "./ApiIntegrationService";
import { ApiKey } from "./types";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@/contexts/SupabaseAuthContext";

interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (keys: ApiKey[]) => void;
}

export function ImportDialog({ open, onOpenChange, onImport }: ImportDialogProps) {
  const [apiKeyValue, setApiKeyValue] = useState("");
  const [keyName, setKeyName] = useState("");
  const [service, setService] = useState("generic");
  const { user } = useAuth();
  
  const handleImport = () => {
    if (!apiKeyValue.trim()) return;
    if (!user) return;
    
    const lines = apiKeyValue.split('\n').filter(line => line.trim());
    
    if (lines.length > 1) {
      // Multiple keys
      const keys: ApiKey[] = lines.map(line => {
        const detectedService = ApiIntegrationService.detectServiceFromKey(line);
        return {
          id: uuidv4(),
          name: `Imported ${detectedService} key`,
          service: detectedService,
          key: line.trim(),
          description: "Imported via bulk import",
          status: "active",
          isEncrypted: false,
          createdAt: new Date().toISOString(),
        };
      });
      
      onImport(keys);
    } else {
      // Single key
      const key: ApiKey = {
        id: uuidv4(),
        name: keyName || `Imported ${service} key`,
        service: service || ApiIntegrationService.detectServiceFromKey(apiKeyValue),
        key: apiKeyValue.trim(),
        description: "Imported manually",
        status: "active",
        isEncrypted: false,
        createdAt: new Date().toISOString(),
      };
      
      onImport([key]);
    }
    
    // Reset form
    setApiKeyValue("");
    setKeyName("");
    setService("generic");
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Εισαγωγή API Key</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Textarea
              id="api-key"
              placeholder="Επικολλήστε το API key εδώ..."
              value={apiKeyValue}
              onChange={(e) => setApiKeyValue(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Μπορείτε να εισάγετε πολλαπλά keys, ένα σε κάθε γραμμή.
            </p>
          </div>
          
          {apiKeyValue.includes('\n') ? null : (
            <>
              <div className="space-y-2">
                <Label htmlFor="key-name">Όνομα</Label>
                <Input
                  id="key-name"
                  placeholder="Όνομα του κλειδιού"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="service">Υπηρεσία</Label>
                <Input
                  id="service"
                  placeholder="Υπηρεσία (π.χ. stripe, openai)"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                />
              </div>
            </>
          )}
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Ακύρωση
            </Button>
            <Button onClick={handleImport} disabled={!apiKeyValue.trim()}>
              Εισαγωγή
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
