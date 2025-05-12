
import { useState } from "react";
import { ApiKey } from "../types";

export function useKeyDeletion(deleteKey: (id: string) => void) {
  const [keyToDelete, setKeyToDelete] = useState<ApiKey | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [confirmationRequired, setConfirmationRequired] = useState(false);
  
  const handleDeleteRequest = (key: ApiKey) => {
    setKeyToDelete(key);
    setConfirmDialogOpen(true);
    // Απαίτηση επιβεβαίωσης κειμένου για σημαντικά κλειδιά
    setConfirmationRequired(key.status === 'active' || 
                            key.service?.toLowerCase().includes('important') || 
                            key.name?.toLowerCase().includes('important'));
    setConfirmationText("");
  };
  
  const confirmDelete = () => {
    if (keyToDelete) {
      if (confirmationRequired && confirmationText !== "ΔΙΑΓΡΑΦΗ") {
        // Αν απαιτείται επιβεβαίωση και δεν έχει δοθεί το σωστό κείμενο, αποτρέπουμε τη διαγραφή
        return;
      }
      
      deleteKey(keyToDelete.id);
      setConfirmDialogOpen(false);
      setKeyToDelete(null);
      setConfirmationText("");
      setConfirmationRequired(false);
    }
  };
  
  const cancelDelete = () => {
    setConfirmDialogOpen(false);
    setKeyToDelete(null);
    setConfirmationText("");
    setConfirmationRequired(false);
  };

  return {
    keyToDelete,
    confirmDialogOpen,
    setConfirmDialogOpen,
    handleDeleteRequest,
    confirmDelete,
    cancelDelete,
    // Επιστρέφουμε τις νέες μεταβλητές κατάστασης
    confirmationText,
    setConfirmationText,
    confirmationRequired
  };
}
