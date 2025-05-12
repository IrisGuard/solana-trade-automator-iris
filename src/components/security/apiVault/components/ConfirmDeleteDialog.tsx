
import React from "react";
import { ApiKey } from "../types";
import { DeleteKeyDialog } from "./DeleteKeyDialog";

interface ConfirmDeleteDialogProps {
  keyToDelete: ApiKey | null;
  confirmDialogOpen: boolean;
  setConfirmDialogOpen: (open: boolean) => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}

export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  keyToDelete,
  confirmDialogOpen,
  setConfirmDialogOpen,
  onConfirmDelete,
  onCancelDelete
}) => {
  return (
    <DeleteKeyDialog
      open={confirmDialogOpen}
      onOpenChange={setConfirmDialogOpen}
      keyToDelete={keyToDelete}
      onConfirmDelete={onConfirmDelete}
      onCancelDelete={onCancelDelete}
    />
  );
};
