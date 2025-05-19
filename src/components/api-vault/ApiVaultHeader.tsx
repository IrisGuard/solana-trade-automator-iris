
import React from "react";
import { Button } from "@/components/ui/button";
import { Key, Download, Upload, Plus, Shield, Lock, Unlock } from "lucide-react";
import { CardTitle } from "@/components/ui/card";

interface ApiVaultHeaderProps {
  isLoggedIn?: boolean;
}

export const ApiVaultHeader: React.FC<ApiVaultHeaderProps> = ({ 
  isLoggedIn = false 
}) => {
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
          >
            <Lock className="mr-1 h-4 w-4" />
            Ρυθμίσεις
          </Button>
          <Button 
            variant="outline" 
            size="sm"
          >
            <Download className="mr-1 h-4 w-4" />
            Εξαγωγή
          </Button>
          <Button 
            variant="outline" 
            size="sm"
          >
            <Upload className="mr-1 h-4 w-4" />
            Εισαγωγή
          </Button>
          <Button 
            size="sm" 
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Νέο Κλειδί
          </Button>
        </div>
      )}
    </div>
  );
};
