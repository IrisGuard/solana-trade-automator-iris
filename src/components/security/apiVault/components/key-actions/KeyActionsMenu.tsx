
import React, { useState } from "react";
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Copy, 
  ExternalLink 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface KeyActionsMenuProps {
  keyValue: string;
  onEditKey?: () => void;
  onDeleteRequest: () => void;
  onTestKey?: () => Promise<boolean>;
}

export const KeyActionsMenu: React.FC<KeyActionsMenuProps> = ({
  keyValue,
  onEditKey,
  onDeleteRequest,
  onTestKey
}) => {
  const [isTesting, setIsTesting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(keyValue);
    setIsCopied(true);
    toast.success("Το κλειδί αντιγράφηκε στο πρόχειρο");
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleTestKey = async () => {
    if (!onTestKey) return;

    setIsTesting(true);
    try {
      const isWorking = await onTestKey();
      if (isWorking) {
        toast.success("Το κλειδί λειτουργεί κανονικά");
      } else {
        toast.error("Το κλειδί δεν λειτουργεί");
      }
    } catch (error) {
      toast.error("Σφάλμα κατά τον έλεγχο του κλειδιού");
      console.error("Error testing key:", error);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Επιλογές κλειδιού</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyKey} className="gap-2">
          <Copy className="h-4 w-4" />
          <span>Αντιγραφή κλειδιού</span>
        </DropdownMenuItem>
        {onEditKey && (
          <DropdownMenuItem onClick={onEditKey} className="gap-2">
            <Edit className="h-4 w-4" />
            <span>Επεξεργασία</span>
          </DropdownMenuItem>
        )}
        {onTestKey && (
          <DropdownMenuItem 
            onClick={handleTestKey}
            disabled={isTesting} 
            className="gap-2"
          >
            {isTesting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Έλεγχος...</span>
              </>
            ) : (
              <>
                <ExternalLink className="h-4 w-4" />
                <span>Έλεγχος κλειδιού</span>
              </>
            )}
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={onDeleteRequest}
          className="text-red-600 focus:text-red-600 gap-2"
        >
          <Trash2 className="h-4 w-4" />
          <span>Διαγραφή</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
