
import React from "react";
import { ApiKey } from "../types";
import { DeleteKeyDialog } from "./DeleteKeyDialog";

interface ConfirmDeleteDialogProps {
  keyToDelete: ApiKey | null;
  confirmDialogOpen: boolean;
  setConfirmDialogOpen: (open: boolean) => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
  confirmationText?: string;
  setConfirmationText?: (text: string) => void;
  confirmationRequired?: boolean;
}

export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  keyToDelete,
  confirmDialogOpen,
  setConfirmDialogOpen,
  onConfirmDelete,
  onCancelDelete,
  confirmationText,
  setConfirmationText,
  confirmationRequired
}) => {
  return (
    <DeleteKeyDialog
      open={confirmDialogOpen}
      onOpenChange={setConfirmDialogOpen}
      keyToDelete={keyToDelete}
      onConfirmDelete={onConfirmDelete}
      onCancelDelete={onCancelDelete}
      confirmationText={confirmationText}
      setConfirmationText={setConfirmationText}
      confirmationRequired={confirmationRequired}
    />
  );
};
