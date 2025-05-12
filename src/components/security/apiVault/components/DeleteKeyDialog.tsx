
import React from "react";
import { AlertCircle, Shield } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { ApiKey } from "../types";

interface DeleteKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  keyToDelete: ApiKey | null;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}

export const DeleteKeyDialog: React.FC<DeleteKeyDialogProps> = ({
  open,
  onOpenChange,
  keyToDelete,
  onConfirmDelete,
  onCancelDelete
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-red-600">
            <Shield className="h-5 w-5" />
            <AlertDialogTitle>Επιβεβαίωση Διαγραφής</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-2">
            <p className="font-medium">Είστε σίγουροι ότι θέλετε να διαγράψετε το κλειδί:</p>
            <p className="font-bold">{keyToDelete?.name}</p>
            <div className="bg-red-50 p-3 border border-red-200 rounded-md text-red-800 mt-2">
              <p className="text-sm font-semibold">Προσοχή:</p>
              <ul className="list-disc list-inside text-sm space-y-1 mt-1">
                <li>Αυτή η ενέργεια δεν μπορεί να αναιρεθεί</li>
                <li>Το κλειδί θα αφαιρεθεί οριστικά από την κλειδοθήκη σας</li>
                <li>Αν το κλειδί είναι συνδεδεμένο με μια υπηρεσία, η σύνδεση θα διακοπεί</li>
              </ul>
            </div>
            <p className="mt-2">Παρακαλώ επιβεβαιώστε τη διαγραφή.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancelDelete}>Άκυρο</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirmDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Ναι, διαγραφή κλειδιού
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
