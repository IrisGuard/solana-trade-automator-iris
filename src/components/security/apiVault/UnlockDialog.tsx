
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

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
  const [isChecking, setIsChecking] = useState(false);

  const handleUnlock = () => {
    if (!unlockPassword.trim()) {
      toast.error("Παρακαλώ εισάγετε τον κωδικό σας");
      return;
    }

    setIsChecking(true);
    
    // Add a small delay to simulate checking the password
    setTimeout(() => {
      if (unlockPassword === savedMasterPassword) {
        onUnlock(unlockPassword);
        setUnlockPassword("");
        onOpenChange(false);
        toast.success("Η κλειδοθήκη ξεκλειδώθηκε με επιτυχία");
      } else {
        toast.error("Λάθος κωδικός πρόσβασης");
      }
      setIsChecking(false);
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!isChecking) {
        onOpenChange(newOpen);
      }
    }}>
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
                if (e.key === 'Enter' && !isChecking) {
                  handleUnlock();
                }
              }}
              disabled={isChecking}
              className="pr-10"
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            disabled={isChecking}
          >
            Ακύρωση
          </Button>
          <Button 
            onClick={handleUnlock}
            className="sm:ml-auto"
            disabled={isChecking}
          >
            {isChecking ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Έλεγχος...
              </>
            ) : (
              'Ξεκλείδωμα'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
