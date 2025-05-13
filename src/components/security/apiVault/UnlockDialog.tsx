
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LockKeyhole } from "lucide-react";

interface UnlockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUnlock: (password: string) => void;
}

export const UnlockDialog: React.FC<UnlockDialogProps> = ({ 
  open, 
  onOpenChange,
  onUnlock
}) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleUnlock = () => {
    if (!password.trim()) {
      setError("Παρακαλώ εισάγετε τον κωδικό πρόσβασης");
      return;
    }

    setError(null);
    onUnlock(password);
    setPassword("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUnlock();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LockKeyhole className="h-5 w-5" />
            Ξεκλείδωμα Κλειδοθήκης
          </DialogTitle>
          <DialogDescription>
            Εισάγετε τον κύριο κωδικό για να ξεκλειδώσετε τα κλειδιά API σας
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-2">
            <Label htmlFor="master-password">Κύριος Κωδικός</Label>
            <Input 
              id="master-password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-500 mt-1">
                {error}
              </p>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Ακύρωση</Button>
          <Button onClick={handleUnlock}>Ξεκλείδωμα</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
