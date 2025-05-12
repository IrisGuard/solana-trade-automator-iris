
import React from "react";
import { ApiKey } from "./types";
import { EmptyKeyList } from "./components/EmptyKeyList";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ApiKeyListContent } from "./components/ApiKeyListContent";
import { ConfirmDeleteDialog } from "./components/ConfirmDeleteDialog";
import { useKeyDeletion } from "./hooks/useKeyDeletion";

interface ApiKeyListProps {
  apiKeys: ApiKey[];
  isKeyVisible: Record<string, boolean>;
  toggleKeyVisibility: (id: string) => void;
  deleteKey: (id: string) => void;
  onEditKey?: (key: ApiKey) => void;
  onTestKey?: (key: ApiKey) => Promise<boolean>;
}

export const ApiKeyList = ({
  apiKeys,
  isKeyVisible,
  toggleKeyVisibility,
  deleteKey,
  onEditKey,
  onTestKey
}: ApiKeyListProps) => {
  // Use the extracted deletion hook
  const {
    keyToDelete,
    confirmDialogOpen,
    setConfirmDialogOpen,
    handleDeleteRequest,
    confirmDelete,
    cancelDelete
  } = useKeyDeletion(deleteKey);

  // If there are no keys, show the empty state
  if (apiKeys.length === 0) {
    return <EmptyKeyList />;
  }

  return (
    <TooltipProvider>
      {/* Render the list of API keys */}
      <ApiKeyListContent 
        apiKeys={apiKeys}
        isKeyVisible={isKeyVisible}
        toggleKeyVisibility={toggleKeyVisibility}
        onDeleteRequest={handleDeleteRequest}
        onEditKey={onEditKey}
        onTestKey={onTestKey}
      />
      
      {/* Delete confirmation dialog */}
      <ConfirmDeleteDialog
        keyToDelete={keyToDelete}
        confirmDialogOpen={confirmDialogOpen}
        setConfirmDialogOpen={setConfirmDialogOpen}
        onConfirmDelete={confirmDelete}
        onCancelDelete={cancelDelete}
      />
    </TooltipProvider>
  );
};
