
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ApiIntegrationService } from "./ApiIntegrationService";
import { ApiKey } from "./types";
import { v4 as uuidv4 } from "uuid";

interface NewApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (key: ApiKey) => void;
  existingKey?: ApiKey;
}

export function NewApiKeyDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  existingKey 
}: NewApiKeyDialogProps) {
  const [keyValue, setKeyValue] = useState(existingKey?.key || "");
  const [keyName, setKeyName] = useState(existingKey?.name || "");
  const [service, setService] = useState(existingKey?.service || "");
  const [description, setDescription] = useState(existingKey?.description || "");
  
  const handleSave = () => {
    if (!keyValue.trim() || !keyName.trim() || !service.trim()) {
      return;
    }
    
    const detectedService = service || ApiIntegrationService.detectServiceFromKey(keyValue);
    
    const apiKey: ApiKey = {
      id: existingKey?.id || uuidv4(),
      name: keyName,
      service: detectedService,
      key: keyValue,
      description,
      status: "active",
      isEncrypted: false,
      createdAt: existingKey?.createdAt || new Date().toISOString(),
    };
    
    onSave(apiKey);
    resetForm();
    onOpenChange(false);
  };
  
  const resetForm = () => {
    if (!existingKey) {
      setKeyValue("");
      setKeyName("");
      setService("");
      setDescription("");
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {existingKey ? "Επεξεργασία API Key" : "Προσθήκη Νέου API Key"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
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
          
          <div className="space-y-2">
            <Label htmlFor="key-value">API Key</Label>
            <Input
              id="key-value"
              placeholder="Εισάγετε το API Key"
              value={keyValue}
              onChange={(e) => setKeyValue(e.target.value)}
              type="password"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Περιγραφή (προαιρετικό)</Label>
            <Textarea
              id="description"
              placeholder="Περιγραφή του κλειδιού"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Ακύρωση
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!keyValue.trim() || !keyName.trim() || !service.trim()}
            >
              {existingKey ? "Αποθήκευση" : "Προσθήκη"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
