
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Plus, AlertCircle } from "lucide-react";
import { ApiKeysList } from "./ApiKeysList";
import { ApiKeysByService } from "./ApiKeysByService";
import { useApiKeyManager } from "@/hooks/api-keys/useApiKeyManager";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SupabaseApiKeysListProps {
  userId: string;
}

export function SupabaseApiKeysList({ userId }: SupabaseApiKeysListProps) {
  const [activeTab, setActiveTab] = React.useState("all");
  
  const {
    apiKeys,
    loading,
    error,
    refreshApiKeys,
    handleCopy,
    handleDeleteKey,
    handleTestKey,
    toggleKeyVisibility,
    isCopied,
    isKeyVisible,
    isKeyTesting,
    formatDate,
    formatKeyDisplay,
    getKeysByService
  } = useApiKeyManager();

  // Handler for adding a new API key
  const handleAddKey = () => {
    // This would open a dialog to add a new key
    console.log("Add key for user:", userId);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Loading your API keys...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage your stored API keys</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshApiKeys}
            className="gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button 
            size="sm" 
            onClick={handleAddKey}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Key
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Keys</TabsTrigger>
            <TabsTrigger value="byService">By Service</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <ApiKeysList
              apiKeys={apiKeys}
              toggleKeyVisibility={toggleKeyVisibility}
              onCopy={handleCopy}
              onDelete={handleDeleteKey}
              onTest={handleTestKey}
              isKeyVisible={isKeyVisible}
              isCopied={isCopied}
              isKeyTesting={isKeyTesting}
              formatDate={formatDate}
              formatKeyDisplay={formatKeyDisplay}
            />
          </TabsContent>
          
          <TabsContent value="byService" className="mt-4">
            <ApiKeysByService
              keysByService={getKeysByService()}
              toggleKeyVisibility={toggleKeyVisibility}
              onCopy={handleCopy}
              onDelete={handleDeleteKey}
              onTest={handleTestKey}
              isKeyVisible={isKeyVisible}
              isCopied={isCopied}
              isKeyTesting={isKeyTesting}
              formatDate={formatDate}
              formatKeyDisplay={formatKeyDisplay}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
