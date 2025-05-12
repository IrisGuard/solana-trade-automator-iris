
import React, { useEffect } from "react";
import { ApiKey } from "./types";
import { EmptyKeyList } from "./components/EmptyKeyList";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ApiKeyListContent } from "./components/ApiKeyListContent";
import { ConfirmDeleteDialog } from "./components/ConfirmDeleteDialog";
import { useKeyDeletion } from "./hooks/useKeyDeletion";
import { useKeyTesting } from "./hooks/useKeyTesting";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface ApiKeyListProps {
  apiKeys: ApiKey[];
  isKeyVisible: Record<string, boolean>;
  toggleKeyVisibility: (id: string) => void;
  deleteKey: (id: string) => void;
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKey[]>>;
  onEditKey?: (key: ApiKey) => void;
  onTestKey?: (key: ApiKey) => Promise<boolean>;
}

export const ApiKeyList = ({
  apiKeys,
  isKeyVisible,
  toggleKeyVisibility,
  deleteKey,
  setApiKeys,
  onEditKey,
  onTestKey
}: ApiKeyListProps) => {
  // Χρήση του hook διαγραφής κλειδιών
  const {
    keyToDelete,
    confirmDialogOpen,
    setConfirmDialogOpen,
    handleDeleteRequest,
    confirmDelete,
    cancelDelete,
    confirmationText,
    setConfirmationText,
    confirmationRequired
  } = useKeyDeletion(deleteKey);

  // Χρήση του hook ελέγχου κλειδιών
  const { isTestingKeys, handleRefreshKeys, testSingleKey } = useKeyTesting();

  // Λογική τεστ κλειδιού για συγκεκριμένο κλειδί
  const handleTestKey = async (key: ApiKey) => {
    const isWorking = onTestKey ? await onTestKey(key) : await testSingleKey(key);
    
    // Ενημέρωση του συγκεκριμένου κλειδιού με το αποτέλεσμα
    setApiKeys(prev => 
      prev.map(k => k.id === key.id ? { ...k, isWorking } : k)
    );
    
    return isWorking;
  };

  // Εφόσον δεν υπάρχουν κλειδιά, εμφάνιση κενής κατάστασης
  if (apiKeys.length === 0) {
    return <EmptyKeyList />;
  }

  return (
    <TooltipProvider>
      <div className="mb-4 flex justify-end">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleRefreshKeys(apiKeys, setApiKeys)}
          disabled={isTestingKeys}
        >
          <RefreshCcw className={`h-4 w-4 mr-2 ${isTestingKeys ? 'animate-spin' : ''}`} />
          Έλεγχος κλειδιών
        </Button>
      </div>
      
      {/* Εμφάνιση των κλειδιών API */}
      <ApiKeyListContent 
        apiKeys={apiKeys}
        isKeyVisible={isKeyVisible}
        toggleKeyVisibility={toggleKeyVisibility}
        onDeleteRequest={handleDeleteRequest}
        onEditKey={onEditKey}
        onTestKey={handleTestKey}
      />
      
      {/* Διάλογος επιβεβαίωσης διαγραφής */}
      <ConfirmDeleteDialog
        keyToDelete={keyToDelete}
        confirmDialogOpen={confirmDialogOpen}
        setConfirmDialogOpen={setConfirmDialogOpen}
        onConfirmDelete={confirmDelete}
        onCancelDelete={cancelDelete}
        confirmationText={confirmationText}
        setConfirmationText={setConfirmationText}
        confirmationRequired={confirmationRequired}
      />
    </TooltipProvider>
  );
};
