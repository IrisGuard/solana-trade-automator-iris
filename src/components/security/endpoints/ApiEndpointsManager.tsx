
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Plus } from "lucide-react";
import { toast } from "sonner";
import { ApiEndpoint, fetchApiEndpoints, importEndpointsFromEnv } from "@/utils/supabaseEndpoints";
import { AddHeliusButton } from "../apiVault/AddHeliusButton";
import { EndpointsTabs } from "./EndpointsTabs";
import { EndpointDialog } from "./dialogs/EndpointDialog";
import { useEndpoints } from "./hooks/useEndpoints";

export function ApiEndpointsManager() {
  const { 
    endpoints, 
    loading, 
    loadEndpoints,
    handleAddEndpoint,
    handleUpdateEndpoint,
    handleDeleteEndpoint
  } = useEndpoints();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);

  const handleImportFromEnv = async () => {
    try {
      await importEndpointsFromEnv();
      await loadEndpoints();
      toast.success('Εισαγωγή επιτυχής');
    } catch (error) {
      toast.error('Σφάλμα κατά την εισαγωγή');
    }
  };

  const handleEdit = (endpoint: ApiEndpoint) => {
    setSelectedEndpoint(endpoint);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το endpoint;')) {
      await handleDeleteEndpoint(id);
    }
  };

  const handleAddNew = () => {
    setSelectedEndpoint(null);
    setIsAddDialogOpen(true);
  };

  const handleAddSubmit = async (formData: ApiEndpoint) => {
    await handleAddEndpoint(formData);
    setIsAddDialogOpen(false);
  };

  const handleEditSubmit = async (formData: ApiEndpoint) => {
    if (selectedEndpoint?.id) {
      await handleUpdateEndpoint(selectedEndpoint.id, formData);
      setIsEditDialogOpen(false);
    }
  };

  // Group endpoints by category
  const groupedEndpoints = endpoints.reduce((acc, endpoint) => {
    const category = endpoint.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(endpoint);
    return acc;
  }, {} as Record<string, ApiEndpoint[]>);

  const categories = Object.keys(groupedEndpoints).sort();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Διαχείριση API Endpoints</CardTitle>
          <CardDescription>
            Διαχείριση των API endpoints της εφαρμογής
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <AddHeliusButton />
          <Button
            variant="outline"
            size="sm"
            onClick={handleImportFromEnv}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Εισαγωγή από ENV
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleAddNew}
          >
            <Plus className="h-4 w-4 mr-2" />
            Προσθήκη
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {categories.length > 0 ? (
          <EndpointsTabs 
            groupedEndpoints={groupedEndpoints} 
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
            onAddNew={handleAddNew}
          />
        ) : (
          <EmptyEndpointsState onAddNew={handleAddNew} onImport={handleImportFromEnv} />
        )}

        {/* Add/Edit Dialog components */}
        <EndpointDialog 
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          endpoint={null}
          onSubmit={handleAddSubmit}
          title="Προσθήκη νέου API endpoint"
          description="Συμπληρώστε τα στοιχεία του νέου API endpoint"
          submitLabel="Αποθήκευση"
          isLoading={loading}
        />

        <EndpointDialog 
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          endpoint={selectedEndpoint}
          onSubmit={handleEditSubmit}
          title="Επεξεργασία API endpoint"
          description="Τροποποιήστε τα στοιχεία του API endpoint"
          submitLabel="Ενημέρωση"
          isLoading={loading}
        />
      </CardContent>
    </Card>
  );
}

// Empty state component
const EmptyEndpointsState = ({ onAddNew, onImport }: { 
  onAddNew: () => void;
  onImport: () => void;
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <Globe className="h-16 w-16 mb-4 text-muted-foreground opacity-50" />
    <h3 className="text-xl font-medium">Δεν υπάρχουν API endpoints</h3>
    <p className="text-muted-foreground max-w-md mt-2 mb-4">
      Προσθέστε API endpoints για να συνδεθείτε με εξωτερικές υπηρεσίες
    </p>
    <div className="flex gap-3">
      <Button onClick={onAddNew}>
        <Plus className="h-4 w-4 mr-2" />
        Προσθήκη endpoint
      </Button>
      <Button variant="outline" onClick={onImport}>
        <RefreshCw className="h-4 w-4 mr-2" />
        Εισαγωγή από ENV
      </Button>
    </div>
  </div>
);

// Import missing Globe icon
import { Globe } from "lucide-react";
