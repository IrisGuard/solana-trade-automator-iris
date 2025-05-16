
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export interface TransactionDetails {
  type: 'send' | 'swap' | 'receive';
  fromWallet?: string;
  toWallet?: string;
  amount: number;
  token: string;
  fee?: number;
  estimatedValue?: number;
}

interface TransactionConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<boolean>;
  transaction: TransactionDetails;
}

enum ConfirmationStatus {
  PENDING,
  PROCESSING,
  SUCCESS,
  ERROR
}

export function TransactionConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  transaction
}: TransactionConfirmationModalProps) {
  const [status, setStatus] = React.useState<ConfirmationStatus>(ConfirmationStatus.PENDING);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  
  // Helper for formatting addresses
  const formatAddress = (address?: string) => {
    if (!address) return '';
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };
  
  // Handle confirmation
  const handleConfirm = async () => {
    try {
      setStatus(ConfirmationStatus.PROCESSING);
      
      const success = await onConfirm();
      
      if (success) {
        setStatus(ConfirmationStatus.SUCCESS);
        toast.success("Συναλλαγή επιτυχής");
      } else {
        setStatus(ConfirmationStatus.ERROR);
        setErrorMessage("Η συναλλαγή απέτυχε");
        toast.error("Η συναλλαγή απέτυχε");
      }
    } catch (error) {
      console.error("Transaction error:", error);
      setStatus(ConfirmationStatus.ERROR);
      const errorMsg = error instanceof Error ? error.message : "Άγνωστο σφάλμα";
      setErrorMessage(errorMsg);
      toast.error("Σφάλμα συναλλαγής", {
        description: errorMsg
      });
    }
  };
  
  // Reset state when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setStatus(ConfirmationStatus.PENDING);
      setErrorMessage("");
    }
  }, [isOpen]);
  
  // Transaction type specific title and description
  const getTransactionDetails = () => {
    switch (transaction.type) {
      case 'send':
        return {
          title: "Επιβεβαίωση Αποστολής",
          description: `Θα στείλετε ${transaction.amount} ${transaction.token} στο πορτοφόλι ${formatAddress(transaction.toWallet)}`
        };
      case 'swap':
        return {
          title: "Επιβεβαίωση Ανταλλαγής",
          description: `Θα ανταλλάξετε ${transaction.amount} ${transaction.token} → ${transaction.estimatedValue} SOL`
        };
      case 'receive':
        return {
          title: "Αίτημα Λήψης",
          description: `Θα λάβετε ${transaction.amount} ${transaction.token} από το πορτοφόλι ${formatAddress(transaction.fromWallet)}`
        };
      default:
        return {
          title: "Επιβεβαίωση Συναλλαγής",
          description: "Παρακαλώ επιβεβαιώστε τη συναλλαγή"
        };
    }
  };
  
  const { title, description } = getTransactionDetails();
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Transaction details */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Ποσό:</div>
            <div className="font-medium">{transaction.amount} {transaction.token}</div>
            
            {transaction.fee !== undefined && (
              <>
                <div className="text-muted-foreground">Προμήθεια Δικτύου:</div>
                <div className="font-medium">{transaction.fee} SOL</div>
              </>
            )}
            
            {transaction.fromWallet && (
              <>
                <div className="text-muted-foreground">Από:</div>
                <div className="font-medium">{formatAddress(transaction.fromWallet)}</div>
              </>
            )}
            
            {transaction.toWallet && (
              <>
                <div className="text-muted-foreground">Προς:</div>
                <div className="font-medium">{formatAddress(transaction.toWallet)}</div>
              </>
            )}
          </div>
          
          {/* Status display */}
          {status === ConfirmationStatus.PROCESSING && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div className="ml-3">Επεξεργασία συναλλαγής...</div>
            </div>
          )}
          
          {status === ConfirmationStatus.SUCCESS && (
            <div className="flex items-center justify-center p-4 text-green-600">
              <CheckCircle className="h-8 w-8" />
              <div className="ml-3">Η συναλλαγή ολοκληρώθηκε επιτυχώς!</div>
            </div>
          )}
          
          {status === ConfirmationStatus.ERROR && (
            <div className="flex items-center justify-center p-4 text-red-600">
              <AlertCircle className="h-8 w-8" />
              <div className="ml-3">
                Η συναλλαγή απέτυχε
                {errorMessage && <div className="text-sm mt-1">{errorMessage}</div>}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          {status === ConfirmationStatus.PENDING && (
            <>
              <Button variant="outline" onClick={onClose}>
                Ακύρωση
              </Button>
              <Button onClick={handleConfirm}>
                Επιβεβαίωση
              </Button>
            </>
          )}
          
          {(status === ConfirmationStatus.SUCCESS || status === ConfirmationStatus.ERROR) && (
            <Button onClick={onClose}>
              Κλείσιμο
            </Button>
          )}
          
          {status === ConfirmationStatus.PROCESSING && (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Επεξεργασία...
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
