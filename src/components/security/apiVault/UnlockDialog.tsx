
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface UnlockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savedMasterPassword: string;
  onUnlock: (password: string) => void;
}

export const UnlockDialog = ({ 
  open, 
  onOpenChange, 
  savedMasterPassword,
  onUnlock
}: UnlockDialogProps) => {
  const [unlockPassword, setUnlockPassword] = useState("");

  const handleUnlock = () => {
    onUnlock(unlockPassword);
    setUnlockPassword("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ξεκλείδωμα Κλειδοθήκης</DialogTitle>
          <DialogDescription>
            Εισάγετε τον κύριο κωδικό για πρόσβαση στα κλειδιά σας
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="unlock-password">Κύριος Κωδικός</Label>
            <Input 
              id="unlock-password" 
              type="password" 
              placeholder="Εισαγωγή κωδικού" 
              value={unlockPassword}
              onChange={(e) => setUnlockPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleUnlock();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
          >
            Ακύρωση
          </Button>
          <Button 
            onClick={handleUnlock}
            className="sm:ml-auto"
          >
            Ξεκλείδωμα
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
