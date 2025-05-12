
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Download } from "lucide-react";
import { ApiKey } from "./types";

export const KeyRecoveryView = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(() => {
    try {
      const savedKeys = localStorage.getItem('apiKeys');
      if (savedKeys) {
        return JSON.parse(savedKeys);
      }
      return [];
    } catch (e) {
      console.error('Error loading keys:', e);
      return [];
    }
  });

  const handleExportKeys = () => {
    if (apiKeys.length === 0) {
      toast.error("Δεν υπάρχουν κλειδιά για εξαγωγή");
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
      toast.success("Τα κλειδιά εξήχθησαν επιτυχώς");
    } catch (error) {
      console.error("Error exporting keys:", error);
      toast.error("Σφάλμα κατά την εξαγωγή των κλειδιών");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 justify-end">
        {apiKeys.length > 0 && (
          <Button 
            variant="outline" 
            className="gap-2" 
            onClick={handleExportKeys}
          >
            <Download className="h-4 w-4" />
            Εξαγωγή Κλειδιών
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Αποθηκευμένα Κλειδιά API</h3>
              <p className="text-muted-foreground">
                {apiKeys.length > 0 
                  ? `Βρέθηκαν ${apiKeys.length} αποθηκευμένα κλειδιά API` 
                  : "Δεν βρέθηκαν αποθηκευμένα κλειδιά API"}
              </p>
            </div>
            
            {apiKeys.length > 0 && (
              <div className="w-full max-h-[300px] overflow-y-auto mt-4 border rounded-md p-4">
                <ul className="space-y-2">
                  {apiKeys.map((key, index) => (
                    <li key={index} className="text-left border-b pb-2 last:border-0">
                      <div className="font-medium">{key.name || "Κλειδί API"}</div>
                      <div className="text-sm text-muted-foreground">Υπηρεσία: {key.service || "Άγνωστη"}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
