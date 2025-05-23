
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Key, Plus, RefreshCw } from "lucide-react";
import { useApiKeysDashboard } from "@/hooks/api-keys/useApiKeysDashboard";
import { ApiKeysList } from "./api-keys/ApiKeysList";
import { ApiKeysEmptyState } from "./api-keys/ApiKeysEmptyState";
import { ApiKeysLoadingState } from "./api-keys/ApiKeysLoadingState";
import { Link } from "react-router-dom";

export function ApiKeysSection() {
  const {
    apiKeys,
    loading,
    copiedKeyId,
    visibleKeyIds,
    fetchApiKeys,
    handleCopy,
    handleAddNewKey,
    toggleKeyVisibility
  } = useApiKeysDashboard();

  if (loading) {
    return <ApiKeysLoadingState />;
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Κλειδιά API
          </CardTitle>
          <CardDescription>
            {apiKeys.length > 0 
              ? `${apiKeys.length} αποθηκευμένα κλειδιά` 
              : 'Δεν υπάρχουν αποθηκευμένα κλειδιά API'}
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchApiKeys}
            className="gap-1"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Ανανέωση</span>
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleAddNewKey}
            className="gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Προσθήκη</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {apiKeys.length > 0 ? (
          <>
            <ApiKeysList 
              apiKeys={apiKeys}
              visibleKeyIds={visibleKeyIds}
              copiedKeyId={copiedKeyId}
              onToggleVisibility={toggleKeyVisibility}
              onCopy={handleCopy}
            />
            <div className="mt-4 text-center space-y-2">
              <Button 
                variant="link" 
                onClick={handleAddNewKey}
                className="text-sm"
              >
                Προβολή όλων των κλειδιών API
              </Button>
              
              <div className="block">
                <Link to="/add-helius-key">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-sm text-green-600 hover:text-green-700 border-green-200 hover:border-green-300 flex items-center gap-2"
                  >
                    <Key className="h-4 w-4" />
                    Προσθήκη Κλειδιών Helius
                  </Button>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <ApiKeysEmptyState onAddKey={handleAddNewKey} />
            <div className="flex justify-center">
              <Link to="/add-helius-key">
                <Button 
                  variant="outline" 
                  className="mt-4 text-sm text-green-600 hover:text-green-700 border-green-200 hover:border-green-300 flex items-center gap-2"
                >
                  <Key className="h-4 w-4" />
                  Προσθήκη Κλειδιών Helius
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
