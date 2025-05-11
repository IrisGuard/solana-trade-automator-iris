
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface SecuritySettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEncryptionEnabled: boolean;
  setIsEncryptionEnabled: (enabled: boolean) => void;
  savedMasterPassword: string;
  setSavedMasterPassword: (password: string) => void;
  isAutoLockEnabled: boolean;
  setIsAutoLockEnabled: (enabled: boolean) => void;
  autoLockTimeout: number;
  setAutoLockTimeout: (timeout: number) => void;
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
  const [localEncryptionEnabled, setLocalEncryptionEnabled] = useState(isEncryptionEnabled);
  const [localMasterPassword, setLocalMasterPassword] = useState(savedMasterPassword);
  const [localAutoLockEnabled, setLocalAutoLockEnabled] = useState(isAutoLockEnabled);
  const [localAutoLockTimeout, setLocalAutoLockTimeout] = useState(autoLockTimeout);
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Update local state when props change
  useEffect(() => {
    if (open) {
      setLocalEncryptionEnabled(isEncryptionEnabled);
      setLocalMasterPassword(savedMasterPassword);
      setLocalAutoLockEnabled(isAutoLockEnabled);
      setLocalAutoLockTimeout(autoLockTimeout);
      setConfirmPassword("");
    }
  }, [open, isEncryptionEnabled, savedMasterPassword, isAutoLockEnabled, autoLockTimeout]);
  
  const handleSave = () => {
    if (localEncryptionEnabled && (!localMasterPassword || localMasterPassword.length < 4)) {
      toast.error("Παρακαλώ εισάγετε έναν κύριο κωδικό τουλάχιστον 4 χαρακτήρων");
      return;
    }
    
    if (localEncryptionEnabled && localMasterPassword !== confirmPassword) {
      toast.error("Οι κωδικοί δεν ταιριάζουν");
      return;
    }
    
    setIsEncryptionEnabled(localEncryptionEnabled);
    setSavedMasterPassword(localMasterPassword);
    setIsAutoLockEnabled(localAutoLockEnabled);
    setAutoLockTimeout(localAutoLockTimeout);
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ρυθμίσεις Ασφαλείας</DialogTitle>
          <DialogDescription>
            Διαμορφώστε τις ρυθμίσεις ασφαλείας της κλειδοθήκης σας
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="encryption">Κρυπτογράφηση</Label>
              <p className="text-sm text-muted-foreground">
                Κρυπτογράφηση του περιεχομένου της κλειδοθήκης
              </p>
            </div>
            <Switch 
              id="encryption" 
              checked={localEncryptionEnabled}
              onCheckedChange={setLocalEncryptionEnabled}
            />
          </div>
          
          {localEncryptionEnabled && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="master-password">Κύριος Κωδικός</Label>
                <Input 
                  id="master-password" 
                  type="password" 
                  value={localMasterPassword}
                  onChange={(e) => setLocalMasterPassword(e.target.value)}
                  placeholder="Εισαγωγή κύριου κωδικού"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Επιβεβαίωση Κωδικού</Label>
                <Input 
                  id="confirm-password" 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Επιβεβαίωση κωδικού"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-lock">Αυτόματο Κλείδωμα</Label>
                  <p className="text-sm text-muted-foreground">
                    Κλείδωμα μετά από περίοδο αδράνειας
                  </p>
                </div>
                <Switch 
                  id="auto-lock" 
                  checked={localAutoLockEnabled}
                  onCheckedChange={setLocalAutoLockEnabled}
                />
              </div>
              
              {localAutoLockEnabled && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="timeout">Χρόνος αδράνειας</Label>
                    <span className="text-sm font-medium">{localAutoLockTimeout} λεπτά</span>
                  </div>
                  <Slider 
                    id="timeout"
                    min={1}
                    max={60}
                    step={1}
                    value={[localAutoLockTimeout]}
                    onValueChange={(values) => setLocalAutoLockTimeout(values[0])}
                  />
                </div>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Ακύρωση
          </Button>
          <Button onClick={handleSave}>Αποθήκευση</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
