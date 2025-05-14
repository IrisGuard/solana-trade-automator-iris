
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface RejectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: (comments: string) => Promise<void>;
}

export function RejectDialog({ isOpen, onClose, onReject }: RejectDialogProps) {
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      await onReject(comments);
      setComments('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Απόρριψη Αλλαγής</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <Label htmlFor="comments">Σχόλια Απόρριψης</Label>
          <Textarea
            id="comments"
            placeholder="Αιτιολογήστε την απόρριψη της αλλαγής..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="mt-2"
          />
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Ακύρωση
          </Button>
          <Button 
            type="button"
            variant="destructive"
            onClick={handleReject}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Υποβολή...' : 'Απόρριψη'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
