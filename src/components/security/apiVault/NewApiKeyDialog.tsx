import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ApiKey } from "./types";
import { ApiIntegrationService } from "./ApiIntegrationService";
import { CheckIcon, KeyRound, AlertCircle, Database } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface NewApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addKey: (key: ApiKey) => void;
  updateKey?: (key: ApiKey) => void;
  initialKey?: ApiKey;
  testKeyFunctionality?: (key: string, service: string) => Promise<boolean>;
}

export const NewApiKeyDialog: React.FC<NewApiKeyDialogProps> = ({
  open, 
  onOpenChange,
  addKey,
  updateKey,
  initialKey,
  testKeyFunctionality
}) => {
  // Initialize state based on whether we're editing an existing key or creating a new one
  const [name, setName] = useState(initialKey?.name || "");
  const [key, setKey] = useState(initialKey?.key || "");
  const [service, setService] = useState(initialKey?.service || "other");
  const [description, setDescription] = useState(initialKey?.description || "");
  const [expirationDate, setExpirationDate] = useState(initialKey?.expires || "");
  const [isEditing, setIsEditing] = useState(Boolean(initialKey));
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);
  const [useAutoDetection, setUseAutoDetection] = useState(true);

  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (open) {
      if (initialKey) {
        // If initialKey exists, we're editing
        setName(initialKey.name);
        setKey(initialKey.key);
        setService(initialKey.service);
        setDescription(initialKey.description || "");
        setExpirationDate(initialKey.expires || "");
        setIsEditing(true);
        setUseAutoDetection(false); // Disable auto-detection when editing
      } else {
        // If no initialKey, we're creating a new key
        setName("");
        setKey("");
        setService("other");
        setDescription("");
        setExpirationDate("");
        setIsEditing(false);
        setUseAutoDetection(true);
      }
      setTestResult(null);
    }
  }, [open, initialKey]);

  // Auto-detect service when key changes and auto-detection is enabled
  React.useEffect(() => {
    if (useAutoDetection && key) {
      const detectedService = ApiIntegrationService.detectServiceFromKey(key);
      if (detectedService && detectedService !== service) {
        setService(detectedService);
      }
    }
  }, [key, useAutoDetection]);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Παρακαλώ εισάγετε ένα όνομα για το κλειδί");
      return;
    }

    if (!key.trim()) {
      toast.error("Παρακαλώ εισάγετε το κλειδί API");
      return;
    }

    const apiKey: ApiKey = {
      id: initialKey?.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: name.trim(),
      key: key.trim(),
      service: service,
      createdAt: initialKey?.createdAt || new Date().toISOString(),
      status: initialKey?.status || 'active',
      description: description.trim() || undefined,
      expires: expirationDate || undefined
    };

    if (isEditing && updateKey) {
      updateKey(apiKey);
      toast.success("Το κλειδί API ενημερώθηκε επιτυχώς");
    } else {
      addKey(apiKey);
      toast.success("Το κλειδί API προστέθηκε επιτυχώς");
    }

    onOpenChange(false);
  };

  const handleTestKey = async () => {
    if (!key.trim()) {
      toast.error("Παρακαλώ εισάγετε το κλειδί API για δοκιμή");
      return;
    }

    if (!testKeyFunctionality) {
      toast.error("Η λειτουργία δοκιμής δεν είναι διαθέσιμη");
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await testKeyFunctionality(key.trim(), service);
      setTestResult(result);
      
      if (result) {
        toast.success("Το κλειδί API είναι έγκυρο!");
      } else {
        toast.error("Το κλειδί API δεν είναι έγκυρο ή δεν έχει τα απαιτούμενα δικαιώματα");
      }
    } catch (error) {
      console.error("Error testing API key:", error);
      setTestResult(false);
      toast.error("Σφάλμα κατά τον έλεγχο του κλειδιού API");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            {isEditing ? 'Επεξεργασία Κλειδιού API' : 'Προσθήκη Νέου Κλειδιού API'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Επεξεργαστείτε τις πληροφορίες του κλειδιού API.'
              : 'Συμπληρώστε τα στοιχεία του νέου κλειδιού API.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="key-name">Όνομα Κλειδιού *</Label>
            <Input 
              id="key-name" 
              placeholder="π.χ. Helius Production API Key" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="key-value">Τιμή Κλειδιού *</Label>
            <div className="relative">
              <Input 
                id="key-value" 
                placeholder="sk_live_..." 
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="font-mono"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="auto-detect"
              checked={useAutoDetection}
              onCheckedChange={setUseAutoDetection}
              disabled={isEditing}
            />
            <Label htmlFor="auto-detect" className="text-sm cursor-pointer">Αυτόματη ανίχνευση υπηρεσίας</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="key-service">Υπηρεσία</Label>
            <Select 
              value={service} 
              onValueChange={setService}
            >
              <SelectTrigger id="key-service">
                <SelectValue placeholder="Επιλέξτε υπηρεσία" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="supabase">Supabase</SelectItem>
                <SelectItem value="helius">Helius</SelectItem>
                <SelectItem value="solana">Solana</SelectItem>
                <SelectItem value="vercel">Vercel</SelectItem>
                <SelectItem value="aws">AWS</SelectItem>
                <SelectItem value="github">GitHub</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="firebase">Firebase</SelectItem>
                <SelectItem value="google">Google API</SelectItem>
                <SelectItem value="other">Άλλο</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="key-description">Περιγραφή</Label>
            <Textarea 
              id="key-description" 
              placeholder="Προαιρετική περιγραφή του κλειδιού API..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="key-expiration">Ημερομηνία Λήξης</Label>
            <Input 
              id="key-expiration" 
              type="date" 
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
          </div>
          
          {testKeyFunctionality && (
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestKey}
                disabled={isTesting || !key.trim()}
                className="w-full"
              >
                {isTesting ? (
                  "Γίνεται έλεγχος..."
                ) : testResult === true ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckIcon className="h-4 w-4" /> Έγκυρο κλειδί
                  </span>
                ) : testResult === false ? (
                  <span className="flex items-center gap-1 text-red-600">
                    <AlertCircle className="h-4 w-4" /> Μη έγκυρο κλειδί
                  </span>
                ) : (
                  "Έλεγχος κλειδιού"
                )}
              </Button>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Ακύρωση</Button>
          <Button onClick={handleSave}>{isEditing ? 'Αποθήκευση' : 'Προσθήκη'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
