
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload, Plus, Key } from "lucide-react";
import { toast } from "sonner";

interface ApiVaultHeaderProps {
  onAddKey: () => void;
  onImport: () => void;
  onExport: () => void;
  apiKeysCount: number;
}

export const ApiVaultHeader: React.FC<ApiVaultHeaderProps> = ({
  onAddKey,
  onImport,
  onExport,
  apiKeysCount
}) => {
  const handleExport = () => {
    if (apiKeysCount === 0) {
      toast.error("Δεν υπάρχουν κλειδιά για εξαγωγή");
      return;
    }
    onExport();
    toast.success("Τα κλειδιά εξήχθησαν επιτυχώς");
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Key className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Κλειδιά API</h2>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          onClick={onImport}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          Εισαγωγή
        </Button>
        <Button 
          variant="outline" 
          onClick={handleExport}
          className="gap-2" 
          disabled={apiKeysCount === 0}
        >
          <Download className="h-4 w-4" />
          Εξαγωγή
        </Button>
        <Button 
          onClick={onAddKey}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Προσθήκη Κλειδιού
        </Button>
      </div>
    </div>
  );
};
