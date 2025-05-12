
import React from "react";
import { Card } from "@/components/ui/card";
import { ServerIcon, FolderIcon } from "lucide-react";

interface RecoveryLocationsProps {
  locations: { storageKey: string; count: number }[];
}

export const RecoveryLocations: React.FC<RecoveryLocationsProps> = ({ locations }) => {
  if (locations.length === 0) return null;
  
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Πηγές Κλειδιών</h3>
        <p className="text-sm text-muted-foreground">
          Τοποθεσίες από όπου ανακτήθηκαν κλειδιά
        </p>
      </div>

      <div className="grid gap-2">
        {locations.map((location) => (
          <Card 
            key={location.storageKey}
            className="p-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              {location.storageKey.includes('pattern') ? (
                <ServerIcon className="h-4 w-4 text-purple-500" />
              ) : (
                <FolderIcon className="h-4 w-4 text-blue-500" />
              )}
              <span className="text-sm font-medium truncate max-w-[200px]">
                {location.storageKey}
              </span>
            </div>
            <span className="text-sm bg-muted px-2 py-1 rounded-full">
              {location.count} κλειδιά
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
};
