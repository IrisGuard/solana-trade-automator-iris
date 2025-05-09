
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface SecuritySettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEncryptionEnabled: boolean;
  setIsEncryptionEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  savedMasterPassword: string;
  setSavedMasterPassword: React.Dispatch<React.SetStateAction<string>>;
  isAutoLockEnabled: boolean;
  setIsAutoLockEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  autoLockTimeout: number;
  setAutoLockTimeout: React.Dispatch<React.SetStateAction<number>>;
}

export const SecuritySettingsDialog = ({ 
  open, 
  onOpenChange,
  isEncryptionEnabled,
  setIsEncryptionEnabled,
  savedMasterPassword,
  setSavedMasterPassword,
  isAutoLockEnabled,
  setIsAutoLockEnabled,
  autoLockTimeout,
  setAutoLockTimeout
}: SecuritySettingsDialogProps) => {
  const [masterPassword, setMasterPassword] = useState("");

  const saveSecuritySettings = () => {
    if (isEncryptionEnabled && !masterPassword && !savedMasterPassword) {
      toast.error("Πρέπει να ορίσετε κύριο κωδικό για την κρυπτογράφηση");
      return;
    }
    
    if (masterPassword) {
      setSavedMasterPassword(masterPassword);
      localStorage.setItem('master-password', masterPassword);
    }
    
    localStorage.setItem('encryption-enabled', String(isEncryptionEnabled));
    localStorage.setItem('auto-lock-enabled', String(isAutoLockEnabled));
    localStorage.setItem('auto-lock-timeout', String(autoLockTimeout));
    
    onOpenChange(false);
    setMasterPassword("");
    toast.success("Οι ρυθμίσεις αποθηκεύτηκαν με επιτυχία");
    
    // Force reload of keys if encryption was just enabled
    const savedKeys = localStorage.getItem('apiKeys');
    if (savedKeys && isEncryptionEnabled !== (localStorage.getItem('encryption-enabled') === 'true')) {
      window.location.reload();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ρυθμίσεις Ασφαλείας Κλειδοθήκης</DialogTitle>
          <DialogDescription>
            Διαμορφώστε τις ρυθμίσεις ασφαλείας της κλειδοθήκης σας
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Κρυπτογράφηση</p>
              <p className="text-sm text-muted-foreground">Κρυπτογράφηση των αποθηκευμένων κλειδιών</p>
            </div>
            <Switch 
              checked={isEncryptionEnabled}
              onCheckedChange={setIsEncryptionEnabled}
            />
          </div>
          
          {isEncryptionEnabled && (
            <div className="space-y-2">
              <Label htmlFor="master-password">Κύριος Κωδικός</Label>
              <Input 
                id="master-password" 
                type="password" 
                placeholder={savedMasterPassword ? "••••••••" : "Ορισμός κύριου κωδικού"} 
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {savedMasterPassword 
                  ? "Αφήστε κενό για να διατηρήσετε τον τρέχοντα κωδικό" 
                  : "Αυτός ο κωδικός θα χρησιμοποιείται για την κρυπτογράφηση των κλειδιών σας"}
              </p>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Αυτόματο Κλείδωμα</p>
              <p className="text-sm text-muted-foreground">Κλείδωμα κλειδοθήκης μετά από αδράνεια</p>
            </div>
            <Switch 
              checked={isAutoLockEnabled}
              onCheckedChange={setIsAutoLockEnabled}
            />
          </div>
          
          {isAutoLockEnabled && (
            <div className="space-y-2">
              <Label htmlFor="lock-timeout">Χρονικό διάστημα αδράνειας (λεπτά)</Label>
              <Select 
                value={autoLockTimeout.toString()} 
                onValueChange={(v) => setAutoLockTimeout(parseInt(v, 10))}
              >
                <SelectTrigger id="lock-timeout">
                  <SelectValue placeholder="Επιλέξτε διάστημα" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 λεπτό</SelectItem>
                  <SelectItem value="5">5 λεπτά</SelectItem>
                  <SelectItem value="15">15 λεπτά</SelectItem>
                  <SelectItem value="30">30 λεπτά</SelectItem>
                  <SelectItem value="60">1 ώρα</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Ακύρωση</Button>
          <Button onClick={saveSecuritySettings}>Αποθήκευση</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
