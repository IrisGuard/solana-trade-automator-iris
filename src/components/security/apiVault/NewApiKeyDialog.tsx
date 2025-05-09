
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ApiKey } from "./types";

interface NewApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addKey: (key: ApiKey) => void;
}

export const NewApiKeyDialog = ({ open, onOpenChange, addKey }: NewApiKeyDialogProps) => {
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [newKeyService, setNewKeyService] = useState("supabase");
  const [newKeyDescription, setNewKeyDescription] = useState("");
  const [newKeyExpires, setNewKeyExpires] = useState("");

  const handleAddKey = () => {
    if (!newKeyName || !newKeyValue) {
      toast.error("Συμπληρώστε όλα τα υποχρεωτικά πεδία");
      return;
    }

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: newKeyValue,
      service: newKeyService,
      createdAt: new Date().toISOString(),
      description: newKeyDescription || undefined,
      expires: newKeyExpires || undefined
    };

    addKey(newKey);
    setNewKeyName("");
    setNewKeyValue("");
    setNewKeyService("supabase");
    setNewKeyDescription("");
    setNewKeyExpires("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Προσθήκη Νέου Κλειδιού API</DialogTitle>
          <DialogDescription>
            Συμπληρώστε τα στοιχεία του νέου κλειδιού API που θέλετε να αποθηκεύσετε.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="key-name">Όνομα Κλειδιού *</Label>
            <Input 
              id="key-name" 
              placeholder="π.χ. Supabase Production" 
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="key-value">Τιμή Κλειδιού *</Label>
            <Input 
              id="key-value" 
              placeholder="eyJhbGciOiJIUzI1NiIs..." 
              value={newKeyValue}
              onChange={(e) => setNewKeyValue(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="key-service">Υπηρεσία</Label>
            <Select 
              value={newKeyService} 
              onValueChange={setNewKeyService}
            >
              <SelectTrigger id="key-service">
                <SelectValue placeholder="Επιλέξτε υπηρεσία" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="supabase">Supabase</SelectItem>
                <SelectItem value="vercel">Vercel</SelectItem>
                <SelectItem value="solana">Solana</SelectItem>
                <SelectItem value="aws">AWS</SelectItem>
                <SelectItem value="github">GitHub</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="firebase">Firebase</SelectItem>
                <SelectItem value="other">Άλλο</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="key-description">Περιγραφή</Label>
            <Input 
              id="key-description" 
              placeholder="Προαιρετική περιγραφή" 
              value={newKeyDescription}
              onChange={(e) => setNewKeyDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="key-expires">Ημερομηνία Λήξης</Label>
            <Input 
              id="key-expires" 
              type="date"
              value={newKeyExpires}
              onChange={(e) => setNewKeyExpires(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Ακύρωση</Button>
          <Button onClick={handleAddKey}>Αποθήκευση</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
