
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ApiKey } from "./types";
import { ApiVaultHeader } from "./components/ApiVaultHeader";
import { ApiVaultContent } from "./ApiVaultContent";
import { useApiKeyManagement } from "./hooks/useApiKeyManagement";
import { useApiKeyVisibility } from "./hooks/useApiKeyVisibility";
import { ApiKeyDialogs } from "./components/ApiKeyDialogs";

export const ApiVaultCard = () => {
  const [showAddKeyDialog, setShowAddKeyDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  const {
    apiKeys,
    setApiKeys,
    searchTerm,
    setSearchTerm,
    filterService,
    setFilterService,
    addNewKey,
    deleteKey,
    handleImport,
    getFilteredKeys,
    getKeysByService
  } = useApiKeyManagement();

  const { isKeyVisible, toggleKeyVisibility } = useApiKeyVisibility();

  // Save keys to localStorage whenever they change
  useEffect(() => {
    if (apiKeys.length > 0) {
      localStorage.setItem('apiKeys', JSON.stringify(apiKeys));
    }
  }, [apiKeys]);

  const handleExportKeys = () => {
    if (apiKeys.length === 0) {
      return;
    }

    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(apiKeys, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "api_keys.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    } catch (error) {
      console.error("Error exporting keys:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <ApiVaultHeader 
          onAddKey={() => setShowAddKeyDialog(true)}
          onImport={() => setShowImportDialog(true)}
          onExport={handleExportKeys}
          apiKeysCount={apiKeys.length}
        />
      </CardHeader>
      <CardContent>
        <ApiVaultContent 
          apiKeys={apiKeys}
          isKeyVisible={isKeyVisible}
          toggleKeyVisibility={toggleKeyVisibility}
          deleteKey={deleteKey}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterService={filterService}
          setFilterService={setFilterService}
          getFilteredKeys={getFilteredKeys}
          getKeysByService={getKeysByService}
          onAddKeyClick={() => setShowAddKeyDialog(true)}
        />

        <ApiKeyDialogs 
          showAddKeyDialog={showAddKeyDialog}
          setShowAddKeyDialog={setShowAddKeyDialog}
          showImportDialog={showImportDialog}
          setShowImportDialog={setShowImportDialog}
          addNewKey={addNewKey}
          handleImport={handleImport}
        />
      </CardContent>
    </Card>
  );
};
