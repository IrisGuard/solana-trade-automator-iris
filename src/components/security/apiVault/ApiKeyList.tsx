
import React, { useState } from "react";
import { ApiKey } from "./types";
import { ApiKeyListItem } from "./components/ApiKeyListItem";
import { DeleteKeyDialog } from "./components/DeleteKeyDialog";
import { EmptyKeyList } from "./components/EmptyKeyList";
import { TooltipProvider } from "@/components/ui/tooltip";

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

  if (apiKeys.length === 0) {
    return <EmptyKeyList />;
  }

  return (
    <TooltipProvider>
      <div className="space-y-3">
        {apiKeys.map((apiKey) => (
          <ApiKeyListItem
            key={apiKey.id}
            apiKey={apiKey}
            isVisible={!!isKeyVisible[apiKey.id]}
            onToggleVisibility={() => toggleKeyVisibility(apiKey.id)}
            onDeleteRequest={() => handleDeleteRequest(apiKey)}
            onEditKey={onEditKey ? () => onEditKey(apiKey) : undefined}
            onTestKey={onTestKey ? () => onTestKey(apiKey) : undefined}
          />
        ))}
      </div>
      
      {/* Delete confirmation dialog */}
      <DeleteKeyDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        keyToDelete={keyToDelete}
        onConfirmDelete={confirmDelete}
        onCancelDelete={cancelDelete}
      />
    </TooltipProvider>
  );
};
