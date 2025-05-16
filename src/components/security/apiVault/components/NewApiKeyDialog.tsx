
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApiKey } from "../types";
import { ApiIntegrationService } from "../ApiIntegrationService";

export interface NewApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddKey?: (key: ApiKey) => void;
  onUpdateKey?: (key: ApiKey) => void;
  editingKey?: ApiKey;
  testKeyFunctionality?: (key: ApiKey) => Promise<boolean>;
}

export const NewApiKeyDialog: React.FC<NewApiKeyDialogProps> = ({
  open,
  onOpenChange,
  onAddKey,
  onUpdateKey,
  editingKey,
  testKeyFunctionality
}) => {
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [service, setService] = useState("generic");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  
  useEffect(() => {
    if (editingKey) {
      setName(editingKey.name);
      setKey(editingKey.key || '');
      setService(editingKey.service);
      setDescription(editingKey.description || '');
      setStatus(editingKey.status);
    } else {
      // Reset form when opening for a new key
      setName("");
      setKey("");
      setService("generic");
      setDescription("");
      setStatus("active");
    }
  }, [editingKey, open]);

  const handleSubmit = async () => {
    const newKey: ApiKey = {
      id: editingKey?.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name,
      key,
      service,
      description,
      status,
      createdAt: editingKey?.createdAt || new Date().toISOString(),
      isWorking: undefined,
      expires: undefined,
      source: undefined,
      connected: undefined,
      permissions: []
    };
    
    if (editingKey) {
      onUpdateKey?.(newKey);
    } else {
      onAddKey?.(newKey);
    }
    
    onOpenChange(false);
  };
  
  const handleTestKey = async () => {
    if (testKeyFunctionality) {
      const testKey: ApiKey = {
        id: editingKey?.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name,
        key,
        service,
        description,
        status,
        createdAt: editingKey?.createdAt || new Date().toISOString(),
        isWorking: undefined,
        expires: undefined,
        source: undefined,
        connected: undefined,
        permissions: []
      };
      
      await testKeyFunctionality(testKey);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingKey ? "Επεξεργασία" : "Δημιουργία"} API Key</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Όνομα
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="key" className="text-right">
              Κλειδί
            </Label>
            <Input
              id="key"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="service" className="text-right">
              Υπηρεσία
            </Label>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Επιλέξτε Υπηρεσία" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="generic">Generic</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="openai">OpenAI</SelectItem>
                {/* Add more services as needed */}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Κατάσταση
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Επιλέξτε Κατάσταση" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Περιγραφή
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Ακύρωση
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            {editingKey ? "Ενημέρωση" : "Δημιουργία"}
          </Button>
          {testKeyFunctionality && (
            <Button type="button" variant="secondary" onClick={handleTestKey}>
              Test Key
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
