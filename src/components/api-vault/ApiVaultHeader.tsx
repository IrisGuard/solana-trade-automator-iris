
import React from "react";
import { Button } from "@/components/ui/button";
import { Key, Download, Upload, Plus, Shield } from "lucide-react";
import { CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface ApiVaultHeaderProps {
  isLoggedIn?: boolean;
}

export const ApiVaultHeader: React.FC<ApiVaultHeaderProps> = ({ 
  isLoggedIn = false 
}) => {
  const navigate = useNavigate();
  
  const handleNewKeyClick = () => {
    navigate('/api-vault/new');
  };
  
  const handleSettingsClick = () => {
    navigate('/api-vault/settings');
  };
  
  const handleExportClick = () => {
    navigate('/api-vault/export');
  };
  
  const handleImportClick = () => {
    navigate('/api-vault/import');
  };
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Key className="h-5 w-5 text-primary" />
        <CardTitle>Κλειδοθήκη API</CardTitle>
      </div>
      {isLoggedIn && (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSettingsClick}
          >
            <Shield className="mr-1 h-4 w-4" />
            Ρυθμίσεις
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportClick}
          >
            <Download className="mr-1 h-4 w-4" />
            Εξαγωγή
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleImportClick}
          >
            <Upload className="mr-1 h-4 w-4" />
            Εισαγωγή
          </Button>
          <Button 
            size="sm" 
            className="gap-1"
            onClick={handleNewKeyClick}
          >
            <Plus className="h-4 w-4" />
            Νέο Κλειδί
          </Button>
        </div>
      )}
    </div>
  );
};
