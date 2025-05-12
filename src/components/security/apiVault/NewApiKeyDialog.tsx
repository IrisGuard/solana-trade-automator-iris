import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ApiKey } from "./types";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, HelpCircle, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ApiIntegrationService } from "./ApiIntegrationService";

interface NewApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addKey: (key: ApiKey) => void;
  editKey?: ApiKey | null;
  onFinishEdit?: () => void;
}

export const NewApiKeyDialog = ({ 
  open, 
  onOpenChange, 
  addKey,
  editKey = null,
  onFinishEdit = () => {}
}: NewApiKeyDialogProps) => {
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyValue, setNewKeyValue] = useState("");
  const [newKeyService, setNewKeyService] = useState("solana");
  const [newKeyDescription, setNewKeyDescription] = useState("");
  const [newKeyExpires, setNewKeyExpires] = useState<Date | undefined>(undefined);
  const [showExampleKey, setShowExampleKey] = useState(false);
  
  useEffect(() => {
    if (open && editKey) {
      setNewKeyName(editKey.name);
      setNewKeyValue(editKey.key);
      setNewKeyService(editKey.service);
      setNewKeyDescription(editKey.description || "");
      setNewKeyExpires(editKey.expires ? new Date(editKey.expires) : undefined);
    } else if (open) {
      // Clear form when opening for a new key
      setNewKeyName("");
      setNewKeyValue("");
      setNewKeyService("solana");
      setNewKeyDescription("");
      setNewKeyExpires(undefined);
    }
  }, [open, editKey]);
  
  const handleValueChange = (value: string) => {
    setNewKeyValue(value);
    
    // Try to auto-detect service type
    const detectedService = ApiIntegrationService.detectServiceFromKey(value);
    if (detectedService) {
      setNewKeyService(detectedService);
      toast.info(`Αναγνωρίστηκε ως ${detectedService} API key`);
    }
  };

  const handleAddKey = () => {
    if (!newKeyName || !newKeyValue) {
      toast.error("Συμπληρώστε όλα τα υποχρεωτικά πεδία");
      return;
    }

    const newKey: ApiKey = {
      id: editKey ? editKey.id : Date.now().toString(),
      name: newKeyName,
      key: newKeyValue,
      service: newKeyService,
      createdAt: editKey ? editKey.createdAt : new Date().toISOString(),
      description: newKeyDescription || undefined,
      expires: newKeyExpires ? newKeyExpires.toISOString() : undefined,
      status: 'active',
      connected: false
    };

    if (editKey) {
      // Keep old properties like status if they exist
      if (editKey.status) newKey.status = editKey.status;
      if (editKey.connected) newKey.connected = editKey.connected;
      
      addKey(newKey);
      onFinishEdit();
      toast.success("Το κλειδί ενημερώθηκε επιτυχώς");
    } else {
      addKey(newKey);
      toast.success("Το νέο κλειδί προστέθηκε επιτυχώς");
    }
    
    onOpenChange(false);
  };

  const getExampleKey = () => {
    const example = ApiIntegrationService.getExampleKeyForService(newKeyService);
    return example;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            {editKey ? "Επεξεργασία Κλειδιού API" : "Προσθήκη Νέου Κλειδιού API"}
          </DialogTitle>
          <DialogDescription>
            {editKey 
              ? "Τροποποιήστε τα στοιχεία του επιλεγμένου κλειδιού API."
              : "Συμπληρώστε τα στοιχεία του νέου κλειδιού API που θέλετε να αποθηκεύσετε."
            }
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="key-name">Όνομα Κλειδιού *</Label>
            <Input 
              id="key-name" 
              placeholder="π.χ. Solana Mainnet" 
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="key-value" className="flex justify-between">
              <span>Τιμή Κλειδιού *</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-5 px-2 text-xs flex items-center gap-1"
                onClick={() => setShowExampleKey(!showExampleKey)}
              >
                <HelpCircle className="h-3 w-3" />
                {showExampleKey ? "Απόκρυψη" : "Παράδειγμα"}
              </Button>
            </Label>
            {showExampleKey && (
              <div className="text-xs bg-muted p-2 rounded font-mono mb-2">
                {getExampleKey()}
              </div>
            )}
            <Input 
              id="key-value" 
              placeholder="Εισάγετε το κλ��ιδί API" 
              value={newKeyValue}
              onChange={(e) => handleValueChange(e.target.value)}
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
                <SelectItem value="solana">Solana RPC</SelectItem>
                <SelectItem value="phantom">Phantom</SelectItem>
                <SelectItem value="solscan">Solscan</SelectItem>
                <SelectItem value="jupiter">Jupiter</SelectItem>
                <SelectItem value="helius">Helius</SelectItem>
                <SelectItem value="quicknode">QuickNode</SelectItem>
                <SelectItem value="alchemy">Alchemy</SelectItem>
                <SelectItem value="supabase">Supabase</SelectItem>
                <SelectItem value="vercel">Vercel</SelectItem>
                <SelectItem value="github">GitHub</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="firebase">Firebase</SelectItem>
                <SelectItem value="aws">AWS</SelectItem>
                <SelectItem value="google">Google API</SelectItem>
                <SelectItem value="other">Άλλο</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="key-description">Περιγραφή</Label>
            <Textarea 
              id="key-description" 
              placeholder="Προαιρετική περιγραφή του κλειδιού και της χρήσης του" 
              value={newKeyDescription}
              onChange={(e) => setNewKeyDescription(e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="key-expires">Ημερομηνία Λήξης</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !newKeyExpires && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newKeyExpires ? format(newKeyExpires, "PPP") : "Επιλέξτε ημερομηνία λήξης"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={newKeyExpires}
                  onSelect={setNewKeyExpires}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Ακύρωση</Button>
          <Button onClick={handleAddKey}>{editKey ? "Ενημέρωση" : "Αποθήκευση"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
