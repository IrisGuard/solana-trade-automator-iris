
import { useState } from "react";
import { ApiKey } from "../types";

export function useKeyDeletion(deleteKey: (id: string) => void) {
  const [keyToDelete, setKeyToDelete] = useState<ApiKey | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  const handleDeleteRequest = (key: ApiKey) => {
    setKeyToDelete(key);
    setConfirmDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (keyToDelete) {
      deleteKey(keyToDelete.id);
      setConfirmDialogOpen(false);
      setKeyToDelete(null);
    }
  };
  
  const cancelDelete = () => {
    setConfirmDialogOpen(false);
    setKeyToDelete(null);
  };

  return {
    keyToDelete,
    confirmDialogOpen,
    setConfirmDialogOpen,
    handleDeleteRequest,
    confirmDelete,
    cancelDelete
  };
}
