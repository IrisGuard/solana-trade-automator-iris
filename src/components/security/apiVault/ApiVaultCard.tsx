
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { ApiKey } from "./types";

export const ApiVaultCard = () => {
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Κλειδιά API</h2>
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
        <p className="text-muted-foreground text-sm">
          Κλειδιά API που έχουν αποθηκευτεί στη συσκευή σας.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {apiKeys.length > 0 ? (
            <div className="border rounded-md p-4">
              <ul className="space-y-3">
                {apiKeys.map((key, index) => (
                  <li key={index} className="border-b pb-3 last:border-0 last:pb-0">
                    <div className="font-medium">{key.name || "Κλειδί API"}</div>
                    <div className="text-sm text-muted-foreground flex justify-between">
                      <span>Υπηρεσία: {key.service || "Άγνωστη"}</span>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                        {key.status || "active"}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Δεν έχουν βρεθεί αποθηκευμένα κλειδιά API
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
